import { useRef, useEffect } from "react";
import { ChatConversation, ChatMessage as ChatMessageType } from "@/lib/chatUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/chat/ChatMessage";
import AdminChatInput from "./AdminChatInput";
import VisitorInfo from "./VisitorInfo";
import { Headset, X, MessageSquare } from "lucide-react";

interface AdminChatWindowProps {
  conversation: ChatConversation;
  messages: ChatMessageType[];
  onJoin: () => void;
  onSend: (content: string) => void;
  onClose: () => void;
}

const AdminChatWindow = ({
  conversation,
  messages,
  onJoin,
  onSend,
  onClose,
}: AdminChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex gap-4 h-full">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-card rounded-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                {conversation.visitor_name || `Visitor ${conversation.visitor_id.slice(0, 8)}`}
              </h3>
              <p className="text-xs text-muted-foreground">
                {conversation.is_agent_connected ? "Connected" : conversation.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!conversation.is_agent_connected && (
              <Button size="sm" onClick={onJoin} className="bg-green-600 hover:bg-green-700">
                <Headset className="w-4 h-4 mr-1" />
                Join Chat
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4 mr-1" />
              Close
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Agent connected banner */}
        {conversation.is_agent_connected && (
          <div className="px-4 py-2 bg-green-600/10 border-t border-green-600/20 flex items-center gap-2">
            <Headset className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600 font-medium">
              You are connected to this conversation
            </span>
          </div>
        )}

        {/* Input */}
        {conversation.is_agent_connected ? (
          <AdminChatInput onSend={onSend} />
        ) : (
          <div className="p-4 border-t border-border bg-muted/30 text-center">
            <p className="text-sm text-muted-foreground">
              Click "Join Chat" to respond to this conversation
            </p>
          </div>
        )}
      </div>

      {/* Visitor Info Sidebar */}
      <div className="w-72 flex-shrink-0">
        <VisitorInfo conversation={conversation} />
      </div>
    </div>
  );
};

export default AdminChatWindow;
