"use client";

import { useAppStore } from "@/lib/store";
import {
  ArrowLeft,
  Mail,
  Key,
  Cpu,
  Shield,
  Globe,
  Server,
  Check,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function SettingsView() {
  const { settings, updateSettings, setCurrentView } = useAppStore();
  const [gmailConnected, setGmailConnected] = useState(
    settings.gmailOAuthConnected
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("home")}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 max-w-2xl">
        {/* Gmail API Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900">
              Gmail Integration
            </h3>
          </div>
          <div className="space-y-4">
            {/* OAuth */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Gmail OAuth 2.0
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Connect your Gmail account securely
                  </p>
                </div>
                <button
                  onClick={() => {
                    setGmailConnected(!gmailConnected);
                    updateSettings({ gmailOAuthConnected: !gmailConnected });
                  }}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    gmailConnected
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  )}
                >
                  {gmailConnected ? "Connected" : "Connect"}
                </button>
              </div>
              {gmailConnected && (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <Check className="w-3.5 h-3.5" />
                  Connected as me@gmail.com
                </div>
              )}
            </div>

            {/* API Key (alternative) */}
            <div className="p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">
                  Gmail API Key
                </p>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                  Alternative
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Use an API key instead of OAuth for programmatic access
              </p>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-gray-400 transition-colors">
                <Key className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="password"
                  value={settings.gmailApiKey}
                  onChange={(e) =>
                    updateSettings({ gmailApiKey: e.target.value })
                  }
                  placeholder="Enter API key..."
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* AI Provider Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900">
              AI Provider
            </h3>
          </div>
          <div className="space-y-3">
            {[
              {
                id: "openai",
                name: "OpenAI",
                desc: "GPT-4 / text-embedding-3-small",
                icon: Globe,
              },
              {
                id: "anthropic",
                name: "Anthropic",
                desc: "Claude / Voyage embeddings",
                icon: Shield,
              },
              {
                id: "groq",
                name: "Groq",
                desc: "Fast inference, LLaMA models",
                icon: Cpu,
              },
              {
                id: "ollama",
                name: "Ollama (Local)",
                desc: "Run models locally for privacy",
                icon: Server,
              },
            ].map(({ id, name, desc, icon: Icon }) => (
              <div
                key={id}
                onClick={() =>
                  updateSettings({
                    aiProvider: id as "openai" | "anthropic" | "groq" | "ollama",
                  })
                }
                className={cn(
                  "p-4 rounded-xl border-2 cursor-pointer transition-all",
                  settings.aiProvider === id
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      settings.aiProvider === id
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  {settings.aiProvider === id && (
                    <Check className="w-4 h-4 text-gray-900" />
                  )}
                </div>
                {settings.aiProvider === id && id !== "ollama" && (
                  <div className="mt-3 flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200 focus-within:border-gray-400 transition-colors">
                    <Key className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="password"
                      value={settings.aiApiKey}
                      onChange={(e) =>
                        updateSettings({ aiApiKey: e.target.value })
                      }
                      placeholder={`Enter ${name} API key...`}
                      className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
                    />
                  </div>
                )}
                {settings.aiProvider === id && id === "ollama" && (
                  <div className="mt-3 flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200 focus-within:border-gray-400 transition-colors">
                    <Server className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      value={settings.ollamaEndpoint}
                      onChange={(e) =>
                        updateSettings({ ollamaEndpoint: e.target.value })
                      }
                      placeholder="http://localhost:11434"
                      className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Privacy & Embeddings */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900">
              Privacy & Embeddings
            </h3>
          </div>
          <div className="p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Local Embeddings
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Use transformers.js (MiniLM) locally - no data leaves your
                  machine
                </p>
              </div>
              <button
                onClick={() =>
                  updateSettings({
                    useLocalEmbeddings: !settings.useLocalEmbeddings,
                  })
                }
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative",
                  settings.useLocalEmbeddings ? "bg-green-500" : "bg-gray-300"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                    settings.useLocalEmbeddings
                      ? "translate-x-5.5"
                      : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
            <p>
              <strong className="text-gray-700">Data Storage:</strong> All email
              content is stored locally in SQLite.
            </p>
            <p>
              <strong className="text-gray-700">API Keys:</strong> Stored
              securely in your OS keychain.
            </p>
            <p>
              <strong className="text-gray-700">Telemetry:</strong> No
              telemetry is collected without explicit consent.
            </p>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex items-center gap-3 pt-4 pb-8">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            Save Settings
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600">
              <Check className="w-4 h-4" />
              Settings saved!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
