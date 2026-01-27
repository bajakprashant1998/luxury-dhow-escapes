import { ChatConversation } from "@/lib/chatUtils";
import ConversationItem from "./ConversationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";

interface ConversationListProps {
  conversations: (ChatConversation & { lastMessage?: string })[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (conversation: ChatConversation) => void;
}

const ConversationList = ({
  conversations,
  isLoading,
  selectedId,
  onSelect,
}: ConversationListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
        <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
        <p className="text-sm">No active conversations</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="space-y-2 p-2">
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isSelected={selectedId === conv.id}
            onClick={() => onSelect(conv)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ConversationList;
