import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, X, RotateCcw, Info, Briefcase, AlertCircle } from "lucide-react";
import {
  BookingFeatures,
  defaultCancellationInfo,
  defaultWhatToBring,
  defaultGoodToKnow,
} from "@/lib/tourMapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImportantInfoEditorProps {
  bookingFeatures: BookingFeatures;
  onChange: (bookingFeatures: BookingFeatures) => void;
}

const ImportantInfoEditor = ({ bookingFeatures, onChange }: ImportantInfoEditorProps) => {
  const updateList = (
    field: "cancellation_info" | "what_to_bring" | "good_to_know",
    newList: (string | { text: string; icon: "check" | "cross" | "info" | "dot" })[]
  ) => {
    onChange({ ...bookingFeatures, [field]: newList });
  };

  const addItem = (field: "cancellation_info" | "what_to_bring" | "good_to_know") => {
    const currentList = bookingFeatures[field] || [];
    // Default to strict object structure for new items
    updateList(field, [...currentList, { text: "", icon: "check" }]);
  };

  const updateItemText = (
    field: "cancellation_info" | "what_to_bring" | "good_to_know",
    index: number,
    text: string
  ) => {
    const currentList = bookingFeatures[field] || [];
    const newList = [...currentList];
    const item = newList[index];

    if (typeof item === 'string') {
      // Convert string to object if it was a string
      newList[index] = { text, icon: "check" };
    } else {
      newList[index] = { ...item, text };
    }
    updateList(field, newList);
  };

  const updateItemIcon = (
    field: "cancellation_info" | "what_to_bring" | "good_to_know",
    index: number,
    icon: "check" | "cross" | "info" | "dot"
  ) => {
    const currentList = bookingFeatures[field] || [];
    const newList = [...currentList];
    const item = newList[index];

    if (typeof item === 'string') {
      // Convert string to object
      newList[index] = { text: item, icon };
    } else {
      newList[index] = { ...item, icon };
    }
    updateList(field, newList);
  };

  const removeItem = (
    field: "cancellation_info" | "what_to_bring" | "good_to_know",
    index: number
  ) => {
    const newList = (bookingFeatures[field] || []).filter((_, i) => i !== index);
    updateList(field, newList);
  };

  const resetToDefaults = () => {
    onChange({
      ...bookingFeatures,
      cancellation_info: defaultCancellationInfo,
      what_to_bring: defaultWhatToBring,
      good_to_know: defaultGoodToKnow,
    });
  };

  const renderListEditor = (
    field: "cancellation_info" | "what_to_bring" | "good_to_know",
    label: string,
    sectionIcon: React.ReactNode,
    placeholder: string
  ) => {
    const items = bookingFeatures[field] || [];

    return (
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          {sectionIcon}
          {label}
        </Label>
        <div className="space-y-2">
          {items.map((item, index) => {
            const text = typeof item === 'string' ? item : item.text;
            const icon = typeof item === 'string' ? 'check' : item.icon;

            return (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={icon}
                  onValueChange={(value: "check" | "cross" | "info" | "dot") =>
                    updateItemIcon(field, index, value)
                  }
                >
                  <SelectTrigger className="w-[100px] shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="cross">Cross</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="dot">Dot</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={text}
                  onChange={(e) => updateItemText(field, index, e.target.value)}
                  placeholder={placeholder}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(field, index)}
                  className="shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem(field)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Important Information
            </CardTitle>
            <CardDescription>
              Customize the information tabs shown on tour detail pages
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderListEditor(
          "cancellation_info",
          "Cancellation Policy",
          <AlertCircle className="w-4 h-4 text-destructive" />,
          "Free cancellation up to 24 hours..."
        )}

        {renderListEditor(
          "what_to_bring",
          "What to Bring",
          <Briefcase className="w-4 h-4 text-secondary" />,
          "Comfortable shoes..."
        )}

        {renderListEditor(
          "good_to_know",
          "Good to Know",
          <Info className="w-4 h-4 text-secondary" />,
          "Arrive 20-30 minutes before..."
        )}
      </CardContent>
    </Card>
  );
};

export default ImportantInfoEditor;
