import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Users, Eye, Mail, Phone, Calendar, ShoppingBag, TrendingUp, Download, Crown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import TablePagination from "@/components/admin/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { exportCustomers } from "@/lib/exportCsv";

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

interface Customer {
  email: string;
  name: string;
  phone: string;
  bookingCount: number;
  totalSpent: number;
  lastBooking: string;
  firstBooking: string;
  bookings: Booking[];
}

const AdminCustomers = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("bookings");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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
      toast.error("Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  };

  // Aggregate customers from bookings
  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>();

    bookings.forEach((booking) => {
      const existing = customerMap.get(booking.customer_email);
      if (existing) {
        existing.bookingCount += 1;
        existing.totalSpent += Number(booking.total_price);
        existing.bookings.push(booking);
        if (new Date(booking.created_at) > new Date(existing.lastBooking)) {
          existing.name = booking.customer_name;
          existing.phone = booking.customer_phone;
          existing.lastBooking = booking.created_at;
        }
        if (new Date(booking.created_at) < new Date(existing.firstBooking)) {
          existing.firstBooking = booking.created_at;
        }
      } else {
        customerMap.set(booking.customer_email, {
          email: booking.customer_email,
          name: booking.customer_name,
          phone: booking.customer_phone,
          bookingCount: 1,
          totalSpent: Number(booking.total_price),
          lastBooking: booking.created_at,
          firstBooking: booking.created_at,
          bookings: [booking],
        });
      }
    });

    return Array.from(customerMap.values());
  }, [bookings]);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let result = customers.filter((customer) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone.includes(searchTerm)
      );
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "bookings":
          return b.bookingCount - a.bookingCount;
        case "spent":
          return b.totalSpent - a.totalSpent;
        case "recent":
          return new Date(b.lastBooking).getTime() - new Date(a.lastBooking).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return b.bookingCount - a.bookingCount;
      }
    });

    return result;
  }, [customers, searchTerm, sortBy]);

  const pagination = usePagination(filteredCustomers, 10);

  // Stats
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const repeatCustomers = customers.filter((c) => c.bookingCount > 1).length;
    const avgSpent = totalCustomers > 0
      ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers
      : 0;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

    return { totalCustomers, repeatCustomers, avgSpent, totalRevenue };
  }, [customers]);

  const handleExport = () => {
    exportCustomers(filteredCustomers);
    toast.success(`Exported ${filteredCustomers.length} customer(s)`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[10px]">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-[10px]">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-[10px]">Cancelled</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">{status}</Badge>;
    }
  };

  // VIP threshold (top 10% spenders or 3+ bookings)
  const isVIP = (customer: Customer) => {
    return customer.bookingCount >= 3 || customer.totalSpent >= 3000;
  };

  if (loading) {
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
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex gap-4 items-center">
                  <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-20 bg-muted rounded animate-pulse" />
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
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Customers
            </h1>
            <p className="text-sm text-muted-foreground">
              View customer information
            </p>
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
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Repeat</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.repeatCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Avg. Spend</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">AED {stats.avgSpent.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">AED {stats.totalRevenue.toLocaleString()}</p>
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
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 h-9 sm:h-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[150px] h-9 sm:h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bookings">Most Bookings</SelectItem>
              <SelectItem value="spent">Highest Spend</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead className="hidden sm:table-cell">Last Booking</TableHead>
                  <TableHead className="text-right w-[60px]">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-sm">
                        {searchTerm ? "No customers match your search" : "No customers found"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  pagination.paginatedItems.map((customer) => (
                    <TableRow key={customer.email}>
                      <TableCell>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                            <span className="text-secondary font-semibold text-xs sm:text-sm">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-sm text-foreground truncate">{customer.name}</p>
                              {isVIP(customer) && (
                                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[150px]">{customer.email}</p>
                            {/* Phone on mobile */}
                            <p className="text-xs text-muted-foreground md:hidden">{customer.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          <span className="text-xs sm:text-sm">{customer.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-foreground">{customer.bookingCount}</span>
                          {customer.bookingCount > 1 && (
                            <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">Repeat</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-sm text-secondary">
                          AED {customer.totalSpent.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {new Date(customer.lastBooking).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
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

        {/* Customer Detail Dialog */}
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <span className="text-secondary font-bold text-sm sm:text-lg">
                    {selectedCustomer?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-lg sm:text-xl font-bold truncate">{selectedCustomer?.name}</p>
                    {selectedCustomer && isVIP(selectedCustomer) && (
                      <Badge className="bg-amber-500/10 text-amber-600 shrink-0">
                        <Crown className="w-3 h-3 mr-1" />
                        VIP
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                    Customer since {selectedCustomer && new Date(selectedCustomer.firstBooking).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-4 sm:space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-xs sm:text-sm truncate">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-xs sm:text-sm">{selectedCustomer.phone}</span>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center p-2 sm:p-4 bg-card border border-border rounded-lg">
                    <p className="text-lg sm:text-2xl font-bold text-foreground">{selectedCustomer.bookingCount}</p>
                    <p className="text-[10px] sm:text-sm text-muted-foreground">Bookings</p>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-card border border-border rounded-lg">
                    <p className="text-lg sm:text-2xl font-bold text-secondary">AED {selectedCustomer.totalSpent.toLocaleString()}</p>
                    <p className="text-[10px] sm:text-sm text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="text-center p-2 sm:p-4 bg-card border border-border rounded-lg">
                    <p className="text-lg sm:text-2xl font-bold text-foreground">AED {(selectedCustomer.totalSpent / selectedCustomer.bookingCount).toFixed(0)}</p>
                    <p className="text-[10px] sm:text-sm text-muted-foreground">Avg. Booking</p>
                  </div>
                </div>

                {/* Booking History */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Calendar className="w-4 h-4" />
                    Booking History
                  </h3>
                  <div className="space-y-2 sm:space-y-3 max-h-[200px] sm:max-h-[250px] overflow-y-auto">
                    {selectedCustomer.bookings
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg gap-2"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{booking.tour_name}</p>
                            <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground flex-wrap">
                              <span>{new Date(booking.booking_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                              <span>{booking.adults + booking.children} guests</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
                            {getStatusBadge(booking.status)}
                            <span className="font-semibold text-secondary text-sm">AED {booking.total_price}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
