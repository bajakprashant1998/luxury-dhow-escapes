import { ChatConversation } from "@/lib/chatUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Calendar, Globe } from "lucide-react";
import { format } from "date-fns";

interface VisitorInfoProps {
  conversation: ChatConversation;
}

const VisitorInfo = ({ conversation }: VisitorInfoProps) => {
  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-semibold">Visitor Details</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-4 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate">
            {conversation.visitor_name || `Visitor ${conversation.visitor_id.slice(0, 8)}`}
          </span>
        </div>

        {conversation.visitor_email && (
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <a
              href={`mailto:${conversation.visitor_email}`}
              className="text-secondary hover:underline truncate"
            >
              {conversation.visitor_email}
            </a>
          </div>
        )}

        {conversation.visitor_phone && (
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <a
              href={`tel:${conversation.visitor_phone}`}
              className="text-secondary hover:underline"
            >
              {conversation.visitor_phone}
            </a>
          </div>
        )}

        {conversation.travel_date && (
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span>{format(new Date(conversation.travel_date), "MMM dd, yyyy")}</span>
          </div>
        )}

        {conversation.current_page && (
          <div className="flex items-center gap-3 text-sm">
            <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate text-muted-foreground">
              {conversation.current_page}
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Started: {format(new Date(conversation.created_at), "MMM dd, yyyy 'at' h:mm a")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitorInfo;
