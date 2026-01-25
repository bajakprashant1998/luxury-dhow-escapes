import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, Plus, Search, Layers, CheckCircle } from "lucide-react";
import CategoriesTable from "@/components/admin/CategoriesTable";
import CategoryDialog from "@/components/admin/CategoryDialog";
import {
  useCategoriesWithCounts,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useBulkUpdateCategoryOrder,
  CategoryWithCount,
  CategoryInsert,
  CategoryUpdate,
} from "@/hooks/useCategories";

const AdminCategories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [localCategories, setLocalCategories] = useState<CategoryWithCount[] | null>(null);

  // Queries and mutations
  const { data: categories = [], isLoading, error } = useCategoriesWithCounts();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const bulkUpdateOrder = useBulkUpdateCategoryOrder();

  // Use local state for optimistic updates during drag, otherwise use fetched data
  const displayCategories = localCategories ?? categories;

  const filteredCategories = displayCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.is_active).length,
    totalTours: categories.reduce((sum, c) => sum + (c.tour_count || 0), 0),
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: CategoryWithCount) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleSave = (data: CategoryInsert | CategoryUpdate) => {
    if (editingCategory) {
      updateCategory.mutate(
        { ...data, id: editingCategory.id },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingCategory(null);
            setLocalCategories(null);
          },
        }
      );
    } else {
      createCategory.mutate(data as CategoryInsert, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setLocalCategories(null);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id, {
      onSuccess: () => {
        setLocalCategories(null);
      },
    });
  };

  const handleReorder = (reorderedCategories: CategoryWithCount[]) => {
    // Optimistic update
    setLocalCategories(reorderedCategories);

    // Persist to database
    const updates = reorderedCategories.map((cat, index) => ({
      id: cat.id,
      sort_order: index,
    }));

    bulkUpdateOrder.mutate(updates, {
      onSuccess: () => {
        setLocalCategories(null);
      },
      onError: () => {
        setLocalCategories(null);
      },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Tour Categories
            </h1>
            <p className="text-sm text-muted-foreground">
              Organize tours. Drag to reorder.
            </p>
          </div>
          <Button onClick={handleOpenCreate} size="sm" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-secondary/10">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
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
                <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
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
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                  <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Tours</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.totalTours}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 sm:h-10"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive rounded-xl p-6 text-center">
            <p className="text-sm">Failed to load categories. Please try again.</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="overflow-x-auto">
            <CategoriesTable
              categories={filteredCategories}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReorder={handleReorder}
              isDeleting={deleteCategory.isPending}
              isReordering={bulkUpdateOrder.isPending}
            />
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 sm:p-12 text-center">
            <FolderOpen className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-2">
              {searchQuery ? "No categories found" : "No categories yet"}
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto text-sm">
              {searchQuery
                ? "Try adjusting your search query."
                : "Create categories to organize your tours."}
            </p>
            {!searchQuery && (
              <Button onClick={handleOpenCreate} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Dialog */}
      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
        onSave={handleSave}
        isLoading={createCategory.isPending || updateCategory.isPending}
      />
    </AdminLayout>
  );
};

export default AdminCategories;
