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
  animationDelay?: number;
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
  animationDelay = 0,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm",
        "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
        "animate-fade-in",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 animate-count-up">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded",
                  changeType === "positive" &&
                    "bg-emerald-500/10 text-emerald-600",
                  changeType === "negative" && "bg-rose-500/10 text-rose-600",
                  changeType === "neutral" && "bg-muted text-muted-foreground"
                )}
              >
                {change}
              </span>
              {subtitle && (
                <span className="text-[10px] sm:text-xs text-muted-foreground">{subtitle}</span>
              )}
            </div>
          )}
          {viewReportLink && (
            <a
              href={viewReportLink}
              className="text-xs sm:text-sm text-secondary hover:underline mt-2 inline-block"
            >
              View Report →
            </a>
          )}
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center transition-transform hover:scale-105">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
