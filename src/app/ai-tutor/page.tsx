"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import UserDetails, { UserDetailsType } from "../components/UserDetails";
import PopupAI1 from "../components/PopupAI1";
import AITutorGuidePopup from "../components/AITutorGuidePopup";

// Keep the existing icon components (TutorIcon, SendIcon, ErrorIcon)...

// Custom icons to avoid external imports
const TutorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="16" y1="9" x2="8" y2="9" />
    <line x1="16" y1="13" x2="8" y2="13" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22 11 13 2 9 22 2Z" />
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-red-500 mr-4">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

interface LearningSession {
  subject: string;
  description: string;
  educationLevel: string;
  studyTime: number;
  startTime: number;
  notes?: string; // Added to store generated notes
  questions?: string; // Added to store generated questions
}


export default function AITutorPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [userDetails, setUserDetails] = useState<UserDetailsType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  const [learningSession, setLearningSession] = useState<LearningSession | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);



  const [showGuidePopup, setShowGuidePopup] = useState(true); // New state for guide popup
  const [showStudyPopup, setShowStudyPopup] = useState(false); // Renamed from showPopup




  // Scroll management
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Authentication and session management
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        setError(null);

        const details = UserDetails.getUserDetails();
        if (!details) {
          router.push("/auth");
          return;
        }

        setUserDetails(details);
        
        // Check for existing learning session
            // Check for existing learning session
            const savedSession = localStorage.getItem('learningSession');
            if (savedSession) {
              const session = JSON.parse(savedSession);
              setLearningSession(session);
              setRemainingTime(session.startTime + session.studyTime * 60000 - Date.now());
              setShowStudyPopup(false);
              setShowGuidePopup(false);
            } else {
              // If no existing session, first show guide popup, then study popup
              setShowGuidePopup(true);
            }
          } catch (error) {
            console.error("Auth check failed:", error);
            setError("Authentication failed. Please try logging in again.");
            router.push("/auth");
          } finally {
            setIsCheckingAuth(false);
          }
        };
    
        checkAuth();
      }, [router]);














      

  // Timer management
 



 // Modified popup submission handler to match backend
  const handlePopupSubmit = async (details: {
    subject: string;
    description: string;
    educationLevel: string;
    studyTime: number;
  }) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...details,
          userId: userDetails?.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start learning session');
      }

      const data = await response.json();
      
      const session = {
        ...details,
        startTime: Date.now(),
        notes: data.notes // Store the AI-generated notes
      };

      setLearningSession(session);
      localStorage.setItem('learningSession', JSON.stringify(session));
      setRemainingTime(details.studyTime * 60000);
      setShowPopup(false);



      // Initial assistant message
      // Add the study notes as the first message
      const initialMessages: Message[] = [
        {
          role: "assistant",
          content: `Welcome to your study session on ${details.subject}! Here are your study notes:\n\n${data.notes}`,
          timestamp: new Date().toISOString()
        }
      ];
      
      setMessages(initialMessages);
    } catch (error) {
      console.error('Failed to start learning session:', error);
      setError('Could not start learning session. Please try again.');
    }
  };


  // New chat handler
  const handleNewChat = () => {
    localStorage.removeItem("chatMessages"); // Clear messages from localStorage
    localStorage.removeItem("learningSession");
    setLearningSession(null);
    setMessages([]); // Clear chat messages
    setShowPopup(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };




  // Message sending logic
   // Modified message sending logic to match backend
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

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userDetails,
          message: inputMessage,
          chatHistory: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };




   // Add session end handler
   // Modified session end handler to include chat history
  const handleSessionEnd = async () => {
    try {
      setIsGeneratingQuestions(true);
      
      // Add a message to indicate questions are being generated
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Your study session has ended! I'm analyzing our discussion to create personalized questions...",
        timestamp: new Date().toISOString()
      }]);

      // Filter out system messages and keep only the learning content
      const relevantHistory = messages.filter(msg => 
        msg.role !== "system" && 
        !msg.content.includes("analyzing our discussion") && 
        !msg.content.includes("Your study session has ended")
      );

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-End": "true"
        },
        body: JSON.stringify({
          subject: learningSession?.subject,
          description: learningSession?.description,
          chatHistory: relevantHistory.slice(-10) // Send last 10 messages to keep context manageable
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to end session');
      }

      const data = await response.json();
      
      // Add the generated questions as a message
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Based on our study session and discussion, here are your practice questions:\n\n${data.questions}`,
        timestamp: new Date().toISOString()
      }]);

      // Clear the session
      localStorage.removeItem("learningSession");
      setLearningSession(null);
    } catch (error) {
      console.error("Session end error:", error);
      setError("Failed to generate questions. Please save your notes before closing.");
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I encountered an error while generating your questions. Please make sure to save any important notes from our session.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };







 // Modify timer effect to handle session end
  // Modify the timer effect to show a warning before ending
  useEffect(() => {
    if (learningSession && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const timeLeft = learningSession.startTime + learningSession.studyTime * 60000 - currentTime;
        
        // Show warning when 1 minute remaining
        if (timeLeft <= 60000 && timeLeft > 55000) {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: "We have about 1 minute left in our session. I'll prepare some practice questions based on what we've covered.",
            timestamp: new Date().toISOString()
          }]);
        }
        
        if (timeLeft <= 0) {
          clearInterval(timerRef.current!);
          handleSessionEnd();
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [learningSession, remainingTime]);

  // Add loading indicator component for questions
  const renderQuestionLoadingIndicator = () => {
    if (!isGeneratingQuestions) return null;
    return (
      <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
        <span className="text-blue-600">Preparing your practice questions...</span>
      </div>
    );
  };





  // Keyboard and input handling
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Logout handler
  const handleLogout = () => {
    UserDetails.clearUserDetails();
    router.push('/auth');
  };

  // Render message with appropriate styling
  const renderMessageContent = (message: Message) => {
    switch(message.type) {
      case "code":
        return (
          <pre className="bg-gray-100 p-2 rounded-md text-sm overflow-x-auto">
            <code>{message.content}</code>
          </pre>
        );
      case "math":
        return (
          <div className="bg-gray-50 p-2 rounded-md italic">
            {message.content}
          </div>
        );
      case "warning":
        return (
          <div className="text-red-600 bg-red-50 p-2 rounded-md">
            {message.content}
          </div>
        );
      default:
        return <div>{message.content}</div>;
    }
  };

  // Render remaining time and session info
  const renderSessionInfo = () => {
    if (!learningSession) return null;

    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    return (
      <div className="bg-gray-100 p-2 text-center">
        Study Session: {learningSession.subject} ({minutes}m {seconds}s remaining)
      </div>
    );
  };

  // Loading or auth check state
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 min-h-screen bg-gray-50">
      {showPopup && (
        <PopupAI1 onSubmit={handlePopupSubmit} />
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <TutorIcon />
            AI Personal Tutor
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleNewChat}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm transition-colors"
            >
              New Chat
            </button>
            <span className="text-sm">
              {userDetails?.name || userDetails?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {renderSessionInfo()}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 flex items-center">
            <ErrorIcon />
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}



{renderQuestionLoadingIndicator()}

        {/* Messages Container */}
        {/* Messages Container - simplified styling */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 text-gray-800"
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.timestamp && (
                  <div className={`text-xs mt-1 ${
                    message.role === "user" ? "text-blue-200" : "text-gray-500"
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

           {/* Input Area */}
           <div className="border-t border-border p-4 bg-card">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              placeholder={isLoading ? "AI is thinking..." : "Ask your tutor anything..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              rows={3}
              className="flex-1 px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed resize-none"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className={`px-4 py-2 rounded-lg transition-colors self-end ${
                isLoading || !inputMessage.trim()
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-t-2 border-current rounded-full animate-spin" />
              ) : (
                <SendIcon />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}