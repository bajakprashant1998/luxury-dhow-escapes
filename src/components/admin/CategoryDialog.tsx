import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, CategoryInsert } from "@/hooks/useCategories";
import {
  Ship,
  Anchor,
  Crown,
  Users,
  Sailboat,
  Waves,
  Sun,
  Moon,
  Utensils,
  Camera,
  FolderOpen,
} from "lucide-react";

const ICON_OPTIONS = [
  { value: "ship", label: "Ship", icon: Ship },
  { value: "anchor", label: "Anchor", icon: Anchor },
  { value: "crown", label: "Crown", icon: Crown },
  { value: "users", label: "Users", icon: Users },
  { value: "sailboat", label: "Sailboat", icon: Sailboat },
  { value: "waves", label: "Waves", icon: Waves },
  { value: "sun", label: "Sun", icon: Sun },
  { value: "moon", label: "Moon", icon: Moon },
  { value: "utensils", label: "Utensils", icon: Utensils },
  { value: "camera", label: "Camera", icon: Camera },
  { value: "folder", label: "Folder", icon: FolderOpen },
];

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSave: (data: CategoryInsert) => void;
  isLoading?: boolean;
}

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const CategoryDialog = ({
  open,
  onOpenChange,
  category,
  onSave,
  isLoading,
}: CategoryDialogProps) => {
  const [formData, setFormData] = useState<CategoryInsert>({
    name: "",
    slug: "",
    description: "",
    icon: "folder",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        icon: category.icon || "folder",
        sort_order: category.sort_order || 0,
        is_active: category.is_active ?? true,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "folder",
        sort_order: 0,
        is_active: true,
      });
    }
  }, [category, open]);

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: category ? prev.slug : generateSlug(name),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const selectedIcon = ICON_OPTIONS.find((opt) => opt.value === formData.icon);
  const IconComponent = selectedIcon?.icon || FolderOpen;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Dhow Cruises"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="e.g., dhow-cruises"
              required
            />
            <p className="text-xs text-muted-foreground">
              Used in URLs and for filtering tours
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Brief description of this category..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon || "folder"}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, icon: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span>{selectedIcon?.label || "Folder"}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                min="0"
                value={formData.sort_order || 0}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sort_order: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Active</Label>
              <p className="text-sm text-muted-foreground">
                Inactive categories won't be shown to visitors
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active ?? true}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_active: checked }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : category ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
