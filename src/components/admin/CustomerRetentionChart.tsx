import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface RetentionData {
  category: string;
  count: number;
  color: string;
}

const CustomerRetentionChart = () => {
  const [data, setData] = useState<RetentionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    fetchRetentionData();
  }, []);

  const fetchRetentionData = async () => {
    setIsLoading(true);
    try {
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("customer_email, created_at");

      if (error) throw error;

      // Count bookings per customer
      const customerBookings: Record<string, number> = {};
      (bookings || []).forEach((booking) => {
        const email = booking.customer_email.toLowerCase();
        customerBookings[email] = (customerBookings[email] || 0) + 1;
      });

      // Categorize customers
      let oneTime = 0;
      let returning = 0;
      let loyal = 0;

      Object.values(customerBookings).forEach((count) => {
        if (count === 1) oneTime++;
        else if (count >= 2 && count <= 3) returning++;
        else loyal++;
      });

      const total = oneTime + returning + loyal;
      setTotalCustomers(total);

      setData([
        {
          category: "First-time",
          count: oneTime,
          color: "hsl(var(--muted))",
        },
        {
          category: "Returning (2-3)",
          count: returning,
          color: "hsl(var(--secondary))",
        },
        {
          category: "Loyal (4+)",
          count: loyal,
          color: "hsl(var(--primary))",
        },
      ]);
    } catch (error) {
      console.error("Error fetching retention data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">
          Customer Retention
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-bold text-foreground">
          Customer Retention
        </h3>
        <p className="text-sm text-muted-foreground">
          {totalCustomers} total unique customers
        </p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              type="number"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              type="category"
              dataKey="category"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              width={75}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [
                `${value} customers (${totalCustomers > 0 ? ((value / totalCustomers) * 100).toFixed(1) : 0}%)`,
                "Count",
              ]}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {data.map((item) => (
          <div key={item.category} className="p-2 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-foreground">{item.count}</p>
            <p className="text-xs text-muted-foreground">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerRetentionChart;
