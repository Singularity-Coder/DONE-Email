"use client";

import { useAppStore } from "@/lib/store";
import { mockThreads, getThreadsForHandle } from "@/lib/mock-data";
import { EmailThread } from "@/lib/types";
import {
  ArrowLeft,
  Search,
  Send,
  Paperclip,
  Smile,
  Plus,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export function ChatThreadView() {
  const { selectedHandle, selectedDomain, goBack, selectedThread, selectThread, sendReply } =
    useAppStore();
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const threads = selectedHandle
    ? getThreadsForHandle(selectedHandle.id)
    : [];

  // If no specific thread selected, show thread list
  if (selectedHandle && !selectedThread) {
    return (
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={goBack}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedHandle.name}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedHandle.email} &middot; {threads.length} threads
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              placeholder="Search threads..."
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {threads.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No threads found</p>
            </div>
          )}
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => selectThread(thread)}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {thread.subject}
                  </span>
                  {thread.hasAttachments && (
                    <Paperclip className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {thread.messages.length} messages &middot;{" "}
                  {formatTime(thread.messages[thread.messages.length - 1]?.sentAt)}
                </span>
              </div>
              <div className="flex gap-1">
                {thread.labels.map((label) => (
                  <span
                    key={label}
                    className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Chat thread view
  if (!selectedThread) return null;

  const messages = selectedThread.messages;

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    sendReply(selectedThread.id, replyText.trim());
    setReplyText("");
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3">
        <button
          onClick={() => selectThread(null as unknown as EmailThread)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">
            {selectedThread.subject}
          </h3>
          <p className="text-[11px] text-gray-500">
            {selectedHandle?.name} &middot; {messages.length} messages
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Date separator */}
        <div className="flex items-center justify-center">
          <span className="text-[11px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            {formatDate(messages[0]?.sentAt)}
          </span>
        </div>

        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2.5 max-w-[80%]",
              msg.isMe ? "ml-auto" : ""
            )}
          >
            {!msg.isMe && (
              <div className="w-8 h-8 bg-gradient-to-br from-violet-200 to-violet-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[10px] font-semibold text-violet-700">
                  {msg.sender
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <div
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  msg.isMe
                    ? "bg-gray-900 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-700 rounded-bl-md"
                )}
              >
                <div className="whitespace-pre-wrap">{msg.bodyText}</div>
              </div>
              {/* Attachments */}
              {msg.attachments.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  {msg.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-700 font-medium">
                        {att.name}
                      </span>
                      <span className="text-gray-400">{att.size}</span>
                    </div>
                  ))}
                </div>
              )}
              <span
                className={cn(
                  "text-[10px] text-gray-400 mt-1 block",
                  msg.isMe ? "text-right" : "text-left"
                )}
              >
                {msg.sender} &middot; {formatTime(msg.sentAt)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input */}
      <div className="px-6 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 focus-within:border-gray-400 transition-colors">
          <button className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendReply();
              }
            }}
            placeholder={`Reply to ${selectedHandle?.name || "thread"}...`}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
          />
          <button className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors">
            <Smile className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors">
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            onClick={handleSendReply}
            disabled={!replyText.trim()}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              replyText.trim()
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "text-gray-300"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(date: Date | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(date: Date | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
