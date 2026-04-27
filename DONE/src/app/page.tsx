"use client";

import { useAppStore } from "@/lib/store";
import { AppSidebar } from "@/components/done/sidebar";
import { AIPanel } from "@/components/done/ai-panel";
import { HomeView } from "@/components/done/home-view";
import { DomainDetailView } from "@/components/done/domain-detail";
import { ChatThreadView } from "@/components/done/chat-thread";
import { TrashView } from "@/components/done/trash-view";
import { SettingsView } from "@/components/done/settings-view";

export default function Home() {
  const { currentView, aiPanelOpen } = useAppStore();

  const renderMainContent = () => {
    switch (currentView) {
      case "home":
        return <HomeView />;
      case "domain":
        return <DomainDetailView />;
      case "chat":
        return <ChatThreadView />;
      case "trash":
        return <TrashView />;
      case "settings":
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      {/* Left Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">{renderMainContent()}</main>

      {/* AI Panel (Right Sidebar) */}
      <AIPanel />
    </div>
  );
}
