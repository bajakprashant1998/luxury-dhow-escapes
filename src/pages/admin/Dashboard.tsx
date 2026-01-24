import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/admin/StatCard";
import VisitorsChart from "@/components/admin/VisitorsChart";
import SalesChart from "@/components/admin/SalesChart";
import OverviewCard from "@/components/admin/OverviewCard";
import ToursTable from "@/components/admin/ToursTable";
import RevenueChart from "@/components/admin/RevenueChart";
import DiscountUsageChart from "@/components/admin/DiscountUsageChart";
import CustomerRetentionChart from "@/components/admin/CustomerRetentionChart";
import { withTimeout } from "@/lib/withTimeout";
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  MessageSquare,
  Eye,
} from "lucide-react";

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalInquiries: number;
  newInquiries: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalInquiries: 0,
    newInquiries: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoadError(null);
    try {
      const { data: bookings, error: bookingsError } = await withTimeout(
        supabase.from("bookings").select("status,total_price"),
        8000,
        "Bookings request timed out",
      );

      if (bookingsError) throw bookingsError;

      const { data: inquiries, error: inquiriesError } = await withTimeout(
        supabase.from("inquiries").select("status"),
        8000,
        "Inquiries request timed out",
      );

      if (inquiriesError) throw inquiriesError;

      const totalBookings = bookings?.length || 0;
      const pendingBookings = bookings?.filter((b) => b.status === "pending").length || 0;
      const confirmedBookings = bookings?.filter((b) => b.status === "confirmed").length || 0;
      const totalRevenue = bookings?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0;

      const totalInquiries = inquiries?.length || 0;
      const newInquiries = inquiries?.filter((i) => i.status === "new").length || 0;

      setStats({
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalInquiries,
        newInquiries,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoadError("Couldn't load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {loadError && (
          <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">Dashboard data unavailable</p>
              <p className="text-sm text-muted-foreground">{loadError}</p>
            </div>
            <Button variant="outline" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        )}

        {/* Header */}
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your business.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Online Store Visitors"
            value="12,426"
            icon={Eye}
            change="+12.5%"
            changeType="positive"
            subtitle="Since last week"
            viewReportLink="/admin/analytics"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={Calendar}
            change="+8.2%"
            changeType="positive"
            subtitle="Since last month"
            viewReportLink="/admin/bookings"
          />
          <StatCard
            title="Conversion Rate"
            value="3.6%"
            icon={TrendingUp}
            change="+2.1%"
            changeType="positive"
            subtitle="Since last week"
            viewReportLink="/admin/analytics"
          />
          <StatCard
            title="Total Revenue"
            value={`AED ${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            change="+15.3%"
            changeType="positive"
            subtitle="Since last month"
            viewReportLink="/admin/bookings"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VisitorsChart />
          <SalesChart />
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <div className="grid grid-cols-1 gap-6">
            <DiscountUsageChart />
            <CustomerRetentionChart />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ToursTable />
          </div>
          <OverviewCard />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Pending Bookings"
            value={stats.pendingBookings}
            icon={Calendar}
            change={stats.pendingBookings > 0 ? "Action needed" : "All clear"}
            changeType={stats.pendingBookings > 0 ? "negative" : "positive"}
          />
          <StatCard
            title="Total Inquiries"
            value={stats.totalInquiries}
            icon={MessageSquare}
            change={`${stats.newInquiries} new`}
            changeType={stats.newInquiries > 0 ? "negative" : "neutral"}
          />
          <StatCard
            title="Active Customers"
            value="1,847"
            icon={Users}
            change="+5.4%"
            changeType="positive"
            subtitle="Since last month"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
