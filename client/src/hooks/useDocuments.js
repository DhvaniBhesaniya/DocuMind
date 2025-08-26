import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient.js";
import { toast } from "@/hooks/use-toast.js";
import { useAuth } from "@/hooks/useAuth.js";

export function useDocuments() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ["/api/documents"],
    // Only enable query when user is authenticated
    enabled: isAuthenticated,
    // Poll while any document is uploading or processing, stop when all are done/errored
    refetchInterval: (query) => {
      // Don't poll if user is not authenticated
      if (!isAuthenticated) return false;
      
      const docs = query.state.data;
      const shouldPoll = Array.isArray(docs)
        ? docs.some((d) => d?.status === "uploading" || d?.status === "processing")
        : false; // Don't poll if no data yet - let it fetch once and stop
      return shouldPoll ? 3000 : false;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 0,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const token = localStorage.getItem("token");
      const headers = {};
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
        headers,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Success",
        description: "Document uploaded successfully and processing started.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (documentId) => {
      const response = await apiRequest("DELETE", `/api/documents/${documentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document Deleted",
        description: "Document has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    },
  });
}
