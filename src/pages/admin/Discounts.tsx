import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Percent } from "lucide-react";
import {
  useDiscounts,
  useCreateDiscount,
  useUpdateDiscount,
  useDeleteDiscount,
  useToggleDiscountStatus,
  Discount,
  DiscountInsert,
} from "@/hooks/useDiscounts";
import DiscountDialog from "@/components/admin/DiscountDialog";
import DiscountsTable from "@/components/admin/DiscountsTable";
import TablePagination from "@/components/admin/TablePagination";
import { usePagination } from "@/hooks/usePagination";

const AdminDiscounts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  const { data: discounts = [], isLoading } = useDiscounts();
  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();
  const deleteDiscount = useDeleteDiscount();
  const toggleStatus = useToggleDiscountStatus();

  // Filter discounts
  const filteredDiscounts = discounts.filter((discount) => {
    const matchesSearch =
      discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discount.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "all") return matchesSearch;

    const now = new Date();
    const isExpired = discount.expires_at && new Date(discount.expires_at) < now;
    const isActive = discount.is_active && !isExpired;

    if (statusFilter === "active") return matchesSearch && isActive;
    if (statusFilter === "inactive") return matchesSearch && !discount.is_active;
    if (statusFilter === "expired") return matchesSearch && isExpired;

    return matchesSearch;
  });

  // Pagination
  const pagination = usePagination(filteredDiscounts, 10);

  const handleSave = (data: DiscountInsert) => {
    if (editingDiscount) {
      updateDiscount.mutate(
        { id: editingDiscount.id, ...data },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingDiscount(null);
          },
        }
      );
    } else {
      createDiscount.mutate(data, {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    }
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteDiscount.mutate(id);
  };

  const handleToggleStatus = (id: string, is_active: boolean) => {
    toggleStatus.mutate({ id, is_active });
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingDiscount(null);
    }
  };

  if (isLoading) {
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
              Discounts & Coupons
            </h1>
            <p className="text-muted-foreground">
              Create and manage promotional offers
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Discount
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by code or name..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Discounts Table or Empty State */}
        {discounts.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Percent className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              No Discounts Yet
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Create your first discount code to offer promotions to your customers.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Discount
            </Button>
          </div>
        ) : (
          <>
            <DiscountsTable
              discounts={pagination.paginatedItems}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              isDeleting={deleteDiscount.isPending}
            />
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
          </>
        )}

        {/* Discount Dialog */}
        <DiscountDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          discount={editingDiscount}
          onSave={handleSave}
          isLoading={createDiscount.isPending || updateDiscount.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDiscounts;
