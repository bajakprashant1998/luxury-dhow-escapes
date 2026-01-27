import { X, Minus, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  isAgentConnected: boolean;
  isAgentOnline: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

const ChatHeader = ({ isAgentConnected, isAgentOnline, onMinimize, onClose }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-primary text-white rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-primary font-display font-bold text-sm">LD</span>
        </div>
        <div>
          <h3 className="font-semibold text-sm">Luxury Dhow Escapes</h3>
          <p className="text-xs text-white/70 flex items-center gap-1.5">
            {isAgentConnected ? (
              <>
                <Headset className="w-3 h-3" />
                <span>Live Support</span>
              </>
            ) : (
              <>
                <span className={`w-2 h-2 rounded-full ${isAgentOnline ? "bg-green-400" : "bg-secondary"}`} />
                <span>{isAgentOnline ? "Agents available" : "AI Assistant"}</span>
              </>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMinimize}
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
