"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Send, Brain, RefreshCw, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/UI/Toast";
import ChatMessage from "@/components/ai-coach/ChatMessage";
import QuickPrompts from "@/components/ai-coach/QuickPrompts";
import TypingIndicator from "@/components/ai-coach/TypingIndicator";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  isGeneratedPlan?: boolean;
}

export default function AICoach() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        type: "ai",
        content: `Hey there, busy bee! 🐝 I'm your AI Study Coach, ready to help you create the perfect learning plan!\n\nWhat would you like to learn today? I can help you with:\n• Creating personalized study schedules\n• Breaking down complex topics into manageable chunks\n• Adjusting your existing plans\n• Setting realistic learning goals\n\nJust tell me what you want to learn and how much time you have!`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70A961] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Coach...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (status === "unauthenticated") {
    return null;
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-generated-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: inputValue,
          currentSchedule: currentPlan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          data.type === "question"
            ? data.message
            : "Great! I've created a personalized study plan for you. Here's what I recommend:",
        timestamp: new Date(),
        isGeneratedPlan: data.type === "schedule",
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.type === "schedule") {
        setCurrentPlan(data);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Oops! Something went wrong on my end 🐝💔. ${
          error instanceof Error ? error.message : "Please try again!"
        }\n\nDon't worry, I'm still here to help you create that perfect study plan!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const savePlanToDashboard = async () => {
    if (!currentPlan) {
      showToast("No study plan available to save", "error");
      return;
    }

    try {
      const response = await fetch("/api/save-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aiPlan: currentPlan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save plan");
      }

      // Show success toast
      showToast(
        "🎉 Study plan saved successfully! Check your Goals section to track progress.",
        "success"
      );

      // Add success message to chat
      const successMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "Awesome! 🎉 Your AI-generated study plan has been saved and converted to trackable goals. You can now find it in your Goals section and track your progress!\n\nReady to create another plan or need any modifications to your current goals?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
      setCurrentPlan(null);
    } catch (error) {
      console.error("Error saving plan:", error);

      // Show error toast
      const errorMessage =
        error instanceof Error ? error.message : "Please try again!";
      showToast(`Failed to save plan: ${errorMessage}`, "error");

      // Add error message to chat
      const chatErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Oops! I couldn't save your plan right now 🐝💔. ${errorMessage}\n\nDon't worry, your plan is still visible above. You can try saving it again, or let me know if you need help!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, chatErrorMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#70A961] to-[#5f8c4b] rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    AI Study Coach
                  </h1>
                  <p className="text-sm text-gray-500">
                    Your personal learning assistant
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session?.user?.name || "Student"}
              </span>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(session?.user?.name || session?.user?.email || "S")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Quick Prompts Sidebar */}
        <QuickPrompts onPromptSelect={handleQuickPrompt} />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentPlan={message.isGeneratedPlan ? currentPlan : null}
                onSavePlan={savePlanToDashboard}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about creating your study plan... 🐝"
                    className="w-full p-4 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#70A961] focus:border-transparent transition-all duration-200"
                    rows={inputValue.split("\n").length || 1}
                    style={{ minHeight: "56px", maxHeight: "120px" }}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="absolute bottom-3 right-3 p-2 bg-[#70A961] text-white rounded-lg hover:bg-[#5f8c4b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
