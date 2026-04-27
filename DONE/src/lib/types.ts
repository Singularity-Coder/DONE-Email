export interface DomainGroup {
  id: string;
  domain: string;
  totalCount: number;
  unreadCount: number;
  lastReceivedAt: Date;
  status: "active" | "muted" | "unsubscribed";
}

export interface HandleGroup {
  id: string;
  domainId: string;
  email: string;
  name: string;
  totalCount: number;
  unsubscribeUrl?: string;
  unsubscribeMethod?: "header" | "footer_link" | "none";
}

export interface EmailThread {
  id: string;
  handleId: string;
  subject: string;
  messages: ChatMessage[];
  hasAttachments: boolean;
  labels: string[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderEmail: string;
  bodyText: string;
  bodyHtml?: string;
  sentAt: Date;
  isMe: boolean;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface Folder {
  id: string;
  name: string;
  emailIds: string[];
  domainIds: string[];
}

export type ViewType = "home" | "domain" | "chat" | "trash" | "settings";

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Settings {
  gmailApiKey: string;
  gmailOAuthConnected: boolean;
  aiProvider: "openai" | "anthropic" | "groq" | "ollama" | "";
  aiApiKey: string;
  ollamaEndpoint: string;
  useLocalEmbeddings: boolean;
}
