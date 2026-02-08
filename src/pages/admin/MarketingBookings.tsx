import { useState, useEffect } from "react";
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
import { Search, Eye, Download, Megaphone, Inbox, Clock, Mail, Phone, Calendar, Users, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import TablePagination from "@/components/admin/TablePagination";
import { usePagination } from "@/hooks/usePagination";

interface MarketingInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

function parseBookingDetails(message: string) {
  const dateMatch = message.match(/Date:\s*([^,—]+)/);
  const guestsMatch = message.match(/Guests:\s*(\d+)/);
  return {
    date: dateMatch ? dateMatch[1].trim() : "—",
    guests: guestsMatch ? guestsMatch[1] : "—",
  };
}

const AdminMarketingBookings = () => {
  const [inquiries, setInquiries] = useState<MarketingInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<MarketingInquiry | null>(null);

  useEffect(() => {
    fetchMarketingBookings();

    // Realtime subscription
    const channel = supabase
      .channel("marketing-bookings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "inquiries" },
        (payload) => {
          const newInquiry = payload.new as MarketingInquiry;
          if (
            newInquiry.subject === "Landing Page Quick Booking" ||
            newInquiry.subject === "Landing Page Full Booking"
          ) {
            setInquiries((prev) => [newInquiry, ...prev]);
            toast.info("New marketing booking received!");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMarketingBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .or("subject.eq.Landing Page Quick Booking,subject.eq.Landing Page Full Booking")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error("Error fetching marketing bookings:", error);
      toast.error("Failed to fetch marketing bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
      if (error) throw error;
      setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status } : i)));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredInquiries = inquiries.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.phone || "").includes(searchTerm) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    responded: inquiries.filter((i) => i.status === "responded").length,
    today: inquiries.filter((i) => {
      const d = new Date(i.created_at);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length,
  };

  const pagination = usePagination(filteredInquiries, 10);

  const handleExport = () => {
    const rows = filteredInquiries.map((i) => {
      const details = parseBookingDetails(i.message);
      return {
        Name: i.name,
        Email: i.email,
        Phone: i.phone || "",
        "Booking Date": details.date,
        Guests: details.guests,
        Status: i.status,
        Source: i.subject || "",
        "Submitted At": new Date(i.created_at).toLocaleString(),
        Message: i.message,
      };
    });
    const headers = Object.keys(rows[0] || {});
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${String((r as Record<string, string>)[h]).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketing-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredInquiries.length} booking(s)`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border">
                <div className="h-10 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="h-64 bg-card rounded-xl border border-border animate-pulse" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-secondary" />
              Marketing Bookings
            </h1>
            <p className="text-sm text-muted-foreground">Leads from the promotional landing page</p>
          </div>
          <Button variant="outline" onClick={handleExport} size="sm" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-secondary/10">
                  <Inbox className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
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
                <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">New</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.new}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Responded</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.responded}</p>
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
                  <p className="text-xs sm:text-sm text-muted-foreground">Today</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.today}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 sm:h-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px] h-9 sm:h-10">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Phone</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Guests</TableHead>
                  <TableHead className="hidden lg:table-cell">Source</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right w-[60px]">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No marketing bookings yet
                    </TableCell>
                  </TableRow>
                ) : (
                  pagination.paginatedItems.map((inquiry) => {
                    const details = parseBookingDetails(inquiry.message);
                    return (
                      <TableRow key={inquiry.id} className={inquiry.status === "new" ? "bg-blue-500/5" : ""}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{inquiry.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[130px]">{inquiry.email !== "landing-page-lead@placeholder.com" ? inquiry.email : "—"}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{inquiry.phone || "—"}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{inquiry.phone || "—"}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{details.date}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{details.guests}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary whitespace-nowrap">
                            {inquiry.subject === "Landing Page Quick Booking" ? "Quick Form" : "Full Form"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(inquiry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          <span className="hidden sm:inline"> {new Date(inquiry.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                        </TableCell>
                        <TableCell>
                          <Select value={inquiry.status} onValueChange={(v) => updateStatus(inquiry.id, v)}>
                            <SelectTrigger className="w-[90px] sm:w-[110px] h-7 sm:h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="responded">Responded</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedInquiry(inquiry)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
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
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Marketing Booking Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (() => {
            const details = parseBookingDetails(selectedInquiry.message);
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Name</p>
                    <p className="font-medium text-sm">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {selectedInquiry.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="font-medium text-sm flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {selectedInquiry.email !== "landing-page-lead@placeholder.com" ? selectedInquiry.email : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Preferred Date</p>
                    <p className="font-medium text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {details.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Guests</p>
                    <p className="font-medium text-sm flex items-center gap-1">
                      <Users className="w-3 h-3" /> {details.guests}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Source</p>
                    <p className="font-medium text-sm">{selectedInquiry.subject === "Landing Page Quick Booking" ? "Quick Form (Hero)" : "Full Form (Bottom)"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Full Message</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{selectedInquiry.message}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                  <p className="text-sm">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  {selectedInquiry.phone && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={`tel:${selectedInquiry.phone}`}><Phone className="w-3 h-3 mr-1" /> Call</a>
                    </Button>
                  )}
                  {selectedInquiry.phone && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                        <MessageSquare className="w-3 h-3 mr-1" /> WhatsApp
                      </a>
                    </Button>
                  )}
                  {selectedInquiry.email !== "landing-page-lead@placeholder.com" && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${selectedInquiry.email}`}><Mail className="w-3 h-3 mr-1" /> Email</a>
                    </Button>
                  )}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMarketingBookings;
