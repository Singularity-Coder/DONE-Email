"use client";

import { useAppStore } from "@/lib/store";
import {
  ArrowLeft,
  Search,
  LayoutGrid,
  List,
  Plus,
  Bomb,
  Trash2,
  AtSign,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { getHandlesForDomain } from "@/lib/mock-data";

export function DomainDetailView() {
  const { selectedDomain, goBack, selectHandle, handles, unsubscribeHandle, deleteHandle } =
    useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  if (!selectedDomain) return null;

  const domainHandles = handles[selectedDomain.id] || [];
  const filteredHandles = domainHandles.filter((h) =>
    !searchQuery || h.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              @{selectedDomain.domain}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {selectedDomain.totalCount} emails &middot;{" "}
              {domainHandles.length} senders
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 focus-within:border-gray-400 transition-colors">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search senders..."
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {viewMode === "list" ? (
              <LayoutGrid className="w-4 h-4" />
            ) : (
              <List className="w-4 h-4" />
            )}
          </button>
          <button className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Handle List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {filteredHandles.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No senders found</p>
          </div>
        )}

        {filteredHandles.map((handle) => (
          <div
            key={handle.id}
            onClick={() => selectHandle(handle)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer group"
          >
            {/* Avatar */}
            <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-gray-600">
                {handle.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>

            {/* Handle Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {handle.name}
                </span>
                {handle.unsubscribeMethod === "header" && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                    1-click unsub
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {handle.email} &middot; {handle.totalCount} emails
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  unsubscribeHandle(handle.id);
                }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                title="Unsubscribe"
              >
                <Bomb className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHandle(handle.id);
                }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                title="Reply Later"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors"
                title="Low Priority"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-500 transition-colors"
                title="Bookmark"
              >
                <Star className="w-4 h-4" />
              </button>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
