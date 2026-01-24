import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Search, Loader2 } from "lucide-react";
import { LocationDialog } from "@/components/admin/LocationDialog";
import { LocationsTable } from "@/components/admin/LocationsTable";
import {
  useLocations,
  useCreateLocation,
  useUpdateLocation,
  useDeleteLocation,
  useBulkUpdateLocationOrder,
  type Location,
  type LocationInsert,
} from "@/hooks/useLocations";

const AdminLocations = () => {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const { data: locations = [], isLoading } = useLocations();
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const deleteMutation = useDeleteLocation();
  const reorderMutation = useBulkUpdateLocationOrder();

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.slug.toLowerCase().includes(search.toLowerCase()) ||
      loc.address?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (location?: Location) => {
    setEditingLocation(location || null);
    setDialogOpen(true);
  };

  const handleSave = (data: LocationInsert) => {
    if (editingLocation) {
      updateMutation.mutate(
        { id: editingLocation.id, ...data },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingLocation(null);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleReorder = (updates: { id: string; sort_order: number }[]) => {
    reorderMutation.mutate(updates);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Locations
            </h1>
            <p className="text-muted-foreground">
              Manage departure points and tour locations
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredLocations.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              {search ? "No locations found" : "No locations yet"}
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              {search
                ? "Try adjusting your search terms."
                : "Add departure points like Dubai Marina, Creek, and other tour locations."}
            </p>
            {!search && (
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Location
              </Button>
            )}
          </div>
        ) : (
          <LocationsTable
            locations={filteredLocations}
            onEdit={handleOpenDialog}
            onDelete={handleDelete}
            onReorder={handleReorder}
            isDeleting={deleteMutation.isPending}
          />
        )}
      </div>

      {/* Dialog */}
      <LocationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        location={editingLocation}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </AdminLayout>
  );
};

export default AdminLocations;
