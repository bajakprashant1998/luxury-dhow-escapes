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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Discount, DiscountInsert } from "@/hooks/useDiscounts";
import { Wand2, Copy } from "lucide-react";
import { toast } from "sonner";

interface DiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discount?: Discount | null;
  onSave: (data: DiscountInsert) => void;
  isLoading?: boolean;
}

const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function DiscountDialog({
  open,
  onOpenChange,
  discount,
  onSave,
  isLoading = false,
}: DiscountDialogProps) {
  const [formData, setFormData] = useState<DiscountInsert>({
    code: "",
    name: "",
    type: "percentage",
    value: 10,
    min_order_amount: null,
    max_uses: null,
    starts_at: null,
    expires_at: null,
    is_active: true,
    applicable_tour_ids: null,
  });

  useEffect(() => {
    if (discount) {
      setFormData({
        code: discount.code,
        name: discount.name,
        type: discount.type,
        value: discount.value,
        min_order_amount: discount.min_order_amount,
        max_uses: discount.max_uses,
        starts_at: discount.starts_at,
        expires_at: discount.expires_at,
        is_active: discount.is_active,
        applicable_tour_ids: discount.applicable_tour_ids,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        type: "percentage",
        value: 10,
        min_order_amount: null,
        max_uses: null,
        starts_at: null,
        expires_at: null,
        is_active: true,
        applicable_tour_ids: null,
      });
    }
  }, [discount, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleGenerateCode = () => {
    setFormData((prev) => ({ ...prev, code: generateCode() }));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(formData.code);
    toast.success("Code copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {discount ? "Edit Discount" : "Create Discount"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">Discount Code</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="e.g., SUMMER20"
                required
                className="font-mono uppercase"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGenerateCode}
                title="Generate code"
              >
                <Wand2 className="w-4 h-4" />
              </Button>
              {formData.code && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyCode}
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Summer Sale 20% Off"
              required
            />
          </div>

          {/* Type and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "percentage" | "fixed") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (AED)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">
                Value {formData.type === "percentage" ? "(%)" : "(AED)"}
              </Label>
              <Input
                id="value"
                type="number"
                min="0"
                max={formData.type === "percentage" ? 100 : undefined}
                step="0.01"
                value={formData.value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    value: parseFloat(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>
          </div>

          {/* Min Order and Max Uses */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_order">Minimum Order (AED)</Label>
              <Input
                id="min_order"
                type="number"
                min="0"
                step="0.01"
                value={formData.min_order_amount || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    min_order_amount: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  }))
                }
                placeholder="No minimum"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_uses">Usage Limit</Label>
              <Input
                id="max_uses"
                type="number"
                min="1"
                value={formData.max_uses || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    max_uses: e.target.value ? parseInt(e.target.value) : null,
                  }))
                }
                placeholder="Unlimited"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="starts_at">Start Date</Label>
              <Input
                id="starts_at"
                type="datetime-local"
                value={
                  formData.starts_at
                    ? new Date(formData.starts_at).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    starts_at: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expires_at">Expiry Date</Label>
              <Input
                id="expires_at"
                type="datetime-local"
                value={
                  formData.expires_at
                    ? new Date(formData.expires_at).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expires_at: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  }))
                }
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Active</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
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
              {isLoading ? "Saving..." : discount ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
