import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen, Plus, Search } from "lucide-react";
import CategoriesTable from "@/components/admin/CategoriesTable";
import CategoryDialog from "@/components/admin/CategoryDialog";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  Category,
  CategoryInsert,
} from "@/hooks/useCategories";

const AdminCategories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading, error } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const filteredCategories = categories?.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleSave = (data: CategoryInsert) => {
    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory.id, ...data },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingCategory(null);
          },
        }
      );
    } else {
      createCategory.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Tour Categories
            </h1>
            <p className="text-muted-foreground">
              Organize tours into categories for better navigation
            </p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
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
            <p>Failed to load categories. Please try again.</p>
          </div>
        ) : filteredCategories && filteredCategories.length > 0 ? (
          <CategoriesTable
            categories={filteredCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteCategory.isPending}
          />
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              {searchQuery ? "No categories found" : "No categories yet"}
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search query."
                : "Create categories to organize your tours like Dhow Cruises, Private Yachts, and Group Tours."}
            </p>
            {!searchQuery && (
              <Button onClick={handleOpenCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Category
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
