// components/AIChat.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, Activity, Cpu } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  metadata?: {
    intent?: string;
    processingTime?: number;
    model?: string;
  };
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hi! 👋 I'm Vamsi's AI assistant powered by a custom MCP backend. I have access to his complete professional profile.\n\nAsk me anything about his skills, experience, projects, or the performance optimizations on this page!",
      metadata: { model: "mcp-assistant-v1", intent: "greeting" }
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState<"idle" | "connecting" | "connected">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);
    setApiStatus("connecting");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          conversationHistory: messages.slice(-6) // Send last 6 messages for context
        }),
      });

      setApiStatus("connected");
      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data.response,
          metadata: data.metadata
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "Sorry, I encountered an error processing your request. Please try again!",
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Connection error. The API endpoint might be loading. Please try again!",
      }]);
    }
    
    setIsTyping(false);
    setTimeout(() => setApiStatus("idle"), 2000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 ${isOpen ? 'hidden' : ''}`}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.div>
        
        {/* Notification badge */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative w-2 h-2 bg-green-500 rounded-full"></span>
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-black/10 dark:border-white/10 flex flex-col bg-white dark:bg-gray-900"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Assistant</h3>
                  <div className="flex items-center gap-1 text-white/70 text-xs">
                    <Sparkles className="w-3 h-3" />
                    <span>Powered by MCP</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "assistant" 
                      ? "bg-gradient-to-br from-indigo-500 to-purple-500" 
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}>
                    {msg.role === "assistant" ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.role === "assistant"
                      ? "bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {/* Metadata display */}
                    {msg.role === "assistant" && msg.metadata && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Cpu className="w-3 h-3" /> {msg.metadata.model || "mcp-v1"}
                        </span>
                        {msg.metadata.processingTime && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Activity className="w-3 h-3" /> {msg.metadata.processingTime}ms
                          </span>
                        )}
                        {msg.metadata.intent && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-500 rounded">
                            {msg.metadata.intent}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                      {apiStatus === "connecting" && (
                        <span className="text-[10px] text-indigo-500">Calling /api/chat...</span>
                      )}
                      {apiStatus === "connected" && (
                        <span className="text-[10px] text-green-500">Processing response...</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* API Status Bar */}
            <div className="px-4 py-1.5 bg-gray-900 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${apiStatus === "idle" ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
                <span className="text-[10px] text-gray-400 font-mono">
                  {apiStatus === "idle" ? "API Ready" : apiStatus === "connecting" ? "Connecting..." : "Connected"}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">/api/chat</span>
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {["Skills", "Experience", "Projects", "Performance", "Backend", "Contact"].map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      setInput(action);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="px-3 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors whitespace-nowrap"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
