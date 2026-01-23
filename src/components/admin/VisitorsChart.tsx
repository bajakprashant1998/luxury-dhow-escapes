import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";

const thisWeekData = [
  { name: "Mon", visitors: 4000, lastWeek: 2400 },
  { name: "Tue", visitors: 3000, lastWeek: 1398 },
  { name: "Wed", visitors: 2000, lastWeek: 9800 },
  { name: "Thu", visitors: 2780, lastWeek: 3908 },
  { name: "Fri", visitors: 1890, lastWeek: 4800 },
  { name: "Sat", visitors: 2390, lastWeek: 3800 },
  { name: "Sun", visitors: 3490, lastWeek: 4300 },
];

const VisitorsChart = () => {
  const [period, setPeriod] = useState<"week" | "month">("week");

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Visitors Over Time
          </h3>
          <p className="text-sm text-muted-foreground">
            Website traffic analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("week")}
          >
            This Week
          </Button>
          <Button
            variant={period === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("month")}
          >
            This Month
          </Button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={thisWeekData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="visitors"
              name="This Week"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--secondary))" }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="lastWeek"
              name="Last Week"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "hsl(var(--muted-foreground))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VisitorsChart;
