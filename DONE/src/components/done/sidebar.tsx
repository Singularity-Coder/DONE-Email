"use client";

import { useAppStore } from "@/lib/store";
import { ViewType } from "@/lib/types";
import {
  Home,
  Trash2,
  Settings,
  FolderOpen,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Check,
  GripVertical,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems: { icon: typeof Home; label: string; view: ViewType }[] = [
  { icon: Home, label: "Home", view: "home" },
  { icon: Trash2, label: "Trash", view: "trash" },
  { icon: Settings, label: "Settings", view: "settings" },
];

export function AppSidebar() {
  const {
    currentView,
    setCurrentView,
    aiPanelOpen,
    toggleAIPanel,
    folders,
    addFolder,
    deleteFolder,
    trashDomains,
    moveDomainToFolder,
  } = useAppStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName("");
      setShowNewFolder(false);
    }
  };

  return (
    <aside className="w-[220px] min-w-[220px] h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo + AI Button */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          DONE!
        </h1>
        <button
          onClick={toggleAIPanel}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
            aiPanelOpen
              ? "bg-violet-100 text-violet-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-2 py-2">
        {navItems.map(({ icon: Icon, label, view }) => (
          <button
            key={view}
            onClick={() => setCurrentView(view)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              currentView === view
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
            {view === "trash" && trashDomains.length > 0 && (
              <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                {trashDomains.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-1 border-t border-gray-100" />

      {/* Folders */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="flex items-center justify-between px-3 mb-1">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Folders
          </span>
        </div>
        {folders.map((folder) => {
          const isExpanded = expandedFolders.has(folder.id);
          return (
            <div
              key={folder.id}
              className="group"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("bg-violet-50");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("bg-violet-50");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("bg-violet-50");
                const domainId = e.dataTransfer.getData("domainId");
                if (domainId) {
                  moveDomainToFolder(domainId, folder.id);
                }
              }}
            >
              <button
                onClick={() => toggleFolder(folder.id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-all"
              >
                <GripVertical className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                <FolderOpen className="w-4 h-4 text-gray-400" />
                <span className="flex-1 text-left truncate">{folder.name}</span>
                {folder.domainIds.length > 0 && (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                )}
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>
              {isExpanded && folder.domainIds.length > 0 && (
                <div className="ml-10 space-y-0.5 py-1">
                  {folder.domainIds.map((dId) => (
                    <div
                      key={dId}
                      className="text-xs text-gray-400 py-0.5 px-2"
                    >
                      @{dId}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* New Folder */}
        {showNewFolder ? (
          <div className="px-3 py-1.5">
            <input
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddFolder();
                if (e.key === "Escape") setShowNewFolder(false);
              }}
              placeholder="Folder name..."
              className="w-full px-2 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400"
            />
            <div className="flex gap-1 mt-1">
              <button
                onClick={handleAddFolder}
                className="text-xs px-2 py-1 bg-gray-900 text-white rounded-md"
              >
                Add
              </button>
              <button
                onClick={() => setShowNewFolder(false)}
                className="text-xs px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNewFolder(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Folder
          </button>
        )}
      </div>
    </aside>
  );
}
