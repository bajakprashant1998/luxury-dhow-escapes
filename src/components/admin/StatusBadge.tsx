import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, AlertCircle, MessageSquare, Mail, ThumbsUp } from "lucide-react";

type StatusType = 
  | "pending" 
  | "confirmed" 
  | "cancelled" 
  | "new" 
  | "responded" 
  | "closed" 
  | "approved" 
  | "rejected";

interface StatusConfig {
  bg: string;
  text: string;
  icon: React.ElementType;
  pulse?: boolean;
}

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
  showPulse?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig: Record<StatusType, StatusConfig> = {
  pending: {
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    icon: Clock,
    pulse: true,
  },
  confirmed: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    icon: CheckCircle,
  },
  cancelled: {
    bg: "bg-rose-500/10",
    text: "text-rose-600",
    icon: XCircle,
  },
  new: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    icon: MessageSquare,
    pulse: true,
  },
  responded: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    icon: Mail,
  },
  closed: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    icon: CheckCircle,
  },
  approved: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    icon: ThumbsUp,
  },
  rejected: {
    bg: "bg-rose-500/10",
    text: "text-rose-600",
    icon: XCircle,
  },
};

const defaultConfig: StatusConfig = {
  bg: "bg-muted",
  text: "text-muted-foreground",
  icon: AlertCircle,
};

const StatusBadge = ({
  status,
  showIcon = true,
  showPulse = true,
  size = "sm",
  className,
}: StatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase() as StatusType;
  const config: StatusConfig = statusConfig[normalizedStatus] || defaultConfig;

  const Icon = config.icon;
  const shouldPulse = showPulse && config.pulse;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium capitalize transition-all",
        config.bg,
        config.text,
        size === "sm" ? "px-2 py-0.5 text-[10px] sm:text-xs" : "px-2.5 py-1 text-xs sm:text-sm",
        className
      )}
    >
      {shouldPulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              normalizedStatus === "pending" ? "bg-amber-500" : "bg-blue-500"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              normalizedStatus === "pending" ? "bg-amber-500" : "bg-blue-500"
            )}
          />
        </span>
      )}
      {showIcon && !shouldPulse && (
        <Icon className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
      )}
      {status}
    </span>
  );
};

export default StatusBadge;
