import { Progress } from "@/components/ui/progress";

interface MetricProps {
  label: string;
  value: number;
  color?: string;
}

const Metric = ({ label, value, color = "bg-secondary" }: MetricProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}%</span>
    </div>
    <Progress value={value} className={`h-2 ${color}`} />
  </div>
);

const OverviewCard = () => {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-bold text-foreground">
          Overview
        </h3>
        <p className="text-sm text-muted-foreground">
          Performance metrics updated in real-time
        </p>
      </div>
      <div className="space-y-6">
        <Metric label="Conversion Rate" value={68} />
        <Metric label="Sales Rate" value={45} />
        <Metric label="Booking Completion" value={82} />
        <Metric label="Customer Satisfaction" value={91} />
      </div>
    </div>
  );
};

export default OverviewCard;
