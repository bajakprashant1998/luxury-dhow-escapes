import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import ActivityFeed from "@/components/admin/ActivityFeed";
import { DashboardStatsSkeleton, ChartSkeleton, TableSkeleton } from "@/components/admin/AdminSkeletons";
import { withTimeout } from "@/lib/withTimeout";
import { useVisitorStats, useConversionStats } from "@/hooks/usePageViews";
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  MessageSquare,
  Eye,
  Plus,
  Ship,
  Tag,
  Settings,
  BarChart3,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalInquiries: number;
  newInquiries: number;
  totalRevenue: number;
  todayBookings: number;
  activeTours: number;
}

interface TopTour {
  tour_name: string;
  count: number;
  revenue: number;
}

const quickActions = [
  { label: "Add Tour", icon: Plus, href: "/admin/tours/new", color: "from-secondary to-secondary/80" },
  { label: "Bookings", icon: Calendar, href: "/admin/bookings", color: "from-blue-500 to-blue-400" },
  { label: "Discounts", icon: Tag, href: "/admin/discounts", color: "from-purple-500 to-purple-400" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics", color: "from-emerald-500 to-emerald-400" },
  { label: "Tours", icon: Ship, href: "/admin/tours", color: "from-amber-500 to-amber-400" },
  { label: "Settings", icon: Settings, href: "/admin/settings", color: "from-slate-500 to-slate-400" },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalInquiries: 0,
    newInquiries: 0,
    totalRevenue: 0,
    todayBookings: 0,
    activeTours: 0,
  });
  const [topTours, setTopTours] = useState<TopTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { data: visitorStats } = useVisitorStats("week");
  const { data: conversionStats } = useConversionStats("week");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoadError(null);
    try {
      const [bookingsRes, inquiriesRes, toursRes] = await Promise.all([
        withTimeout(supabase.from("bookings").select("status,total_price,tour_name,created_at"), 8000, "Bookings timed out"),
        withTimeout(supabase.from("inquiries").select("status"), 8000, "Inquiries timed out"),
        withTimeout(supabase.from("tours").select("id").eq("status", "active"), 8000, "Tours timed out"),
      ]);

      if (bookingsRes.error) throw bookingsRes.error;
      if (inquiriesRes.error) throw inquiriesRes.error;

      const bookings = bookingsRes.data || [];
      const inquiries = inquiriesRes.data || [];

      const today = format(new Date(), "yyyy-MM-dd");
      const todayBookings = bookings.filter(b => b.created_at?.startsWith(today)).length;

      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter((b) => b.status === "pending").length;
      const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
      const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.total_price), 0);

      const totalInquiries = inquiries.length;
      const newInquiries = inquiries.filter((i) => i.status === "new").length;

      // Top tours by booking count
      const tourMap = new Map<string, { count: number; revenue: number }>();
      bookings.forEach((b) => {
        const key = b.tour_name || "Unknown";
        const existing = tourMap.get(key) || { count: 0, revenue: 0 };
        tourMap.set(key, { count: existing.count + 1, revenue: existing.revenue + Number(b.total_price) });
      });
      const sorted = Array.from(tourMap.entries())
        .map(([tour_name, data]) => ({ tour_name, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setTopTours(sorted);
      setStats({
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalInquiries,
        newInquiries,
        totalRevenue,
        todayBookings,
        activeTours: toursRes.data?.length || 0,
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
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-muted rounded animate-pulse" />
          </div>
          <DashboardStatsSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><TableSkeleton rows={4} columns={5} /></div>
            <ChartSkeleton />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {loadError && (
          <div className="bg-card rounded-2xl border border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
            <div>
              <p className="font-medium text-foreground">Dashboard data unavailable</p>
              <p className="text-sm text-muted-foreground">{loadError}</p>
            </div>
            <Button variant="outline" onClick={handleRetry}>Retry</Button>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-secondary/15 via-secondary/5 to-transparent rounded-2xl border border-secondary/20 p-6 sm:p-8 animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">Dashboard</span>
              </div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                Welcome back! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's what's happening with your business today, {format(new Date(), "EEEE, MMMM d")}.
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <Link to="/admin/tours/new">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/20">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tour
                </Button>
              </Link>
              <Link to="/admin/bookings">
                <Button variant="outline" className="border-secondary/30 hover:border-secondary/60">
                  <Calendar className="w-4 h-4 mr-2" />
                  Bookings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 animate-fade-in" style={{ animationDelay: "50ms" }}>
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border/60 hover:border-secondary/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Store Visitors"
            value={visitorStats?.uniqueVisitors?.toLocaleString() || "0"}
            icon={Eye}
            change={visitorStats?.visitorChange !== undefined
              ? `${visitorStats.visitorChange >= 0 ? "+" : ""}${visitorStats.visitorChange}%`
              : "—"}
            changeType={visitorStats?.visitorChange !== undefined
              ? (visitorStats.visitorChange >= 0 ? "positive" : "negative")
              : "neutral"}
            subtitle="vs last week"
            viewReportLink="/admin/analytics"
            animationDelay={0}
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={Calendar}
            change={`${stats.todayBookings} today`}
            changeType={stats.todayBookings > 0 ? "positive" : "neutral"}
            subtitle=""
            viewReportLink="/admin/bookings"
            animationDelay={50}
          />
          <StatCard
            title="Conversion Rate"
            value={`${conversionStats?.conversionRate || 0}%`}
            icon={TrendingUp}
            change={conversionStats?.conversionChange !== undefined
              ? `${conversionStats.conversionChange >= 0 ? "+" : ""}${conversionStats.conversionChange}%`
              : "—"}
            changeType={conversionStats?.conversionChange !== undefined
              ? (conversionStats.conversionChange >= 0 ? "positive" : "negative")
              : "neutral"}
            subtitle="vs last week"
            viewReportLink="/admin/analytics"
            animationDelay={100}
          />
          <StatCard
            title="Total Revenue"
            value={`AED ${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            change={stats.confirmedBookings > 0 ? `${stats.confirmedBookings} confirmed` : "—"}
            changeType={stats.confirmedBookings > 0 ? "positive" : "neutral"}
            viewReportLink="/admin/bookings"
            animationDelay={150}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VisitorsChart />
          <SalesChart />
        </div>

        {/* Middle Row: Top Tours + Secondary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Booked Tours */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 sm:p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Top Booked Tours</h3>
                <p className="text-xs text-muted-foreground mt-0.5">By number of bookings</p>
              </div>
              <Link to="/admin/tours" className="text-xs text-secondary hover:underline flex items-center gap-1">
                All Tours <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {topTours.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Ship className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topTours.map((tour, idx) => {
                  const maxCount = topTours[0]?.count || 1;
                  const pct = Math.round((tour.count / maxCount) * 100);
                  return (
                    <div key={tour.tour_name} className="group flex items-center gap-4">
                      <span className="w-6 text-sm font-bold text-muted-foreground">#{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{tour.tour_name}</p>
                        <div className="mt-1.5 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-secondary to-secondary/60 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-foreground">{tour.count}</p>
                        <p className="text-[10px] text-muted-foreground">AED {tour.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Secondary Stats */}
          <div className="space-y-4">
            <StatCard
              title="Pending Bookings"
              value={stats.pendingBookings}
              icon={Clock}
              change={stats.pendingBookings > 0 ? "Action needed" : "All clear"}
              changeType={stats.pendingBookings > 0 ? "negative" : "positive"}
              viewReportLink="/admin/bookings"
              animationDelay={0}
            />
            <StatCard
              title="Inquiries"
              value={stats.totalInquiries}
              icon={MessageSquare}
              change={`${stats.newInquiries} new`}
              changeType={stats.newInquiries > 0 ? "negative" : "neutral"}
              viewReportLink="/admin/inquiries"
              animationDelay={50}
            />
            <StatCard
              title="Active Tours"
              value={stats.activeTours}
              icon={Ship}
              change="Live now"
              changeType="positive"
              viewReportLink="/admin/tours"
              animationDelay={100}
            />
          </div>
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
          <div className="space-y-6">
            <ActivityFeed />
            <OverviewCard />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
