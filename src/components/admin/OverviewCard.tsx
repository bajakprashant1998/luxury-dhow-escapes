import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Users, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

const Metric = ({ label, value, icon: Icon, color }: MetricProps) => (
  <div className="space-y-2.5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", color)}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold text-foreground">{value}%</span>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-secondary to-secondary/60 transition-all duration-1000"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const OverviewCard = () => {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center">
          <Target className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Overview
          </h3>
          <p className="text-xs text-muted-foreground">
            Key performance indicators
          </p>
        </div>
      </div>
      <div className="space-y-5">
        <Metric label="Conversion Rate" value={68} icon={TrendingUp} color="bg-emerald-500/10 text-emerald-600" />
        <Metric label="Sales Rate" value={45} icon={Target} color="bg-blue-500/10 text-blue-600" />
        <Metric label="Booking Completion" value={82} icon={Users} color="bg-purple-500/10 text-purple-600" />
        <Metric label="Satisfaction" value={91} icon={ThumbsUp} color="bg-amber-500/10 text-amber-600" />
      </div>
    </div>
  );
};

export default OverviewCard;
