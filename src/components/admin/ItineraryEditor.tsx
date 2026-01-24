import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Clock } from "lucide-react";

export interface ItineraryItem {
  time: string;
  activity: string;
}

interface ItineraryEditorProps {
  items: ItineraryItem[];
  onChange: (items: ItineraryItem[]) => void;
}

const ItineraryEditor = ({ items, onChange }: ItineraryEditorProps) => {
  const addItem = () => {
    onChange([...items, { time: "", activity: "" }]);
  };

  const updateItem = (index: number, field: keyof ItineraryItem, value: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No itinerary items yet. Add your first one below.
        </p>
      ) : (
        items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex items-center gap-2 text-muted-foreground pt-2">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                value={item.time}
                onChange={(e) => updateItem(index, "time", e.target.value)}
                placeholder="Time (e.g., 10:00 AM)"
                className="sm:col-span-1"
              />
              <Input
                value={item.activity}
                onChange={(e) => updateItem(index, "activity", e.target.value)}
                placeholder="Activity description"
                className="sm:col-span-2"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="text-muted-foreground hover:text-destructive shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))
      )}
      <Button type="button" variant="outline" onClick={addItem} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Itinerary Item
      </Button>
    </div>
  );
};

export default ItineraryEditor;
