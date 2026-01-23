import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  viewReportLink?: string;
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = "neutral",
  subtitle,
  viewReportLink,
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-xl p-6 border border-border shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded",
                  changeType === "positive" &&
                    "bg-emerald-500/10 text-emerald-600",
                  changeType === "negative" && "bg-rose-500/10 text-rose-600",
                  changeType === "neutral" && "bg-muted text-muted-foreground"
                )}
              >
                {change}
              </span>
              {subtitle && (
                <span className="text-xs text-muted-foreground">{subtitle}</span>
              )}
            </div>
          )}
          {viewReportLink && (
            <a
              href={viewReportLink}
              className="text-sm text-secondary hover:underline mt-2 inline-block"
            >
              View Report →
            </a>
          )}
        </div>
        <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-secondary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
