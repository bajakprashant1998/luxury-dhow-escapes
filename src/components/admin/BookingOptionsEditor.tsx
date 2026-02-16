import { Plus, X, Users, Hash, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  BookingFeatures,
  GuestCategory,
  QuantityConfig,
  BookingAddon,
  defaultGuestCategories,
  defaultQuantityConfig,
} from "@/lib/tourMapper";

interface BookingOptionsEditorProps {
  bookingFeatures: BookingFeatures;
  onChange: (features: BookingFeatures) => void;
}

const BookingOptionsEditor = ({ bookingFeatures, onChange }: BookingOptionsEditorProps) => {
  const bookingMode = bookingFeatures.booking_mode || "guests";
  const guestCategories = bookingFeatures.guest_categories || defaultGuestCategories;
  const quantityConfig = bookingFeatures.quantity_config || defaultQuantityConfig;
  const addons = bookingFeatures.addons || [];

  const updateFeatures = (partial: Partial<BookingFeatures>) => {
    onChange({ ...bookingFeatures, ...partial });
  };

  // Guest categories helpers
  const updateCategory = (index: number, field: keyof GuestCategory, value: string | number) => {
    const updated = [...guestCategories];
    updated[index] = { ...updated[index], [field]: value };
    updateFeatures({ guest_categories: updated });
  };

  const addCategory = () => {
    updateFeatures({
      guest_categories: [...guestCategories, { name: "", label: "", price: 0, min: 0, max: 10 }],
    });
  };

  const removeCategory = (index: number) => {
    if (guestCategories.length <= 1) return;
    updateFeatures({ guest_categories: guestCategories.filter((_, i) => i !== index) });
  };

  // Quantity config helpers
  const updateQuantity = (field: keyof QuantityConfig, value: string | number) => {
    updateFeatures({ quantity_config: { ...quantityConfig, [field]: value } });
  };

  // Add-on helpers
  const addAddon = () => {
    const newAddon: BookingAddon = {
      id: crypto.randomUUID(),
      name: "",
      price: 0,
      description: "",
    };
    updateFeatures({ addons: [...addons, newAddon] });
  };

  const updateAddon = (index: number, field: keyof BookingAddon, value: string | number) => {
    const updated = [...addons];
    updated[index] = { ...updated[index], [field]: value };
    updateFeatures({ addons: updated });
  };

  const removeAddon = (index: number) => {
    updateFeatures({ addons: addons.filter((_, i) => i !== index) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-secondary" />
          Booking Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Booking Mode Toggle */}
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <Label className="text-sm font-semibold">Booking Mode</Label>
          <RadioGroup
            value={bookingMode}
            onValueChange={(v) => updateFeatures({ booking_mode: v as "guests" | "quantity" })}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="guests" id="mode-guests" />
              <Label htmlFor="mode-guests" className="cursor-pointer flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Guest Categories
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="quantity" id="mode-quantity" />
              <Label htmlFor="mode-quantity" className="cursor-pointer flex items-center gap-1.5">
                <Hash className="w-4 h-4" />
                Quantity Only
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Guest Categories Editor */}
        {bookingMode === "guests" && (
          <div className="space-y-3 p-4 bg-secondary/5 rounded-lg">
            <Label className="text-sm font-semibold">Guest Categories</Label>
            <p className="text-xs text-muted-foreground">
              Define guest types with names, age labels, and per-person prices. Price of 0 means use the tour's base price.
            </p>
            <div className="space-y-3">
              {guestCategories.map((cat, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_80px_60px_60px_40px] gap-2 items-end">
                  <div className="space-y-1">
                    {index === 0 && <Label className="text-xs">Name</Label>}
                    <Input
                      value={cat.name}
                      onChange={(e) => updateCategory(index, "name", e.target.value)}
                      placeholder="Adult"
                    />
                  </div>
                  <div className="space-y-1">
                    {index === 0 && <Label className="text-xs">Label</Label>}
                    <Input
                      value={cat.label}
                      onChange={(e) => updateCategory(index, "label", e.target.value)}
                      placeholder="12+ years"
                    />
                  </div>
                  <div className="space-y-1">
                    {index === 0 && <Label className="text-xs">Price</Label>}
                    <Input
                      type="number"
                      value={cat.price || ""}
                      onChange={(e) => updateCategory(index, "price", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    {index === 0 && <Label className="text-xs">Min</Label>}
                    <Input
                      type="number"
                      value={cat.min}
                      onChange={(e) => updateCategory(index, "min", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    {index === 0 && <Label className="text-xs">Max</Label>}
                    <Input
                      type="number"
                      value={cat.max}
                      onChange={(e) => updateCategory(index, "max", parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(index)}
                      disabled={guestCategories.length <= 1}
                      className="h-10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        )}

        {/* Quantity Config */}
        {bookingMode === "quantity" && (
          <div className="space-y-3 p-4 bg-secondary/5 rounded-lg">
            <Label className="text-sm font-semibold">Quantity Configuration</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Label</Label>
                <Input
                  value={quantityConfig.label}
                  onChange={(e) => updateQuantity("label", e.target.value)}
                  placeholder="Number of Tickets"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Price per unit (AED)</Label>
                <Input
                  type="number"
                  value={quantityConfig.price || ""}
                  onChange={(e) => updateQuantity("price", parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Minimum</Label>
                <Input
                  type="number"
                  value={quantityConfig.min}
                  onChange={(e) => updateQuantity("min", parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Maximum</Label>
                <Input
                  type="number"
                  value={quantityConfig.max}
                  onChange={(e) => updateQuantity("max", parseInt(e.target.value) || 50)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Add-Ons Editor */}
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Gift className="w-4 h-4 text-secondary" />
            Add-Ons
          </Label>
          <p className="text-xs text-muted-foreground">
            Optional extras customers can select during booking
          </p>
          <div className="space-y-3">
            {addons.map((addon, index) => (
              <div key={addon.id} className="border border-border rounded-lg p-3 space-y-2 bg-card">
                <div className="flex items-start gap-2">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_100px] gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Name</Label>
                      <Input
                        value={addon.name}
                        onChange={(e) => updateAddon(index, "name", e.target.value)}
                        placeholder="e.g., Champagne Package"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Price (AED)</Label>
                      <Input
                        type="number"
                        value={addon.price || ""}
                        onChange={(e) => updateAddon(index, "price", parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAddon(index)}
                    className="mt-5"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={addon.description}
                    onChange={(e) => updateAddon(index, "description", e.target.value)}
                    placeholder="Brief description of this add-on"
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addAddon}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Add-On
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingOptionsEditor;
