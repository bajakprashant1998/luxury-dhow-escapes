import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

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
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Visitors Over Time
            </h3>
            <p className="text-xs text-muted-foreground">
              Website traffic analytics
            </p>
          </div>
        </div>
        <div className="flex gap-1.5 bg-muted/50 p-1 rounded-lg">
          <Button
            variant={period === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => setPeriod("week")}
            className="h-7 text-xs rounded-md"
          >
            Week
          </Button>
          <Button
            variant={period === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setPeriod("month")}
            className="h-7 text-xs rounded-md"
          >
            Month
          </Button>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={thisWeekData}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="visitors"
              name="This Week"
              stroke="hsl(var(--secondary))"
              strokeWidth={2.5}
              fill="url(#visitorGradient)"
              dot={{ fill: "hsl(var(--secondary))", r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }}
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="lastWeek"
              name="Last Week"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              fill="transparent"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VisitorsChart;
