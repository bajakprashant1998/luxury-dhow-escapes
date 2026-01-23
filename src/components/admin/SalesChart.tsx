import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";

const salesData = [
  { name: "Jan", sales: 4000, lastYear: 2400 },
  { name: "Feb", sales: 3000, lastYear: 1398 },
  { name: "Mar", sales: 2000, lastYear: 9800 },
  { name: "Apr", sales: 2780, lastYear: 3908 },
  { name: "May", sales: 1890, lastYear: 4800 },
  { name: "Jun", sales: 2390, lastYear: 3800 },
  { name: "Jul", sales: 3490, lastYear: 4300 },
  { name: "Aug", sales: 4200, lastYear: 3200 },
  { name: "Sep", sales: 3800, lastYear: 2900 },
  { name: "Oct", sales: 4500, lastYear: 3500 },
  { name: "Nov", sales: 5200, lastYear: 4100 },
  { name: "Dec", sales: 6100, lastYear: 4800 },
];

const SalesChart = () => {
  const [period, setPeriod] = useState<"year" | "quarter">("year");

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Sales Over Time
          </h3>
          <p className="text-sm text-muted-foreground">
            Revenue analytics by month
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("year")}
          >
            This Year
          </Button>
          <Button
            variant={period === "quarter" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("quarter")}
          >
            Last Year
          </Button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={salesData}
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
              formatter={(value: number) => [`AED ${value.toLocaleString()}`, ""]}
            />
            <Legend />
            <Bar
              dataKey="sales"
              name="This Year"
              fill="hsl(var(--secondary))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="lastYear"
              name="Last Year"
              fill="hsl(var(--muted))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
