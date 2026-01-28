import { useState, useEffect } from "react";
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
import { Search, Eye, Check, X, Calendar, Users, Download, Mail, DollarSign, Clock, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import TablePagination from "@/components/admin/TablePagination";
import BulkActionToolbar, { BOOKING_BULK_ACTIONS } from "@/components/admin/BulkActionToolbar";
import { usePagination } from "@/hooks/usePagination";
import { exportBookings } from "@/lib/exportCsv";
import { sendBookingEmail } from "@/lib/sendBookingEmail";

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
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    fetchBookings();
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

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tour_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + Number(b.total_price), 0),
  };

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
    const toExport = selectedIds.size > 0 
      ? bookings.filter((b) => selectedIds.has(b.id))
      : filteredBookings;
    exportBookings(toExport);
    toast.success(`Exported ${toExport.length} booking(s)`);
  };

  // Import skeleton components for loading state
  if (loading) {
    // Lazy import to avoid circular dependencies - inline skeleton
    return (
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-9 w-28 bg-muted rounded animate-pulse" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-6 w-12 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
            <div className="h-10 w-[150px] bg-muted rounded animate-pulse" />
          </div>

          {/* Table Skeleton */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`h-4 bg-muted rounded animate-pulse ${i === 0 ? 'w-8' : i === 1 ? 'w-28' : 'w-20'}`} />
                ))}
              </div>
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex gap-4 items-center">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className={`h-5 bg-muted rounded animate-pulse ${j === 0 ? 'w-8' : j === 1 ? 'w-32' : 'w-20'}`} />
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
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Bookings</h1>
            <p className="text-sm text-muted-foreground">Manage all tour bookings</p>
          </div>
          <Button variant="outline" onClick={handleExport} size="sm" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-secondary/10">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.confirmed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">AED {stats.revenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 h-9 sm:h-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px] h-9 sm:h-10">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
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

        {/* Table - Responsive */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px] sm:w-[50px]">
                    <Checkbox
                      checked={
                        pagination.paginatedItems.length > 0 &&
                        selectedIds.size === pagination.paginatedItems.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="min-w-[150px]">Customer</TableHead>
                  <TableHead className="min-w-[120px] hidden md:table-cell">Tour</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Guests</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  pagination.paginatedItems.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(booking.id)}
                          onCheckedChange={() => toggleSelect(booking.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{booking.customer_name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[140px]">{booking.customer_email}</p>
                          {/* Show tour on mobile */}
                          <p className="text-xs text-muted-foreground md:hidden truncate max-w-[140px] mt-0.5">{booking.tour_name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="truncate max-w-[180px] block text-sm">{booking.tour_name}</span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">
                        {new Date(booking.booking_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {booking.adults}A{booking.children > 0 && `, ${booking.children}C`}
                      </TableCell>
                      <TableCell className="font-semibold text-sm">AED {booking.total_price}</TableCell>
                      <TableCell>
                        <span
                          className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap ${
                            booking.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : booking.status === "pending"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-rose-500/10 text-rose-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
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
                                className="h-8 w-8 text-emerald-600 hover:text-emerald-700"
                                onClick={() => updateBookingStatus(booking.id, "confirmed")}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-rose-600 hover:text-rose-700 hidden sm:inline-flex"
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

        {/* Booking Detail Dialog */}
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedBooking.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-sm break-all">{selectedBooking.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedBooking.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedBooking.status === "confirmed"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : selectedBooking.status === "pending"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-rose-500/10 text-rose-600"
                      }`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>

                <hr className="border-border" />

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tour</p>
                  <p className="font-medium">{selectedBooking.tour_name}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(selectedBooking.booking_date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedBooking.adults} Adults, {selectedBooking.children} Kids, {selectedBooking.infants} Infants
                    </span>
                  </div>
                </div>

                {selectedBooking.special_requests && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-foreground text-sm">{selectedBooking.special_requests}</p>
                  </div>
                )}

                <hr className="border-border" />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-secondary">
                    AED {selectedBooking.total_price}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    disabled={isSendingEmail}
                    onClick={async () => {
                      setIsSendingEmail(true);
                      const emailType = selectedBooking.status === "confirmed" 
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
                    <Button
                      className="flex-1"
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, "confirmed");
                        setSelectedBooking(null);
                      }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
