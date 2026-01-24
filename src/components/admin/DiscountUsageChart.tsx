import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useDiscounts } from "@/hooks/useDiscounts";

const COLORS = [
  "hsl(var(--secondary))",
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
  "hsl(47, 100%, 50%)",
  "hsl(280, 80%, 50%)",
];

const DiscountUsageChart = () => {
  const { data: discounts, isLoading } = useDiscounts();

  // Filter discounts with usage
  const discountsWithUsage = (discounts || [])
    .filter((d) => d.used_count > 0)
    .sort((a, b) => b.used_count - a.used_count)
    .slice(0, 6);

  const chartData = discountsWithUsage.map((d) => ({
    name: d.code,
    value: d.used_count,
    label: `${d.code}: ${d.used_count} uses`,
  }));

  // If no data, show placeholder
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">
          Discount Code Usage
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">
          Discount Code Usage
        </h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No discount codes have been used yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="mb-4">
        <h3 className="font-display text-lg font-bold text-foreground">
          Discount Code Usage
        </h3>
        <p className="text-sm text-muted-foreground">
          Top performing discount codes
        </p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => [
                `${value} uses`,
                name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DiscountUsageChart;
