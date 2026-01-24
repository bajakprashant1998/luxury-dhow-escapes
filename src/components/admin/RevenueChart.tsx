import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
}

const RevenueChart = () => {
  const [data, setData] = useState<MonthlyRevenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"6m" | "12m">("12m");

  useEffect(() => {
    fetchRevenueData();
  }, [period]);

  const fetchRevenueData = async () => {
    setIsLoading(true);
    try {
      const months = period === "6m" ? 6 : 12;
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("total_price, created_at, status")
        .gte("created_at", startDate.toISOString())
        .in("status", ["confirmed", "completed"]);

      if (error) throw error;

      // Group by month
      const monthlyData: Record<string, { revenue: number; bookings: number }> = {};

      // Initialize all months
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
        monthlyData[key] = { revenue: 0, bookings: 0 };
      }

      // Aggregate bookings
      (bookings || []).forEach((booking) => {
        const date = new Date(booking.created_at);
        const key = date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
        if (monthlyData[key]) {
          monthlyData[key].revenue += Number(booking.total_price);
          monthlyData[key].bookings += 1;
        }
      });

      const chartData: MonthlyRevenue[] = Object.entries(monthlyData).map(
        ([month, values]) => ({
          month,
          revenue: values.revenue,
          bookings: values.bookings,
        })
      );

      setData(chartData);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">
          Revenue by Month
        </h3>
        <div className="h-80 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Revenue by Month
          </h3>
          <p className="text-sm text-muted-foreground">
            Monthly revenue from confirmed bookings
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === "6m" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("6m")}
          >
            6 Months
          </Button>
          <Button
            variant={period === "12m" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("12m")}
          >
            12 Months
          </Button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--secondary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--secondary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [
                `AED ${value.toLocaleString()}`,
                "Revenue",
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
