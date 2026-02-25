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
  Zap,
  Globe,
  RefreshCw,
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
  { label: "Add Tour", icon: Plus, href: "/admin/tours/add", color: "from-secondary to-secondary/80", description: "Create listing" },
  { label: "Bookings", icon: Calendar, href: "/admin/bookings", color: "from-blue-500 to-blue-400", description: "Manage orders" },
  { label: "Discounts", icon: Tag, href: "/admin/discounts", color: "from-purple-500 to-purple-400", description: "Promo codes" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics", color: "from-emerald-500 to-emerald-400", description: "View insights" },
  { label: "Tours", icon: Ship, href: "/admin/tours", color: "from-amber-500 to-amber-400", description: "All listings" },
  { label: "Settings", icon: Settings, href: "/admin/settings", color: "from-slate-500 to-slate-400", description: "Configure" },
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
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: visitorStats } = useVisitorStats("week");
  const { data: conversionStats } = useConversionStats("week");

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
          <div className="bg-card rounded-2xl border border-destructive/30 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
            <div>
              <p className="font-medium text-foreground">Dashboard data unavailable</p>
              <p className="text-sm text-muted-foreground">{loadError}</p>
            </div>
            <Button variant="outline" onClick={handleRetry} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        )}

        {/* Premium Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-secondary/15 via-secondary/5 to-transparent rounded-3xl border border-secondary/20 p-6 sm:p-8 animate-fade-in">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/8 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-full">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">Command Center</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-600">Live</span>
                </div>
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                Welcome back! 👋
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {format(currentTime, "EEEE, MMMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {format(currentTime, "h:mm a")}
                </span>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/admin/tours/add">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/25 rounded-xl gap-2">
                  <Plus className="w-4 h-4" />
                  Add Tour
                </Button>
              </Link>
              <Link to="/admin/bookings">
                <Button size="lg" variant="outline" className="border-secondary/30 hover:border-secondary/60 rounded-xl gap-2">
                  <Calendar className="w-4 h-4" />
                  Bookings
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button size="lg" variant="outline" className="border-border/60 hover:border-secondary/40 rounded-xl gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid - Enhanced */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 animate-fade-in" style={{ animationDelay: "50ms" }}>
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="group flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl bg-card border border-border/60 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-center">
                <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-secondary transition-colors block">{action.label}</span>
                <span className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">{action.description}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Primary Stats Grid - Enhanced */}
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
          {/* Top Booked Tours - Enhanced */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 sm:p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">Top Booked Tours</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">By number of bookings</p>
                </div>
              </div>
              <Link to="/admin/tours" className="text-xs text-secondary hover:underline flex items-center gap-1 font-medium">
                All Tours <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {topTours.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Ship className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No bookings yet</p>
                <p className="text-xs text-muted-foreground mt-1">Bookings will appear here once customers start booking</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topTours.map((tour, idx) => {
                  const maxCount = topTours[0]?.count || 1;
                  const pct = Math.round((tour.count / maxCount) * 100);
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div key={tour.tour_name} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold">
                        {idx < 3 ? medals[idx] : `#${idx + 1}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{tour.tour_name}</p>
                        <div className="mt-2 h-2.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-secondary to-secondary/50 rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right shrink-0 space-y-0.5">
                        <p className="text-sm font-bold text-foreground">{tour.count} <span className="text-xs font-normal text-muted-foreground">bookings</span></p>
                        <p className="text-xs text-muted-foreground font-medium">AED {tour.revenue.toLocaleString()}</p>
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
