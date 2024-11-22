"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface AssignmentDetails {
  subject: string;
  topic: string;
  deadline: string;
}

export default function AssignmentAssistantPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [assignmentDetails, setAssignmentDetails] = useState<AssignmentDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const storedAssignment = localStorage.getItem('assignmentDetails');
    if (!storedAssignment) {
      router.push("/assignment-setup");
      return;
    }

    const parsedDetails = JSON.parse(storedAssignment);
    setAssignmentDetails(parsedDetails);

    // Initial welcome message
    setMessages([
      {
        role: "assistant",
        content: `Hi there! I'm here to help you with your ${parsedDetails.subject} assignment on ${parsedDetails.topic}. How can I assist you today?`,
        timestamp: new Date().toISOString()
      }
    ]);
  }, [router]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
  
    const newUserMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
  
    try {
      setIsLoading(true);
      setError(null);
  
      setMessages(prev => [...prev, newUserMessage]);
      setInputMessage("");
  
      const response = await fetch("/api/assignment-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentDetails,
          message: inputMessage,
          chatHistory: messages
        }),
      });
  
      // Detailed error handling
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Full error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const data = await response.json();
  
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error("Detailed Chat error:", error);
      setError("Failed to send message. Please check your connection and try again.");
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I encountered an error processing your message. Please try again.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleResetAssignment = () => {
    localStorage.removeItem('assignmentDetails');
    router.push('/assignment-setup');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Assignment Assistant</h1>
        <div>
          {assignmentDetails && (
            <div className="text-sm">
              <p>{assignmentDetails.subject} - {assignmentDetails.topic}</p>
              <p>Deadline: {assignmentDetails.deadline}</p>
            </div>
          )}
          <button 
            onClick={handleResetAssignment}
            className="mt-2 bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-sm"
          >
            Change Assignment
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      )}

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <div className="break-words">{message.content}</div>
              {message.timestamp && (
                <div className="text-xs mt-1 opacity-70">
                  {formatTimestamp(message.timestamp)}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={isLoading ? "Assistant is thinking..." : "Ask about your assignment..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-grow px-4 py-2 border rounded"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}