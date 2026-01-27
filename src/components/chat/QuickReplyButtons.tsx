import { Button } from "@/components/ui/button";
import { quickReplies } from "@/lib/chatUtils";
import { Ship, DollarSign, Calendar, Phone } from "lucide-react";

interface QuickReplyButtonsProps {
  onSelect: (message: string) => void;
}

const icons = {
  tours: Ship,
  pricing: DollarSign,
  booking: Calendar,
  contact: Phone,
};

const QuickReplyButtons = ({ onSelect }: QuickReplyButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-border/50 bg-muted/30">
      {quickReplies.map((reply) => {
        const Icon = icons[reply.id as keyof typeof icons];
        return (
          <Button
            key={reply.id}
            variant="outline"
            size="sm"
            onClick={() => onSelect(reply.message)}
            className="h-8 text-xs bg-card hover:bg-secondary hover:text-primary border-border/50 transition-colors"
          >
            <Icon className="w-3.5 h-3.5 mr-1.5" />
            {reply.label}
          </Button>
        );
      })}
    </div>
  );
};

export default QuickReplyButtons;
