import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import VisitorsChart from "@/components/admin/VisitorsChart";
import SalesChart from "@/components/admin/SalesChart";
import OverviewCard from "@/components/admin/OverviewCard";
import ToursTable from "@/components/admin/ToursTable";
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*");

      if (bookingsError) throw bookingsError;

      const { data: inquiries, error: inquiriesError } = await supabase
        .from("inquiries")
        .select("*");

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
    } finally {
      setLoading(false);
    }
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
