import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Circle } from "lucide-react";

interface OnlineStatusToggleProps {
  isOnline: boolean;
  onToggle: () => void;
}

const OnlineStatusToggle = ({ isOnline, onToggle }: OnlineStatusToggleProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
      <div className="flex items-center gap-2 flex-1">
        <Circle
          className={`w-3 h-3 ${isOnline ? "fill-green-500 text-green-500" : "fill-muted text-muted"}`}
        />
        <Label htmlFor="online-status" className="text-sm font-medium cursor-pointer">
          {isOnline ? "Online" : "Offline"}
        </Label>
      </div>
      <Switch
        id="online-status"
        checked={isOnline}
        onCheckedChange={onToggle}
      />
    </div>
  );
};

export default OnlineStatusToggle;
