import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Search,
  Eye,
  Check,
  X,
  Calendar,
  Users,
  Download,
  Mail,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  XCircle,
  Phone,
  FileText,
  ArrowUpRight,
  RefreshCw,
  Copy,
  LayoutList,
  CalendarDays,
} from "lucide-react";
import BookingCalendar from "@/components/admin/BookingCalendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import TablePagination from "@/components/admin/TablePagination";
import BulkActionToolbar, { BOOKING_BULK_ACTIONS } from "@/components/admin/BulkActionToolbar";
import StatusBadge from "@/components/admin/StatusBadge";
import { usePagination } from "@/hooks/usePagination";
import { exportBookings } from "@/lib/exportCsv";
import { sendBookingEmail } from "@/lib/sendBookingEmail";
import { format, subDays, isWithinInterval, startOfDay, endOfDay, parseISO } from "date-fns";

interface Booking {
  id: string;
  tour_id: string;
  tour_name: string;
  booking_date: string;
  adults: number;
  children: number;
  infants: number;
  total_price: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests: string | null;
  status: string;
  created_at: string;
  booking_type: string | null;
}

type DateRange = "7d" | "30d" | "90d" | "all";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  useEffect(() => {
    fetchBookings();

    // Real-time subscription
    const channel = supabase
      .channel("bookings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookings((prev) => [payload.new as Booking, ...prev]);
            toast.info("New booking received!", { icon: "🔔" });
          } else if (payload.eventType === "UPDATE") {
            setBookings((prev) =>
              prev.map((b) => (b.id === (payload.new as Booking).id ? (payload.new as Booking) : b))
            );
          } else if (payload.eventType === "DELETE") {
            setBookings((prev) => prev.filter((b) => b.id !== (payload.old as { id: string }).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBookings();
    setIsRefreshing(false);
    toast.success("Bookings refreshed");
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
      toast.success(`Booking ${status}`);

      const emailType = status === "confirmed" ? "confirmation" : status === "cancelled" ? "cancelled" : "pending";
      const emailResult = await sendBookingEmail(id, emailType);
      if (emailResult.success) {
        toast.success("Email notification sent");
      } else {
        console.warn("Email sending failed:", emailResult.error);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.tour_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

      let matchesDate = true;
      if (dateRange !== "all") {
        const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
        const start = startOfDay(subDays(new Date(), days));
        const end = endOfDay(new Date());
        try {
          matchesDate = isWithinInterval(parseISO(booking.created_at), { start, end });
        } catch {
          matchesDate = true;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchTerm, statusFilter, dateRange]);

  // Stats with trends
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    const revenue = bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + Number(b.total_price), 0);

    // Last 7 days vs previous 7 days for trend
    const now = new Date();
    const last7 = bookings.filter((b) => {
      try {
        return isWithinInterval(parseISO(b.created_at), {
          start: subDays(now, 7),
          end: now,
        });
      } catch {
        return false;
      }
    }).length;
    const prev7 = bookings.filter((b) => {
      try {
        return isWithinInterval(parseISO(b.created_at), {
          start: subDays(now, 14),
          end: subDays(now, 7),
        });
      } catch {
        return false;
      }
    }).length;

    const trendPct = prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 100) : last7 > 0 ? 100 : 0;
    const avgValue = confirmed > 0 ? Math.round(revenue / confirmed) : 0;

    return { total, pending, confirmed, cancelled, revenue, trendPct, avgValue };
  }, [bookings]);

  const pagination = usePagination(filteredBookings, 10);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === pagination.paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pagination.paginatedItems.map((b) => b.id)));
    }
  };

  const handleBulkAction = async (action: string) => {
    setIsProcessing(true);
    const ids = Array.from(selectedIds);

    try {
      if (action === "delete") {
        const { error } = await supabase.from("bookings").delete().in("id", ids);
        if (error) throw error;
        setBookings(bookings.filter((b) => !ids.includes(b.id)));
        toast.success(`Deleted ${ids.length} booking(s)`);
      } else if (action === "confirm" || action === "cancel") {
        const status = action === "confirm" ? "confirmed" : "cancelled";
        const { error } = await supabase
          .from("bookings")
          .update({ status })
          .in("id", ids);
        if (error) throw error;
        setBookings(bookings.map((b) => (ids.includes(b.id) ? { ...b, status } : b)));
        toast.success(`Updated ${ids.length} booking(s) to ${status}`);

        const emailType = status === "confirmed" ? "confirmation" : "cancelled";
        let emailsSent = 0;
        for (const id of ids) {
          const result = await sendBookingEmail(id, emailType);
          if (result.success) emailsSent++;
        }
        if (emailsSent > 0) {
          toast.success(`Sent ${emailsSent} email notification(s)`);
        }
      }
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Bulk action error:", error);
      toast.error("Failed to perform action");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    const toExport =
      selectedIds.size > 0
        ? bookings.filter((b) => selectedIds.has(b.id))
        : filteredBookings;
    exportBookings(toExport);
    toast.success(`Exported ${toExport.length} booking(s)`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-9 w-28 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-7 w-20 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex gap-4 items-center">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className={`h-5 bg-muted rounded animate-pulse ${j === 0 ? "w-8" : j === 1 ? "w-32" : "w-20"}`} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Bookings
              </h1>
              {stats.pending > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                  {stats.pending} pending
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Manage all tour bookings · {stats.total} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden h-9">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className="h-full rounded-none px-3 gap-1.5"
                onClick={() => setViewMode("table")}
              >
                <LayoutList className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">List</span>
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                className="h-full rounded-none px-3 gap-1.5"
                onClick={() => setViewMode("calendar")}
              >
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Calendar</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="h-9 w-9"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" onClick={handleExport} size="sm" className="h-9">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards - Premium */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card className="relative overflow-hidden border-border group hover:shadow-md transition-all">
            <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{stats.total}</p>
                </div>
                <div className="p-2 rounded-xl bg-secondary/10">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] sm:text-xs">
                {stats.trendPct >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                )}
                <span className={stats.trendPct >= 0 ? "text-emerald-600" : "text-rose-600"}>
                  {stats.trendPct > 0 ? "+" : ""}{stats.trendPct}%
                </span>
                <span className="text-muted-foreground">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-border group hover:shadow-md transition-all">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{stats.pending}</p>
                </div>
                <div className="p-2 rounded-xl bg-amber-500/10">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
              </div>
              <div className="mt-2 text-[10px] sm:text-xs text-muted-foreground">
                Needs review
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-border group hover:shadow-md transition-all">
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">Confirmed</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{stats.confirmed}</p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
              </div>
              <div className="mt-2 text-[10px] sm:text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}% conversion
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-border group hover:shadow-md transition-all">
            <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">Cancelled</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{stats.cancelled}</p>
                </div>
                <div className="p-2 rounded-xl bg-rose-500/10">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
                </div>
              </div>
              <div className="mt-2 text-[10px] sm:text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0}% cancel rate
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-border group hover:shadow-md transition-all col-span-2 lg:col-span-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                    AED {stats.revenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-primary/10">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
              </div>
              <div className="mt-2 text-[10px] sm:text-xs text-muted-foreground">
                Avg AED {stats.avgValue.toLocaleString()} / booking
              </div>
            </CardContent>
          </Card>
        </div>

        {viewMode === "calendar" ? (
          <BookingCalendar
            bookings={filteredBookings}
            onSelectBooking={setSelectedBooking}
            onBookingUpdated={fetchBookings}
          />
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, tour, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
                <SelectTrigger className="w-full sm:w-[130px] h-9">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </p>
            </div>

            {/* Bulk Actions */}
            <BulkActionToolbar
              selectedCount={selectedIds.size}
              onClearSelection={() => setSelectedIds(new Set())}
              onAction={handleBulkAction}
              actions={BOOKING_BULK_ACTIONS}
              onExport={handleExport}
              isProcessing={isProcessing}
            />

            {/* Table */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={
                            pagination.paginatedItems.length > 0 &&
                            selectedIds.size === pagination.paginatedItems.length
                          }
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="min-w-[180px]">Customer</TableHead>
                      <TableHead className="min-w-[140px] hidden md:table-cell">Tour</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead className="hidden lg:table-cell">Guests</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden xl:table-cell">Booked</TableHead>
                      <TableHead className="text-right w-[110px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagination.paginatedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-16">
                          <div className="flex flex-col items-center gap-2">
                            <Calendar className="w-10 h-10 text-muted-foreground/40" />
                            <p className="text-muted-foreground font-medium">No bookings found</p>
                            <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pagination.paginatedItems.map((booking) => (
                        <TableRow
                          key={booking.id}
                          className={`group cursor-pointer transition-colors ${
                            booking.status === "pending" ? "bg-amber-500/[0.02]" : ""
                          }`}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedIds.has(booking.id)}
                              onCheckedChange={() => toggleSelect(booking.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{booking.customer_name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                                {booking.customer_email}
                              </p>
                              <p className="text-xs text-muted-foreground md:hidden truncate max-w-[160px] mt-0.5">
                                {booking.tour_name}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="truncate max-w-[180px] block text-sm">
                              {booking.tour_name}
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">
                            {format(new Date(booking.booking_date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-muted-foreground" />
                              {booking.adults + booking.children + booking.infants}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-sm">
                            AED {Number(booking.total_price).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={booking.status} size="sm" />
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                            {getTimeAgo(booking.created_at)}
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setSelectedBooking(booking)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {booking.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                                    onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 hidden sm:inline-flex"
                                    onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            <TablePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              onPageChange={pagination.goToPage}
              onPageSizeChange={pagination.setPageSize}
            />
          </>
        )}

        {/* Enhanced Booking Detail Dialog */}
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-lg max-h-[85vh] overflow-y-auto p-0">
            {selectedBooking && (
              <>
                {/* Dialog Header with status accent */}
                <div
                  className={`px-6 pt-6 pb-4 border-b border-border ${
                    selectedBooking.status === "confirmed"
                      ? "bg-emerald-500/5"
                      : selectedBooking.status === "pending"
                      ? "bg-amber-500/5"
                      : "bg-rose-500/5"
                  }`}
                >
                  <DialogHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <DialogTitle className="text-lg font-bold">
                          {selectedBooking.customer_name}
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                          #{selectedBooking.id.slice(0, 8)}
                        </p>
                      </div>
                      <StatusBadge status={selectedBooking.status} size="md" />
                    </div>
                  </DialogHeader>
                </div>

                <div className="px-6 py-5 space-y-5">
                  {/* Contact Info */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Contact Information
                    </h4>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-3 group/item">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm flex-1">{selectedBooking.customer_email}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover/item:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(selectedBooking.customer_email)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3 group/item">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm flex-1">{selectedBooking.customer_phone}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover/item:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(selectedBooking.customer_phone)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Tour Details */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Booking Details
                    </h4>
                    <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                      <div>
                        <p className="font-semibold text-sm">{selectedBooking.tour_name}</p>
                        {selectedBooking.booking_type && (
                          <p className="text-xs text-muted-foreground capitalize mt-0.5">
                            {selectedBooking.booking_type.replace("_", " ")} booking
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(selectedBooking.booking_date), "EEE, MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {selectedBooking.adults}A
                            {selectedBooking.children > 0 && ` · ${selectedBooking.children}C`}
                            {selectedBooking.infants > 0 && ` · ${selectedBooking.infants}I`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedBooking.special_requests && (
                    <>
                      <hr className="border-border" />
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Special Requests
                        </h4>
                        <div className="flex items-start gap-2 bg-muted/30 rounded-lg p-3">
                          <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-sm text-foreground">{selectedBooking.special_requests}</p>
                        </div>
                      </div>
                    </>
                  )}

                  <hr className="border-border" />

                  {/* Price */}
                  <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                    <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
                    <span className="text-2xl font-bold text-secondary">
                      AED {Number(selectedBooking.total_price).toLocaleString()}
                    </span>
                  </div>

                  {/* Timestamps */}
                  <p className="text-[10px] text-muted-foreground text-center">
                    Booked {format(parseISO(selectedBooking.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled={isSendingEmail}
                      onClick={async () => {
                        setIsSendingEmail(true);
                        const emailType =
                          selectedBooking.status === "confirmed"
                            ? "confirmation"
                            : selectedBooking.status === "cancelled"
                            ? "cancelled"
                            : "pending";
                        const result = await sendBookingEmail(selectedBooking.id, emailType);
                        if (result.success) {
                          toast.success("Email sent successfully");
                        } else {
                          toast.error("Failed to send email");
                        }
                        setIsSendingEmail(false);
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {isSendingEmail ? "Sending..." : "Send Email"}
                    </Button>
                    {selectedBooking.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-500/10 hover:text-rose-700"
                          onClick={() => {
                            updateBookingStatus(selectedBooking.id, "cancelled");
                            setSelectedBooking(null);
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={() => {
                            updateBookingStatus(selectedBooking.id, "confirmed");
                            setSelectedBooking(null);
                          }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Confirm
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
