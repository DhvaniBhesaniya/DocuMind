import { GoogleGenAI } from "@google/genai";
import { pineconeStore } from "./pineconeStore.js";

let genAI = null;

// Initialize function that will be called when needed
async function initializeGemini() {
  if (genAI) {
    return; // Already initialized
  }

  console.log(
    "Gemini API Key loaded:",
    process.env.GEMINI_API_KEY ? "Yes (hidden)" : "No"
  );

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("No Gemini API key found in environment variables");
    }
    genAI = new GoogleGenAI(apiKey);
    console.log("GoogleGenAI client initialized successfully");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
    genAI = null;
    throw error;
  }
}

export async function createEmbedding(text) {
  try {
    await initializeGemini();
    if (!genAI) {
      throw new Error("GoogleGenAI client not initialized");
    }

    console.log("Creating embedding for text:", text.substring(0, 100) + "...");
    const embeddingModel = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });
    const result = await embeddingModel.embedContent(text);

    const embedding = result.embedding;
    console.log("Embedding created successfully");

    // The text-embedding-004 model produces a 768-dimensional vector.
    // If your Pinecone index requires 1024 dimensions, padding is necessary.
    const embedding1024 = new Array(1024).fill(0);
    embedding.values.forEach((value, index) => {
      embedding1024[index] = value;
    });

    console.log(
      `Padded embedding from ${embedding.values.length} to ${embedding1024.length} dimensions`
    );
    return embedding1024;
  } catch (error) {
    console.error("Error creating embedding:", error);
    throw new Error(`Failed to create embedding: ${error.message}`);
  }
}

export async function generateChatResponse(
  query,
  userId,
  selectedDocumentName = null
) {
  try {
    await initializeGemini();
    if (!genAI) {
      throw new Error("GoogleGenAI client not initialized");
    }

    // Search for relevant document chunks in Pinecone
    const queryEmbedding = await createEmbedding(query);

    const filter = selectedDocumentName
      ? { documentName: selectedDocumentName }
      : undefined;
    if (filter) {
      console.log(
        `Filtering search results to document: ${selectedDocumentName}`
      );
    }

    const searchResults = await pineconeStore.queryVectors(
      queryEmbedding,
      5,
      filter
    );

    if (!searchResults || searchResults.length === 0) {
      return {
        content:
          "I'm sorry, but I don't know the answer. The information is not available in the document.",
        sources: [],
      };
    }

    const context = searchResults
      .map((result) => result.metadata.content)
      .join("\n\n");
    const sources = searchResults.map((result) => ({
      documentId: result.metadata.documentId,
      documentName: result.metadata.documentName || "Unknown Document",
      pageNumber: result.metadata.pageNumber || 1,
      excerpt: result.metadata.content.substring(0, 200) + "...",
    }));

    const systemInstruction = `You are an AI assistant that helps users understand their documents. 
    Answer queries ONLY based on the provided context from the documents.
    If the context doesn't contain enough information, respond exactly with: "I'm sorry, but I don't know the answer. The information is not available in the document."`;

    const generativeModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const userPrompt = `Query: ${query}

Context from documents:
${context}

Please provide a helpful answer based ONLY on the context above.`;

    const result = await generativeModel.generateContent(userPrompt);
    const response = await result.response;
    const generatedText =
      response.text() ||
      "I apologize, but I couldn't generate a response at this time.";

    return {
      content: generatedText,
      sources,
    };
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

export async function generateTitle(firstMessage) {
  try {
    await initializeGemini();
    if (!genAI) {
      return "New Conversation";
    }

    const prompt = `Generate a short, descriptive title (3-5 words) for a conversation that starts with this message: "${firstMessage}"
    
    Return only the title, no quotes or additional text.`;

    const generativeModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text()?.trim();

    return text || "New Conversation";
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Conversation";
  }
}
