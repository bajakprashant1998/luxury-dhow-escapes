import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import TablePagination from "@/components/admin/TablePagination";
import { usePagination } from "@/hooks/usePagination";

type Tour = Tables<"tours">;

const AdminTours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error("Error fetching tours:", error);
      toast.error("Failed to load tours");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (tour: Tour) => {
    setTourToDelete(tour);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tourToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("tours")
        .delete()
        .eq("id", tourToDelete.id);

      if (error) throw error;

      setTours((prev) => prev.filter((t) => t.id !== tourToDelete.id));
      toast.success("Tour deleted successfully");
    } catch (error: any) {
      console.error("Error deleting tour:", error);
      toast.error(error.message || "Failed to delete tour");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setTourToDelete(null);
    }
  };

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || tour.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const pagination = usePagination(filteredTours, 10);

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      dhow: "bg-blue-500/10 text-blue-600",
      megayacht: "bg-purple-500/10 text-purple-600",
      shared: "bg-emerald-500/10 text-emerald-600",
      private: "bg-amber-500/10 text-amber-600",
    };
    return colors[category] || "bg-muted text-muted-foreground";
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Tours
            </h1>
            <p className="text-muted-foreground">
              Manage your tour packages and experiences
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/tours/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Tour
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="dhow">Dhow Cruise</SelectItem>
              <SelectItem value="megayacht">Megayacht</SelectItem>
              <SelectItem value="shared">Shared Yacht</SelectItem>
              <SelectItem value="private">Private Yacht</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tours Table */}
        <div className="bg-card rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[350px]">Tour</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No tours found
                  </TableCell>
                </TableRow>
              ) : (
                pagination.paginatedItems.map((tour) => (
                  <TableRow key={tour.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {tour.image_url ? (
                          <img
                            src={tour.image_url}
                            alt={tour.title}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No img</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{tour.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                            {tour.subtitle}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryBadge(tour.category)} variant="secondary">
                        {tour.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      AED {Number(tour.price).toLocaleString()}
                    </TableCell>
                    <TableCell>{tour.duration || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          tour.featured
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-muted text-muted-foreground"
                        }
                        variant="secondary"
                      >
                        {tour.featured ? "Featured" : "Active"}
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
                          <DropdownMenuItem asChild>
                            <Link to={`/tours/${tour.slug}`} target="_blank">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/tours/edit/${tour.slug}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteClick(tour)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Tour</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{tourToDelete?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTours;
