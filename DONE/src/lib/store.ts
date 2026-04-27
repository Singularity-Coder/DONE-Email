import { create } from "zustand";
import {
  DomainGroup,
  HandleGroup,
  EmailThread,
  ChatMessage,
  Folder,
  ViewType,
  AIChatMessage,
  Settings,
} from "./types";
import {
  mockDomainGroups,
  mockHandleGroups,
  mockFolders,
  mockAIMessages,
} from "./mock-data";

interface AppState {
  // Navigation
  currentView: ViewType;
  selectedDomain: DomainGroup | null;
  selectedHandle: HandleGroup | null;
  selectedThread: EmailThread | null;

  // Data
  domains: DomainGroup[];
  handles: Record<string, HandleGroup[]>;
  folders: Folder[];
  trashDomains: DomainGroup[];

  // AI Panel
  aiPanelOpen: boolean;
  aiMessages: AIChatMessage[];
  aiLoading: boolean;

  // Search
  searchQuery: string;
  semanticSearchEnabled: boolean;

  // Multi-select
  multiSelectMode: boolean;
  selectedDomainIds: string[];
  selectedHandleIds: string[];

  // Settings
  settings: Settings;

  // Actions
  setCurrentView: (view: ViewType) => void;
  selectDomain: (domain: DomainGroup) => void;
  selectHandle: (handle: HandleGroup) => void;
  selectThread: (thread: EmailThread) => void;
  goBack: () => void;

  toggleAIPanel: () => void;
  addAIMessage: (message: AIChatMessage) => void;
  setAILoading: (loading: boolean) => void;

  setSearchQuery: (query: string) => void;
  setSemanticSearchEnabled: (enabled: boolean) => void;

  toggleMultiSelect: () => void;
  toggleDomainSelection: (id: string) => void;
  toggleHandleSelection: (id: string) => void;

  unsubscribeDomain: (id: string) => void;
  deleteDomain: (id: string) => void;
  muteDomain: (id: string) => void;
  pinDomain: (id: string) => void;
  unsubscribeHandle: (id: string) => void;
  deleteHandle: (id: string) => void;

  addFolder: (name: string) => void;
  deleteFolder: (id: string) => void;
  moveDomainToFolder: (domainId: string, folderId: string) => void;

  sendReply: (threadId: string, body: string) => void;
  emptyTrash: () => void;

  updateSettings: (settings: Partial<Settings>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentView: "home",
  selectedDomain: null,
  selectedHandle: null,
  selectedThread: null,

  domains: mockDomainGroups,
  handles: mockHandleGroups,
  folders: mockFolders,
  trashDomains: [],

  aiPanelOpen: false,
  aiMessages: mockAIMessages,
  aiLoading: false,

  searchQuery: "",
  semanticSearchEnabled: false,

  multiSelectMode: false,
  selectedDomainIds: [],
  selectedHandleIds: [],

  settings: {
    gmailApiKey: "",
    gmailOAuthConnected: false,
    aiProvider: "",
    aiApiKey: "",
    ollamaEndpoint: "http://localhost:11434",
    useLocalEmbeddings: true,
  },

  // Actions
  setCurrentView: (view) =>
    set({
      currentView: view,
      selectedDomain: null,
      selectedHandle: null,
      selectedThread: null,
    }),

  selectDomain: (domain) =>
    set({
      currentView: "domain",
      selectedDomain: domain,
      selectedHandle: null,
      selectedThread: null,
    }),

  selectHandle: (handle) =>
    set({
      currentView: "chat",
      selectedHandle: handle,
      selectedThread: null,
    }),

  selectThread: (thread) =>
    set({ selectedThread: thread }),

  goBack: () => {
    const { currentView, selectedDomain } = get();
    if (currentView === "chat") {
      set({ currentView: "domain", selectedHandle: null, selectedThread: null });
    } else if (currentView === "domain") {
      set({ currentView: "home", selectedDomain: null, selectedHandle: null });
    }
  },

  toggleAIPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),

  addAIMessage: (message) =>
    set((state) => ({ aiMessages: [...state.aiMessages, message] })),

  setAILoading: (loading) => set({ aiLoading: loading }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSemanticSearchEnabled: (enabled) =>
    set({ semanticSearchEnabled: enabled }),

  toggleMultiSelect: () =>
    set((state) => ({
      multiSelectMode: !state.multiSelectMode,
      selectedDomainIds: [],
      selectedHandleIds: [],
    })),

  toggleDomainSelection: (id) =>
    set((state) => ({
      selectedDomainIds: state.selectedDomainIds.includes(id)
        ? state.selectedDomainIds.filter((d) => d !== id)
        : [...state.selectedDomainIds, id],
    })),

  toggleHandleSelection: (id) =>
    set((state) => ({
      selectedHandleIds: state.selectedHandleIds.includes(id)
        ? state.selectedHandleIds.filter((h) => h !== id)
        : [...state.selectedHandleIds, id],
    })),

  unsubscribeDomain: (id) =>
    set((state) => ({
      domains: state.domains.map((d) =>
        d.id === id ? { ...d, status: "unsubscribed" as const } : d
      ),
    })),

  deleteDomain: (id) =>
    set((state) => {
      const domain = state.domains.find((d) => d.id === id);
      if (!domain) return state;
      return {
        domains: state.domains.filter((d) => d.id !== id),
        trashDomains: [...state.trashDomains, domain],
      };
    }),

  muteDomain: (id) =>
    set((state) => ({
      domains: state.domains.map((d) =>
        d.id === id ? { ...d, status: "muted" as const } : d
      ),
    })),

  pinDomain: (id) =>
    set((state) => ({
      domains: state.domains.map((d) =>
        d.id === id ? { ...d, status: "active" as const } : d
      ),
    })),

  unsubscribeHandle: (id) =>
    set((state) => {
      const newHandles = { ...state.handles };
      for (const domainId in newHandles) {
        newHandles[domainId] = newHandles[domainId].filter(
          (h) => h.id !== id
        );
      }
      return { handles: newHandles };
    }),

  deleteHandle: (id) =>
    set((state) => {
      const newHandles = { ...state.handles };
      for (const domainId in newHandles) {
        newHandles[domainId] = newHandles[domainId].filter(
          (h) => h.id !== id
        );
      }
      return { handles: newHandles };
    }),

  addFolder: (name) =>
    set((state) => ({
      folders: [
        ...state.folders,
        { id: `folder-${Date.now()}`, name, emailIds: [], domainIds: [] },
      ],
    })),

  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
    })),

  moveDomainToFolder: (domainId, folderId) =>
    set((state) => ({
      folders: state.folders.map((f) =>
        f.id === folderId
          ? { ...f, domainIds: [...f.domainIds, domainId] }
          : f
      ),
    })),

  sendReply: (threadId, body) =>
    set((state) => {
      // In a real app, this would send via Gmail API
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "You",
        senderEmail: "me@example.com",
        bodyText: body,
        sentAt: new Date(),
        isMe: true,
        attachments: [],
      };

      if (state.selectedThread?.id === threadId) {
        return {
          selectedThread: {
            ...state.selectedThread,
            messages: [...state.selectedThread.messages, newMessage],
          },
        };
      }
      return state;
    }),

  emptyTrash: () => set({ trashDomains: [] }),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
}));
