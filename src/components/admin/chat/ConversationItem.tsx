import { ChatConversation, formatConversationDate } from "@/lib/chatUtils";
import { cn } from "@/lib/utils";
import { User, Clock, AlertCircle } from "lucide-react";

interface ConversationItemProps {
  conversation: ChatConversation & { lastMessage?: string };
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem = ({ conversation, isSelected, onClick }: ConversationItemProps) => {
  const isWaiting = conversation.status === "waiting_agent";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-3 text-left rounded-lg border transition-colors",
        isSelected
          ? "bg-secondary/10 border-secondary"
          : "bg-card border-border hover:bg-muted/50",
        isWaiting && !isSelected && "border-orange-500/50 bg-orange-500/5"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          isWaiting ? "bg-orange-500/20" : "bg-muted"
        )}>
          {isWaiting ? (
            <AlertCircle className="w-5 h-5 text-orange-500" />
          ) : (
            <User className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm truncate">
              {conversation.visitor_name || `Visitor ${conversation.visitor_id.slice(0, 8)}`}
            </span>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">
              {formatConversationDate(conversation.updated_at)}
            </span>
          </div>

          {/* Email */}
          {conversation.visitor_email && (
            <p className="text-xs text-muted-foreground truncate">
              {conversation.visitor_email}
            </p>
          )}

          {/* Last message */}
          <p className="text-xs text-muted-foreground truncate mt-1">
            {conversation.lastMessage}
          </p>

          {/* Status badges */}
          <div className="flex items-center gap-2 mt-2">
            {isWaiting && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-600 font-medium">
                Waiting for agent
              </span>
            )}
            {conversation.is_agent_connected && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 font-medium">
                Agent connected
              </span>
            )}
            {conversation.current_page && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {conversation.current_page}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
