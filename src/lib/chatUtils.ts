// Generate a unique visitor ID for anonymous users
export function getVisitorId(): string {
  const storageKey = "chat_visitor_id";
  let visitorId = localStorage.getItem(storageKey);
  
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(storageKey, visitorId);
  }
  
  return visitorId;
}

// Format timestamp for chat display
export function formatChatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Format date for conversation list
export function formatConversationDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

// Get current page path
export function getCurrentPage(): string {
  return window.location.pathname;
}

// Chat message types
export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: "visitor" | "bot" | "agent";
  sender_name: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  travel_date: string | null;
  status: "active" | "closed" | "waiting_agent";
  is_agent_connected: boolean;
  agent_id: string | null;
  current_page: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

export interface ChatLead {
  id: string;
  conversation_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  travel_date: string | null;
  message: string | null;
  source: string;
  created_at: string;
}

export interface AdminPresence {
  user_id: string;
  is_online: boolean;
  last_seen: string;
}

// Quick reply options
export const quickReplies = [
  { id: "tours", label: "View Tours", message: "I'd like to know about your tours and packages" },
  { id: "pricing", label: "Pricing", message: "What are your prices?" },
  { id: "booking", label: "Book Now", message: "I want to make a booking" },
  { id: "contact", label: "Contact", message: "How can I contact you?" },
];

// Detect if visitor wants human support
export function detectHumanRequest(message: string): boolean {
  const humanTriggers = [
    "speak to",
    "talk to",
    "human",
    "agent",
    "real person",
    "support",
    "help me",
    "representative",
    "customer service",
    "operator",
  ];
  const lowerMessage = message.toLowerCase();
  return humanTriggers.some((trigger) => lowerMessage.includes(trigger));
}
