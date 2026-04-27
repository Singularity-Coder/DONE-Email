"use client";

import { useAppStore } from "@/lib/store";
import { Trash2, ArrowLeft, RotateCcw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrashView() {
  const { trashDomains, setCurrentView, emptyTrash } = useAppStore();

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView("home")}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">Trash</h2>
            <span className="text-xs text-gray-500">
              {trashDomains.length} items
            </span>
          </div>
          {trashDomains.length > 0 && (
            <button
              onClick={emptyTrash}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Empty Trash
            </button>
          )}
        </div>
      </div>

      {/* Trash Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {trashDomains.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Trash2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Trash is empty</p>
            <p className="text-xs mt-1">
              Deleted domains will appear here for 30 days
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              Items in trash are automatically deleted after 30 days
            </div>
            {trashDomains.map((domain) => (
              <div
                key={domain.id}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 opacity-75"
              >
                <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-600 truncate">
                    @{domain.domain}
                  </span>
                  <p className="text-xs text-gray-400">
                    {domain.totalCount} emails &middot; Deleted recently
                  </p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
