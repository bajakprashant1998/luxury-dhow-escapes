import { ChatMessage as ChatMessageType, formatChatTime } from "@/lib/chatUtils";
import { cn } from "@/lib/utils";
import { User, Bot, Headset } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isVisitor = message.sender_type === "visitor";
  const isBot = message.sender_type === "bot";
  const isAgent = message.sender_type === "agent";

  return (
    <div
      className={cn(
        "flex items-end gap-2 mb-3",
        isVisitor ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isVisitor
            ? "bg-secondary"
            : isAgent
            ? "bg-green-600"
            : "bg-primary"
        )}
      >
        {isVisitor ? (
          <User className="w-4 h-4 text-primary" />
        ) : isAgent ? (
          <Headset className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-secondary" />
        )}
      </div>

      {/* Message bubble */}
      <div className="max-w-[75%] flex flex-col gap-1">
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl",
            isVisitor
              ? "bg-secondary text-primary rounded-tr-sm"
              : isAgent
              ? "bg-green-600/90 text-white rounded-tl-sm"
              : "bg-primary/90 text-white rounded-tl-sm"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <span
          className={cn(
            "text-[10px] text-muted-foreground px-2",
            isVisitor ? "text-right" : "text-left"
          )}
        >
          {formatChatTime(message.created_at)}
          {isAgent && " • Support Agent"}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
