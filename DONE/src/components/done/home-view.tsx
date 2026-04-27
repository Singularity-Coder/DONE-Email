"use client";

import { useAppStore } from "@/lib/store";
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  Bomb,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  CheckSquare,
  AtSign,
  ChevronRight,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function HomeView() {
  const {
    domains,
    selectDomain,
    searchQuery,
    setSearchQuery,
    semanticSearchEnabled,
    setSemanticSearchEnabled,
    multiSelectMode,
    toggleMultiSelect,
    selectedDomainIds,
    toggleDomainSelection,
    unsubscribeDomain,
    deleteDomain,
    muteDomain,
    pinDomain,
    moveDomainToFolder,
    folders,
  } = useAppStore();

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const filteredDomains = domains.filter((d) => {
    if (!searchQuery) return true;
    if (semanticSearchEnabled) {
      // Simulated semantic search
      const query = searchQuery.toLowerCase();
      return (
        d.domain.toLowerCase().includes(query) ||
        (query.includes("social") && ["facebook.com", "x.com", "linkedin.com"].includes(d.id)) ||
        (query.includes("dev") && ["github.com", "vercel.com", "notion.so"].includes(d.id)) ||
        (query.includes("payment") && ["stripe.com", "amazon.com"].includes(d.id)) ||
        (query.includes("design") && ["figma.com"].includes(d.id))
      );
    }
    return d.domain.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    if (status === "muted")
      return (
        <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
          Muted
        </span>
      );
    if (status === "unsubscribed")
      return (
        <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
          Unsubscribed
        </span>
      );
    return null;
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Home</h2>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 focus-within:border-gray-400 transition-colors">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search domains..."
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
            />
            <button
              onClick={() => setSemanticSearchEnabled(!semanticSearchEnabled)}
              className={cn(
                "text-[11px] px-2 py-0.5 rounded-full font-medium transition-all",
                semanticSearchEnabled
                  ? "bg-violet-100 text-violet-700"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              )}
            >
              Semantic
            </button>
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
          <button
            onClick={toggleMultiSelect}
            className={cn(
              "p-2.5 rounded-xl border transition-colors",
              multiSelectMode
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-500"
            )}
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <button className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Domain List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        {filteredDomains.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No domains found</p>
            <p className="text-xs mt-1">Try a different search query</p>
          </div>
        )}

        {filteredDomains.map((domain) => (
          <div
            key={domain.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("domainId", domain.id);
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              if (!multiSelectMode) {
                selectDomain(domain);
              } else {
                toggleDomainSelection(domain.id);
              }
            }}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all cursor-pointer group",
              dragOverId === domain.id
                ? "border-violet-300 bg-violet-50"
                : selectedDomainIds.includes(domain.id)
                ? "border-gray-400 bg-gray-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
              domain.status === "muted" && "opacity-60"
            )}
          >
            {/* Multi-select checkbox */}
            {multiSelectMode && (
              <div
                className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0",
                  selectedDomainIds.includes(domain.id)
                    ? "bg-gray-900 border-gray-900"
                    : "border-gray-300"
                )}
              >
                {selectedDomainIds.includes(domain.id) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            )}

            {/* Domain Icon */}
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AtSign className="w-4 h-4 text-gray-500" />
            </div>

            {/* Domain Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 truncate">
                  @{domain.domain}
                </span>
                {getStatusBadge(domain.status)}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">
                  {domain.totalCount} emails
                </span>
                {domain.unreadCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-900 text-white rounded-full font-medium">
                    {domain.unreadCount} new
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  unsubscribeDomain(domain.id);
                }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                title="Unsubscribe"
              >
                <Bomb className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDomain(domain.id);
                }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  pinDomain(domain.id);
                }}
                className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                title="Reply Later"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  muteDomain(domain.id);
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

            {!multiSelectMode && (
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0" />
            )}
          </div>
        ))}

        {/* Multi-select actions */}
        {multiSelectMode && selectedDomainIds.length > 0 && (
          <div className="sticky bottom-4 flex items-center justify-center gap-2 p-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg">
            <span className="text-sm text-gray-600 mr-2">
              {selectedDomainIds.length} selected
            </span>
            <button
              onClick={() => {
                selectedDomainIds.forEach((id) => deleteDomain(id));
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete All
            </button>
            <button
              onClick={() => {
                selectedDomainIds.forEach((id) => unsubscribeDomain(id));
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition-colors"
            >
              <Bomb className="w-3.5 h-3.5" />
              Unsubscribe All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
