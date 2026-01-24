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
import { Search, Eye, Check, X, Calendar, Users, Download, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

      // Send email notification
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

  // Pagination
  const pagination = usePagination(filteredBookings, 10);

  // Selection handlers
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Bookings</h1>
            <p className="text-muted-foreground">Manage all tour bookings</p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or tour..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
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

        {/* Table */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      pagination.paginatedItems.length > 0 &&
                      selectedIds.size === pagination.paginatedItems.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Tour</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                        <p className="font-medium">{booking.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{booking.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{booking.tour_name}</TableCell>
                    <TableCell>
                      {new Date(booking.booking_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {booking.adults} Adults
                      {booking.children > 0 && `, ${booking.children} Kids`}
                    </TableCell>
                    <TableCell className="font-semibold">AED {booking.total_price}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
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
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {booking.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-emerald-600 hover:text-emerald-700"
                              onClick={() => updateBookingStatus(booking.id, "confirmed")}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-rose-600 hover:text-rose-700"
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedBooking.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedBooking.customer_email}</p>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {new Date(selectedBooking.booking_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {selectedBooking.adults} Adults, {selectedBooking.children} Children,{" "}
                      {selectedBooking.infants} Infants
                    </span>
                  </div>
                </div>

                {selectedBooking.special_requests && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-foreground">{selectedBooking.special_requests}</p>
                  </div>
                )}

                <hr className="border-border" />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-secondary">
                    AED {selectedBooking.total_price}
                  </span>
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
