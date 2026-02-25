import { useState, useEffect } from "react";
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
import { DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths, startOfMonth } from "date-fns";

interface MonthlySales {
  name: string;
  revenue: number;
  bookings: number;
}

const SalesChart = () => {
  const [period, setPeriod] = useState<"6m" | "12m">("12m");
  const [data, setData] = useState<MonthlySales[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, [period]);

  const fetchSalesData = async () => {
    setIsLoading(true);
    try {
      const months = period === "6m" ? 6 : 12;
      const startDate = subMonths(new Date(), months);

      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("total_price, created_at")
        .gte("created_at", startDate.toISOString());

      if (error) throw error;

      // Initialize months
      const monthlyData: Record<string, { revenue: number; bookings: number }> = {};
      for (let i = months - 1; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const key = format(date, "MMM");
        monthlyData[key] = { revenue: 0, bookings: 0 };
      }

      // Aggregate
      (bookings || []).forEach((b) => {
        const key = format(new Date(b.created_at), "MMM");
        if (monthlyData[key]) {
          monthlyData[key].revenue += Number(b.total_price);
          monthlyData[key].bookings += 1;
        }
      });

      setData(
        Object.entries(monthlyData).map(([name, v]) => ({
          name,
          revenue: v.revenue,
          bookings: v.bookings,
        }))
      );
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Sales Over Time
            </h3>
            <p className="text-xs text-muted-foreground">
              Revenue from all bookings
            </p>
          </div>
        </div>
        <div className="flex gap-1.5 bg-muted/50 p-1 rounded-lg">
          <Button
            variant={period === "6m" ? "default" : "ghost"}
            size="sm"
            onClick={() => setPeriod("6m")}
            className="h-7 text-xs rounded-md"
          >
            6 Months
          </Button>
          <Button
            variant={period === "12m" ? "default" : "ghost"}
            size="sm"
            onClick={() => setPeriod("12m")}
            className="h-7 text-xs rounded-md"
          >
            12 Months
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
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
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
                tickFormatter={(v) => v > 0 ? `${(v / 1000).toFixed(0)}k` : "0"}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number, name: string) => [
                  name === "revenue" ? `AED ${value.toLocaleString()}` : value,
                  name === "revenue" ? "Revenue" : "Bookings",
                ]}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                name="Revenue (AED)"
                fill="hsl(var(--secondary))"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="bookings"
                name="Bookings"
                fill="hsl(var(--muted))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesChart;
