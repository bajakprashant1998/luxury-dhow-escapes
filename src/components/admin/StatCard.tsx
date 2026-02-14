import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

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
  accentColor?: string;
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
  accentColor,
}: StatCardProps) => {
  const ChangeIcon = changeType === "positive" ? ArrowUpRight : changeType === "negative" ? ArrowDownRight : Minus;

  const card = (
    <div
      className={cn(
        "group relative bg-card rounded-2xl p-5 sm:p-6 border border-border/60",
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-secondary/30",
        "animate-fade-in overflow-hidden",
        viewReportLink && "cursor-pointer",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-2 flex-wrap">
              <div
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                  changeType === "positive" && "bg-emerald-500/10 text-emerald-600",
                  changeType === "negative" && "bg-rose-500/10 text-rose-600",
                  changeType === "neutral" && "bg-muted text-muted-foreground"
                )}
              >
                <ChangeIcon className="w-3 h-3" />
                {change}
              </div>
              {subtitle && (
                <span className="text-[10px] sm:text-xs text-muted-foreground">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center",
          "bg-gradient-to-br from-secondary/20 to-secondary/5",
          "group-hover:from-secondary/30 group-hover:to-secondary/10",
          "transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
        )}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-secondary" />
        </div>
      </div>
    </div>
  );

  if (viewReportLink) {
    return <Link to={viewReportLink} className="block">{card}</Link>;
  }

  return card;
};

export default StatCard;
