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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, MoreHorizontal, Star, CheckCircle, XCircle, Download } from "lucide-react";
import { format } from "date-fns";
import TablePagination from "@/components/admin/TablePagination";
import BulkActionToolbar, { REVIEW_BULK_ACTIONS } from "@/components/admin/BulkActionToolbar";
import { usePagination } from "@/hooks/usePagination";
import { exportReviews } from "@/lib/exportCsv";

interface Review {
  id: string;
  tour_id: string | null;
  customer_name: string;
  customer_email: string | null;
  rating: number;
  review_text: string | null;
  status: string;
  created_at: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      toast.success(`Review ${status}`);
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) throw error;

      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.customer_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const pagination = usePagination(filteredReviews, 10);

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
      setSelectedIds(new Set(pagination.paginatedItems.map((r) => r.id)));
    }
  };

  const handleBulkAction = async (action: string) => {
    setIsProcessing(true);
    const ids = Array.from(selectedIds);

    try {
      if (action === "delete") {
        const { error } = await supabase.from("reviews").delete().in("id", ids);
        if (error) throw error;
        setReviews(reviews.filter((r) => !ids.includes(r.id)));
        toast.success(`Deleted ${ids.length} review(s)`);
      } else if (action === "approved" || action === "rejected") {
        const { error } = await supabase
          .from("reviews")
          .update({ status: action })
          .in("id", ids);
        if (error) throw error;
        setReviews(reviews.map((r) => (ids.includes(r.id) ? { ...r, status: action } : r)));
        toast.success(`Updated ${ids.length} review(s) to ${action}`);
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
      ? reviews.filter((r) => selectedIds.has(r.id))
      : filteredReviews;
    exportReviews(toExport);
    toast.success(`Exported ${toExport.length} review(s)`);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-500/10 text-amber-600",
      approved: "bg-emerald-500/10 text-emerald-600",
      rejected: "bg-rose-500/10 text-rose-600",
    };
    return styles[status] || "bg-muted text-muted-foreground";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-secondary text-secondary"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
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
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Reviews
            </h1>
            <p className="text-muted-foreground">
              Manage customer reviews and ratings
            </p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        <BulkActionToolbar
          selectedCount={selectedIds.size}
          onClearSelection={() => setSelectedIds(new Set())}
          onAction={handleBulkAction}
          actions={REVIEW_BULK_ACTIONS}
          onExport={handleExport}
          isProcessing={isProcessing}
        />

        {/* Reviews Table */}
        <div className="bg-card rounded-xl border border-border">
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
                <TableHead>Rating</TableHead>
                <TableHead className="max-w-[300px]">Review</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                pagination.paginatedItems.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(review.id)}
                        onCheckedChange={() => toggleSelect(review.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{review.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {review.customer_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="text-sm truncate">{review.review_text}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(review.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(review.status)} variant="secondary">
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => updateReviewStatus(review.id, "approved")}
                          >
                            <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateReviewStatus(review.id, "rejected")}
                          >
                            <XCircle className="w-4 h-4 mr-2 text-rose-600" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteReview(review.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
