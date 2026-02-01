import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  useVisitorStats,
  useConversionStats,
  useDailyVisitors,
  useTopPages,
} from "@/hooks/usePageViews";
import {
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
} from "lucide-react";

const COLORS = ["hsl(var(--secondary))", "hsl(var(--primary))", "hsl(var(--muted-foreground))", "#10B981", "#F59E0B"];

const Analytics = () => {
  const [period, setPeriod] = useState<"week" | "month">("week");
  
  const { data: visitorStats, isLoading: visitorLoading } = useVisitorStats(period);
  const { data: conversionStats, isLoading: conversionLoading } = useConversionStats(period);
  const { data: dailyVisitors, isLoading: dailyLoading } = useDailyVisitors(period === "week" ? 7 : 30);
  const { data: topPages, isLoading: topPagesLoading } = useTopPages(10);

  const isLoading = visitorLoading || conversionLoading || dailyLoading;

  // Conversion funnel data
  const funnelData = conversionStats ? [
    { name: "Visitors", value: conversionStats.visitors, fill: COLORS[0] },
    { name: "Engaged", value: Math.round(conversionStats.visitors * 0.6), fill: COLORS[1] },
    { name: "Interested", value: Math.round(conversionStats.visitors * 0.2), fill: COLORS[3] },
    { name: "Bookings", value: conversionStats.bookings, fill: COLORS[4] },
  ] : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Analytics
            </h1>
            <p className="text-muted-foreground">
              Track your website performance and conversion rates
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={period === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("week")}
            >
              This Week
            </Button>
            <Button
              variant={period === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("month")}
            >
              This Month
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Unique Visitors */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unique Visitors
              </CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {visitorStats?.uniqueVisitors.toLocaleString() || 0}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {(visitorStats?.visitorChange || 0) >= 0 ? (
                      <>
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">+{visitorStats?.visitorChange}%</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                        <span className="text-red-500">{visitorStats?.visitorChange}%</span>
                      </>
                    )}
                    <span className="text-muted-foreground">vs last {period}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Total Page Views */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Page Views
              </CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {visitorStats?.totalPageViews.toLocaleString() || 0}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {(visitorStats?.pageViewChange || 0) >= 0 ? (
                      <>
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">+{visitorStats?.pageViewChange}%</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                        <span className="text-red-500">{visitorStats?.pageViewChange}%</span>
                      </>
                    )}
                    <span className="text-muted-foreground">vs last {period}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
              <MousePointerClick className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {conversionLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {conversionStats?.conversionRate || 0}%
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {(conversionStats?.conversionChange || 0) >= 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">+{conversionStats?.conversionChange}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <span className="text-red-500">{conversionStats?.conversionChange}%</span>
                      </>
                    )}
                    <span className="text-muted-foreground">vs last {period}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Total Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bookings
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {conversionLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {conversionStats?.bookings || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    From {conversionStats?.visitors || 0} visitors
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitors Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Visitors Over Time</CardTitle>
              <CardDescription>
                Daily unique visitors and page views
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dailyLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyVisitors || []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        fontSize={12}
                      />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="visitors"
                        name="Unique Visitors"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--secondary))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="pageViews"
                        name="Page Views"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>
                Visitor journey from landing to booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conversionLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={funnelData}
                      layout="vertical"
                      margin={{ left: 20, right: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        width={80}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {funnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {topPagesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : topPages && topPages.length > 0 ? (
              <div className="space-y-3">
                {topPages.map((page, index) => {
                  const maxViews = topPages[0]?.views || 1;
                  const percentage = (page.views / maxViews) * 100;
                  return (
                    <div key={page.path} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground truncate max-w-[70%]">
                          {index + 1}. {page.path}
                        </span>
                        <span className="text-muted-foreground font-medium">
                          {page.views.toLocaleString()} views
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No page view data yet. Start tracking to see analytics.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
