import { useState, FormEvent, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = ({ onSend, disabled, placeholder = "Type your message..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card/50">
      <div className="flex items-end gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-[120px] resize-none bg-background/50 border-muted focus-visible:ring-secondary"
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled}
          className="h-11 w-11 bg-secondary hover:bg-secondary/90 text-primary flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
