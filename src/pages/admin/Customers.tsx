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
import { useToast } from "@/hooks/use-toast";
import { Search, Users, Eye, Mail, Phone, Calendar, ShoppingBag, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  const { toast } = useToast();
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
      toast({
        title: "Error",
        description: "Failed to fetch customer data",
        variant: "destructive",
      });
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
        // Update name/phone if more recent
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

    // Sort
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
            Customers
          </h1>
          <p className="text-muted-foreground">
            View and manage customer information from bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Repeat Customers</p>
                  <p className="text-2xl font-bold text-foreground">{stats.repeatCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Spend</p>
                  <p className="text-2xl font-bold text-foreground">AED {stats.avgSpent.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">AED {stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="bookings">Most Bookings</SelectItem>
              <SelectItem value="spent">Highest Spend</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Booking</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm ? "No customers match your search" : "No customers found"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                          <span className="text-secondary font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{customer.bookingCount}</span>
                        {customer.bookingCount > 1 && (
                          <Badge variant="secondary" className="text-xs">Repeat</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-secondary">
                        AED {customer.totalSpent.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {new Date(customer.lastBooking).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
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

        {/* Customer Detail Dialog */}
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="text-secondary font-bold text-lg">
                    {selectedCustomer?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-bold">{selectedCustomer?.name}</p>
                  <p className="text-sm text-muted-foreground font-normal">Customer since {selectedCustomer && new Date(selectedCustomer.firstBooking).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                </div>
              </DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCustomer.phone}</span>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-card border border-border rounded-lg">
                    <p className="text-2xl font-bold text-foreground">{selectedCustomer.bookingCount}</p>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                  </div>
                  <div className="text-center p-4 bg-card border border-border rounded-lg">
                    <p className="text-2xl font-bold text-secondary">AED {selectedCustomer.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="text-center p-4 bg-card border border-border rounded-lg">
                    <p className="text-2xl font-bold text-foreground">AED {(selectedCustomer.totalSpent / selectedCustomer.bookingCount).toFixed(0)}</p>
                    <p className="text-sm text-muted-foreground">Avg. Booking</p>
                  </div>
                </div>

                {/* Booking History */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Booking History
                  </h3>
                  <div className="space-y-3">
                    {selectedCustomer.bookings
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{booking.tour_name}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>
                                {new Date(booking.booking_date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span>
                                {booking.adults} Adults
                                {booking.children > 0 && `, ${booking.children} Kids`}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">AED {booking.total_price}</p>
                            <div className="mt-1">{getStatusBadge(booking.status)}</div>
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
