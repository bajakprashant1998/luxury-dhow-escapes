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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Loader2, Ship, Star, MapPin, Copy, EyeOff } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import TablePagination from "@/components/admin/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { useCategories } from "@/hooks/useCategories";

type Tour = Tables<"tours">;

const AdminTours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const { data: categories = [] } = useCategories();

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

  const handleToggleStatus = async (tour: Tour) => {
    const newStatus = tour.status === "active" ? "draft" : "active";
    setTogglingIds((prev) => new Set(prev).add(tour.id));
    try {
      const { error } = await supabase
        .from("tours")
        .update({ status: newStatus })
        .eq("id", tour.id);

      if (error) throw error;

      setTours((prev) =>
        prev.map((t) => (t.id === tour.id ? { ...t, status: newStatus } : t))
      );
      toast.success(`Tour ${newStatus === "active" ? "activated" : "deactivated"}`);
    } catch (error: any) {
      console.error("Error toggling tour status:", error);
      toast.error("Failed to update tour status");
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(tour.id);
        return next;
      });
    }
  };

  const handleDuplicate = async (tour: Tour) => {
    setDuplicatingId(tour.id);
    try {
      const { data: fullTour, error: fetchError } = await supabase
        .from("tours")
        .select("*")
        .eq("id", tour.id)
        .single();

      if (fetchError || !fullTour) throw fetchError || new Error("Tour not found");

      const timestamp = Date.now();
      const { id, created_at, updated_at, seo_slug, ...tourData } = fullTour;

      const { data: newTour, error: insertError } = await supabase
        .from("tours")
        .insert({
          ...tourData,
          title: `Copy of ${fullTour.title}`,
          slug: `${fullTour.slug}-copy-${timestamp}`,
          seo_slug: null,
          status: "draft",
          featured: false,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setTours((prev) => [newTour, ...prev]);
      toast.success("Tour duplicated successfully", {
        action: newTour
          ? {
              label: "Edit Copy",
              onClick: () => window.location.assign(`/admin/tours/edit/${newTour.slug}`),
            }
          : undefined,
      });
    } catch (error: any) {
      console.error("Error duplicating tour:", error);
      toast.error(error.message || "Failed to duplicate tour");
    } finally {
      setDuplicatingId(null);
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
    const matchesStatus = statusFilter === "all" || tour.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Stats
  const stats = {
    total: tours.length,
    featured: tours.filter((t) => t.featured).length,
    active: tours.filter((t) => t.status === "active").length,
    inactive: tours.filter((t) => t.status !== "active").length,
    avgPrice: tours.length > 0 ? tours.reduce((sum, t) => sum + Number(t.price), 0) / tours.length : 0,
  };

  const pagination = usePagination(filteredTours, 10);

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      "dhow-cruise": "bg-blue-500/10 text-blue-600",
      "dhow": "bg-blue-500/10 text-blue-600",
      "megayacht": "bg-purple-500/10 text-purple-600",
      "yacht-shared": "bg-emerald-500/10 text-emerald-600",
      "shared": "bg-emerald-500/10 text-emerald-600",
      "yacht-private": "bg-amber-500/10 text-amber-600",
      "private": "bg-amber-500/10 text-amber-600",
      "water-activity": "bg-cyan-500/10 text-cyan-600",
      "yacht-event": "bg-pink-500/10 text-pink-600",
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
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Tours
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your tour packages
            </p>
          </div>
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link to="/admin/tours/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Tour
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-secondary/10">
                  <Ship className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Tours</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/10">
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Inactive</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.inactive}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Featured</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.featured}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 sm:h-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40 h-9 sm:h-10">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36 h-9 sm:h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tours Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Tour</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead className="hidden lg:table-cell">Visible</TableHead>
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
                    <TableRow key={tour.id} className={tour.status !== "active" ? "opacity-60" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2 sm:gap-3">
                          {tour.image_url ? (
                            <img
                              src={tour.image_url}
                              alt={tour.title}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                              <Ship className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{tour.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                              {tour.subtitle}
                            </p>
                            {/* Category badge on mobile */}
                            <Badge className={`${getCategoryBadge(tour.category)} sm:hidden mt-1 text-[10px]`} variant="secondary">
                              {tour.category}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className={getCategoryBadge(tour.category)} variant="secondary">
                          {tour.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        AED {Number(tour.price).toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{tour.duration || "-"}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              tour.status === "active" ? "bg-emerald-500" : "bg-muted-foreground/40"
                            }`}
                          />
                          <Switch
                            checked={tour.status === "active"}
                            disabled={togglingIds.has(tour.id)}
                            onCheckedChange={() => handleToggleStatus(tour)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
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
                              disabled={duplicatingId === tour.id}
                              onClick={() => handleDuplicate(tour)}
                            >
                              {duplicatingId === tour.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Copy className="w-4 h-4 mr-2" />
                              )}
                              Duplicate
                            </DropdownMenuItem>
                            {/* Toggle on mobile (visible column is hidden) */}
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(tour)}
                              disabled={togglingIds.has(tour.id)}
                              className="lg:hidden"
                            >
                              {tour.status === "active" ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
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
          <AlertDialogContent className="max-w-[calc(100vw-32px)] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Tour</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{tourToDelete?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel disabled={isDeleting} className="mt-0">Cancel</AlertDialogCancel>
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
