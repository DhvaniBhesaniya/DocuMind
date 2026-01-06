# DocuMind

<div align="center">

**AI-Powered Document Intelligence Platform**

Chat with your PDFs using advanced RAG (Retrieval-Augmented Generation) technology powered by Google Gemini

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D19.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.3.1-blue)](https://reactjs.org/)

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

<div align="center">
  <img src="./documind-hero.png" alt="DocuMind - AI-Powered Document Intelligence" width="100%" />
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)
- [Security Considerations](#-security-considerations)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**DocuMind** is a full-stack intelligent document chat application that transforms how you interact with PDF documents. Upload your PDFs, and DocuMind will index them into a vector database, enabling you to have natural conversations about your documents with AI-powered responses that include precise source citations.

### What Makes DocuMind Special?

- **Intelligent RAG Pipeline**: Sophisticated document processing with chunking, embedding, and semantic search
- **Source Attribution**: Every AI response includes citations with document name, page number, and relevant excerpts
- **Real-time Progress Tracking**: Monitor document processing stages and completion percentage
- **Modern User Experience**: Beautiful, responsive UI with dark/light theme support
- **Production-Ready**: Built with enterprise-grade technologies and best practices

---

## ✨ Features

### 🤖 AI-Powered Chat
- **Context-Aware Responses**: Get accurate answers grounded in your uploaded documents
- **Source Citations**: Every response includes references to specific pages and excerpts
- **Multi-Document Support**: Chat across multiple documents or filter by specific files
- **Conversation History**: Persistent chat sessions with searchable message history

### 📄 Document Management
- **PDF Upload & Processing**: Drag-and-drop PDF uploads with automatic text extraction
- **Real-time Status Tracking**: Live progress indicators for document processing stages
- **Vector Indexing**: Automatic embedding generation and storage in Pinecone
- **Document Library**: Manage all your uploaded documents in one place

### 🎨 User Experience
- **Modern UI/UX**: Built with React 18 and shadcn/ui components
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Dark/Light Themes**: Toggle between themes for comfortable viewing
- **Fast & Smooth**: Optimized with React Query for efficient data fetching

### 🔐 Authentication & Security
- **User Authentication**: Secure email/password registration and login
- **JWT-Based Sessions**: Token-based authentication for API security
- **Profile Management**: Update user information and preferences
- **Protected Routes**: Secure access control for all sensitive operations

---

## 🎬 Demo

> **Note**: Add screenshots or GIFs of your application here to showcase the UI and features

```
[Upload Interface] → [Processing Status] → [Chat Interface] → [Response with Citations]
```

---

## 🏗️ Architecture

DocuMind follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth UI    │  │  Upload UI   │  │   Chat UI    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│                    Server (Node.js/Express)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Routes  │  │  Doc Routes  │  │ Chat Routes  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │PDF Processor │  │Gemini Service│  │Pinecone Store│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │   Pinecone   │  │Google Gemini │
│  (Documents) │  │   (Vectors)  │  │  (AI Model)  │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Data Flow

1. **Upload Phase**
   - User uploads PDF → MongoDB document record created (status: "uploading")
   - File stored temporarily for processing

2. **Processing Phase**
   - Text extraction using `pdf-parse`
   - Content chunking for optimal context windows
   - Embedding generation via Google Gemini API
   - Vector storage in Pinecone with metadata
   - MongoDB status updates with progress tracking

3. **Chat Phase**
   - User sends message → Conversation created/retrieved
   - Semantic search in Pinecone (with optional document filtering)
   - Context composition from relevant chunks
   - AI response generation via Gemini
   - Message storage with source citations

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Wouter** - Lightweight routing
- **TanStack Query** - Powerful data synchronization
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - Document database for users, documents, and conversations
- **Pinecone** - Vector database for semantic search
- **Google Gemini** - AI model for embeddings and generation
- **JWT** - Secure authentication tokens
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction

### DevOps & Tools
- **Vite** - Fast build tool and dev server
- **ESBuild** - Lightning-fast bundler
- **Drizzle ORM** - Type-safe database toolkit
- **dotenv** - Environment variable management

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v19 or higher)
- **npm** or **yarn**
- **MongoDB** (Atlas account or local instance)
- **Pinecone** account with API key
- **Google Gemini** API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/documind.git
   cd documind
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials (see [Environment Setup](#-environment-setup))

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5001`

---

## ⚙️ Environment Setup

Create a `.env` file in the project root with the following variables:

```bash
# Server Configuration
PORT=5001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=documind

# Pinecone Configuration
PINECONE_API_KEY=pcsk_your_pinecone_api_key_here

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here
# Alternative: GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# File Upload Configuration (Optional)
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=uploads
```

### Getting API Keys

- **MongoDB**: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster
- **Pinecone**: Get your API key from [Pinecone Console](https://app.pinecone.io/)
- **Google Gemini**: Obtain API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Important Notes

- **Pinecone Index**: Automatically created on first use with:
  - Name: `ai-doc-chat`
  - Dimensions: `1024`
  - Metric: `cosine`
  - Cloud: `aws` (region: `us-east-1`)
  
- **Embedding Dimensions**: Gemini returns 768-dimensional embeddings, which are automatically padded to 1024 to match the Pinecone index

---

## 📖 Usage Guide

### 1. Register an Account

- Navigate to the application
- Click "Sign Up" or "Register"
- Enter your email and password
- Click "Create Account"

### 2. Upload Documents

- After logging in, click the "Upload" button in the sidebar
- Select one or more PDF files (max 10MB each)
- Watch the real-time processing status:
  - ⏳ Uploading
  - 🔄 Processing
  - ✅ Completed

### 3. Start Chatting

- Once a document shows "Completed" status, select it from the sidebar
- Type your question in the chat input
- Press Enter or click Send
- Receive AI-generated responses with source citations

### 4. Advanced Features

- **Multi-Document Chat**: Leave document filter empty to search across all documents
- **Conversation Management**: View and manage chat history
- **Profile Settings**: Update your profile information
- **Theme Toggle**: Switch between light and dark modes

---

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}

Response: { "user": {...}, "token": "jwt_token" }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: { "user": {...}, "token": "jwt_token" }
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response: { "user": {...} }
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "newemail@example.com"
}

Response: { "user": {...} }
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>

Response: { "message": "Logged out successfully" }
```

### Document Endpoints

All document endpoints require authentication (`Authorization: Bearer <token>`)

#### Upload Document
```http
POST /api/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
  file: <PDF file> (max 10MB)

Response: { "document": {...}, "message": "Upload successful" }
```

#### List Documents
```http
GET /api/documents
Authorization: Bearer <token>

Response: { "documents": [...] }
```

#### Get Document Details
```http
GET /api/documents/:id
Authorization: Bearer <token>

Response: { "document": {...} }
```

#### Get Processing Status
```http
GET /api/documents/:id/status
Authorization: Bearer <token>

Response: { 
  "status": "completed",
  "progress": 100,
  "stage": "indexing",
  "message": "Document processed successfully"
}
```

#### Delete Document
```http
DELETE /api/documents/:id
Authorization: Bearer <token>

Response: { "message": "Document deleted successfully" }
```

### Chat Endpoints

All chat endpoints require authentication

#### Send Message (Unified)
```http
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "What is the main topic of this document?",
  "conversationId": "optional_conversation_id",
  "documentName": "optional_document_filter.pdf"
}

Response: {
  "conversationId": "...",
  "userMessage": {...},
  "aiMessage": {
    "content": "The main topic is...",
    "sources": [
      {
        "documentName": "document.pdf",
        "page": 5,
        "excerpt": "relevant text..."
      }
    ]
  }
}
```

#### Create Conversation
```http
POST /api/chat/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Discussion about Document X"
}

Response: { "conversation": {...} }
```

#### List Conversations
```http
GET /api/chat/conversations
Authorization: Bearer <token>

Response: { "conversations": [...] }
```

#### Get Conversation with Messages
```http
GET /api/chat/conversations/:id
Authorization: Bearer <token>

Response: { 
  "conversation": {...},
  "messages": [...]
}
```

#### Send Message to Conversation
```http
POST /api/chat/conversations/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Tell me more about section 3",
  "documentName": "optional_filter.pdf"
}

Response: { "userMessage": {...}, "aiMessage": {...} }
```

#### Update Conversation Title
```http
PUT /api/chat/conversations/:id/title
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New conversation title"
}

Response: { "conversation": {...} }
```

---

## 📁 Project Structure

```
documind/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── chat/        # Chat-related components
│   │   │   ├── documents/   # Document management UI
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   └── theme/       # Theme provider & toggle
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useAuth.js   # Authentication hook
│   │   │   ├── useChat.js   # Chat functionality
│   │   │   └── useDocuments.js
│   │   ├── pages/           # Page components
│   │   │   ├── home.jsx     # Main chat interface
│   │   │   ├── auth.jsx     # Login/Register
│   │   │   └── Profile.jsx  # User profile
│   │   ├── lib/             # Utility functions
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   └── index.html
│
├── server/                   # Backend Express application
│   ├── routes/              # API route definitions
│   │   ├── authRoutes.js    # Authentication routes
│   │   ├── documentRoutes.js # Document management
│   │   └── chatRoutes.js    # Chat endpoints
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── documentController.js
│   │   └── chatController.js
│   ├── services/            # Business logic
│   │   ├── pdfProcessor.js  # PDF parsing & chunking
│   │   ├── gemini.js        # Gemini API integration
│   │   └── pineconeStore.js # Vector operations
│   ├── models/              # Data models
│   │   └── storage.js       # MongoDB operations
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT verification
│   │   └── user.js          # User context
│   ├── config/              # Configuration
│   │   └── database.js      # DB initialization
│   ├── utils/               # Helper functions
│   ├── index.js             # Server entry point
│   └── vite.js              # Vite middleware
│
├── shared/                   # Shared code between client/server
├── .env                      # Environment variables (not in git)
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── components.json          # shadcn/ui config
└── README.md
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem**: `MongoServerError: TLS/SSL connection failed`

**Solutions**:
- Verify your `MONGODB_URI` is correct
- Check MongoDB Atlas network access settings (whitelist your IP)
- Ensure your cluster supports TLS/SSL connections
- Try using a different MongoDB provider or local instance

### Pinecone Index Errors

**Problem**: `PineconeError: Index not found` or `Invalid API key`

**Solutions**:
- Verify `PINECONE_API_KEY` is set correctly in `.env`
- Ensure your Pinecone account supports serverless indexes in `aws/us-east-1`
- Check if the index `ai-doc-chat` exists in your Pinecone dashboard
- The app will auto-create the index on first use if it doesn't exist

### Google Gemini API Errors

**Problem**: `API key not valid` or `Quota exceeded`

**Solutions**:
- Verify `GEMINI_API_KEY` or `GOOGLE_AI_API_KEY` is set correctly
- Check your API key is active in [Google AI Studio](https://makersuite.google.com/)
- Review your API quota limits
- Some regions may have different quota restrictions

### PDF Processing Failures

**Problem**: Document stuck in "processing" or shows error status

**Solutions**:
- **Encrypted PDFs**: Cannot be processed. Remove password protection first
- **Scanned/Image PDFs**: Text extraction may fail. Use OCR-processed PDFs
- **Corrupted files**: Re-export or regenerate the PDF
- **Large files**: Files over 10MB are rejected. Compress or split the document
- Check server logs for specific error messages

### Authentication Issues

**Problem**: `401 Unauthorized` errors or login failures

**Solutions**:
- Clear browser `localStorage` and try logging in again
- Verify `JWT_SECRET` is set in `.env`
- Check that `Authorization: Bearer <token>` header is included in requests
- Ensure token hasn't expired (default expiry may vary)

### Build/Development Errors

**Problem**: `npm run dev` fails or build errors

**Solutions**:
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Ensure Node.js version is 19 or higher: `node --version`
- Check for port conflicts (default: 5001)
- Review console for specific error messages

### Performance Issues

**Problem**: Slow response times or timeouts

**Solutions**:
- **Large documents**: Processing time increases with document size
- **Pinecone latency**: Check your Pinecone region and network connection
- **Gemini API**: Response times vary based on load and region
- Consider implementing caching for frequently accessed data

---

## 🔒 Security Considerations

### Production Deployment Checklist

- [ ] **Change `JWT_SECRET`**: Use a strong, random secret (32+ characters)
- [ ] **Enable HTTPS**: Use SSL/TLS certificates (Let's Encrypt, Cloudflare)
- [ ] **Secure MongoDB**: Use strong passwords, enable IP whitelisting
- [ ] **API Key Protection**: Never commit `.env` to version control
- [ ] **Rate Limiting**: Implement rate limiting on API endpoints
- [ ] **Input Validation**: Validate and sanitize all user inputs
- [ ] **File Upload Security**: 
  - Enforce file type restrictions (PDF only)
  - Limit file sizes (current: 10MB)
  - Scan uploads for malware
- [ ] **CORS Configuration**: Restrict allowed origins in production
- [ ] **Environment Variables**: Use secure secret management (AWS Secrets Manager, etc.)
- [ ] **Logging**: Implement proper logging without exposing sensitive data
- [ ] **Dependencies**: Regularly update packages for security patches

### Current Security Measures

✅ JWT-based authentication  
✅ Password hashing with bcrypt  
✅ File type validation (PDF only)  
✅ File size limits (10MB)  
✅ Protected API routes  
✅ MongoDB connection encryption  

### Known Limitations

⚠️ JWT stored in `localStorage` (vulnerable to XSS) - Consider `httpOnly` cookies  
⚠️ In-memory file upload buffer - May not scale for high traffic  
⚠️ No rate limiting by default - Add in production  

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 DHVANI BHESANIYA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **Google Gemini** for powerful AI capabilities
- **Pinecone** for vector database infrastructure
- **MongoDB** for flexible document storage
- **shadcn/ui** for beautiful UI components
- **Radix UI** for accessible primitives
- **Vercel** for Vite and excellent tooling

---

## 📞 Support

If you encounter any issues or have questions:

- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/documind/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/documind/discussions)

---

<div align="center">

**Built with ❤️ by [Dhvani Bhesaniya](https://github.com/yourusername)**

⭐ Star this repo if you find it helpful!

</div>
