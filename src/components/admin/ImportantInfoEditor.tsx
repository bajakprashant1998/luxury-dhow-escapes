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

interface ImportantInfoEditorProps {
  bookingFeatures: BookingFeatures;
  onChange: (bookingFeatures: BookingFeatures) => void;
}

const ImportantInfoEditor = ({ bookingFeatures, onChange }: ImportantInfoEditorProps) => {
  const updateList = (
    field: "cancellation_info" | "what_to_bring" | "good_to_know",
    newList: string[]
  ) => {
    onChange({ ...bookingFeatures, [field]: newList });
  };

  const addItem = (field: "cancellation_info" | "what_to_bring" | "good_to_know") => {
    const currentList = bookingFeatures[field] || [];
    updateList(field, [...currentList, ""]);
  };

  const updateItem = (
    field: "cancellation_info" | "what_to_bring" | "good_to_know",
    index: number,
    value: string
  ) => {
    const newList = [...(bookingFeatures[field] || [])];
    newList[index] = value;
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
    icon: React.ReactNode,
    placeholder: string
  ) => {
    const items = bookingFeatures[field] || [];

    return (
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          {icon}
          {label}
        </Label>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => updateItem(field, index, e.target.value)}
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
          ))}
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
          "✓ Free cancellation up to 24 hours..."
        )}

        {renderListEditor(
          "what_to_bring",
          "What to Bring",
          <Briefcase className="w-4 h-4 text-secondary" />,
          "• Comfortable shoes and smart casual attire..."
        )}

        {renderListEditor(
          "good_to_know",
          "Good to Know",
          <Info className="w-4 h-4 text-secondary" />,
          "• Arrive 20-30 minutes before departure..."
        )}
      </CardContent>
    </Card>
  );
};

export default ImportantInfoEditor;
