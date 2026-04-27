"use client";

import { useAppStore } from "@/lib/store";
import { AIChatMessage } from "@/lib/types";
import { Sparkles, Send, X, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function AIPanel() {
  const { aiPanelOpen, toggleAIPanel, aiMessages, addAIMessage, aiLoading, setAILoading } =
    useAppStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiMessages]);

  const handleSend = async () => {
    if (!input.trim() || aiLoading) return;

    const userMessage: AIChatMessage = {
      id: `ai-${Date.now()}-user`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    addAIMessage(userMessage);
    setInput("");
    setAILoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        invoice: "I found 3 emails related to invoices:\n\n1. **Invoice #INV-2026-0892** from priya@google.com - $4,250.00 due May 27\n2. **Cloud billing summary** from Google Cloud - $1,284.56 for April\n3. **Payment confirmation** from Stripe - Processed on Apr 15\n\nWould you like me to open any of these?",
        summarize: "Here's a summary of your recent emails:\n\n- **Google (435 emails)**: Mostly notifications and cloud billing. Ravi is discussing Q3 product launch metrics.\n- **GitHub (234 emails)**: PR #342 was merged - semantic search feature added.\n- **Vercel (32 emails)**: A production deployment failed - TypeScript error in store.ts.\n- **Stripe (87 emails)**: Recent invoice and payment confirmations.\n\nYour most urgent item appears to be the Vercel deployment failure.",
        unsubscribe: "I can help you unsubscribe! Here are the domains with the most unsubscribe-able emails:\n\n1. **x.com** (900 emails) - 900 notifications, most can be unsubscribed\n2. **facebook.com** (600 emails) - 595 are notifications/marketing\n3. **linkedin.com** (342 emails) - All are notification/marketing emails\n\nShall I process any of these?",
      };

      const lowerInput = userMessage.content.toLowerCase();
      let response = "I understand you're asking about your emails. While I'm a demo AI assistant, in the full version I can:\n\n- Search emails semantically\n- Summarize threads and conversations\n- Find invoices, receipts, and important emails\n- Suggest unsubscribe actions\n\nTry asking about invoices, summaries, or unsubscribing!";

      if (lowerInput.includes("invoice") || lowerInput.includes("receipt") || lowerInput.includes("payment")) {
        response = responses.invoice;
      } else if (lowerInput.includes("summar") || lowerInput.includes("overview") || lowerInput.includes("digest")) {
        response = responses.summarize;
      } else if (lowerInput.includes("unsub") || lowerInput.includes("spam") || lowerInput.includes("newsletter")) {
        response = responses.unsubscribe;
      }

      const assistantMessage: AIChatMessage = {
        id: `ai-${Date.now()}-assistant`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      addAIMessage(assistantMessage);
      setAILoading(false);
    }, 1200);
  };

  if (!aiPanelOpen) return null;

  return (
    <aside className="w-[340px] min-w-[340px] h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-600" />
          </div>
          <span className="font-semibold text-sm text-gray-900">
            DONE! AI
          </span>
        </div>
        <button
          onClick={toggleAIPanel}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {aiMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-gray-900 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-700 rounded-bl-md"
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {aiLoading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-gray-400 transition-colors">
          <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me anything..."
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || aiLoading}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              input.trim() && !aiLoading
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "text-gray-300"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {["Summarize my emails", "Find invoices", "Help me unsubscribe"].map(
            (suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="text-[11px] px-2 py-1 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
              >
                {suggestion}
              </button>
            )
          )}
        </div>
      </div>
    </aside>
  );
}
