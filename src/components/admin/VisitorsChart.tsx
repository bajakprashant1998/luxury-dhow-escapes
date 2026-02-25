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
import { Globe, Loader2 } from "lucide-react";
import { useDailyVisitors } from "@/hooks/usePageViews";
import { format, subDays } from "date-fns";

const VisitorsChart = () => {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const days = period === "week" ? 7 : 30;
  const { data: dailyData, isLoading } = useDailyVisitors(days);

  // Build chart data with current and previous period comparison
  const chartData = (dailyData || []).map((d) => ({
    name: period === "week" ? d.day : format(new Date(d.date), "MMM d"),
    visitors: d.visitors,
    pageViews: d.pageViews,
  }));

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
              Real-time website traffic
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
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pageViewGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
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
                allowDecimals={false}
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
                name="Unique Visitors"
                stroke="hsl(var(--secondary))"
                strokeWidth={2.5}
                fill="url(#visitorGradient)"
                dot={{ fill: "hsl(var(--secondary))", r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                name="Page Views"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                fill="url(#pageViewGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default VisitorsChart;
