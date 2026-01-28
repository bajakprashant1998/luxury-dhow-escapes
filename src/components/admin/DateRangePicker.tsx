import { useState } from "react";
import { format, subDays, startOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type PresetKey = "today" | "yesterday" | "last7" | "last30" | "thisWeek" | "thisMonth" | "custom";

const presets: { key: PresetKey; label: string; getRange: () => DateRange }[] = [
  {
    key: "today",
    label: "Today",
    getRange: () => ({ from: new Date(), to: new Date() }),
  },
  {
    key: "yesterday",
    label: "Yesterday",
    getRange: () => {
      const yesterday = subDays(new Date(), 1);
      return { from: yesterday, to: yesterday };
    },
  },
  {
    key: "last7",
    label: "Last 7 days",
    getRange: () => ({ from: subDays(new Date(), 6), to: new Date() }),
  },
  {
    key: "last30",
    label: "Last 30 days",
    getRange: () => ({ from: subDays(new Date(), 29), to: new Date() }),
  },
  {
    key: "thisWeek",
    label: "This week",
    getRange: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: new Date() }),
  },
  {
    key: "thisMonth",
    label: "This month",
    getRange: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }),
  },
  {
    key: "custom",
    label: "Custom range",
    getRange: () => ({ from: undefined, to: undefined }),
  },
];

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  placeholder?: string;
}

const DateRangePicker = ({
  value,
  onChange,
  className,
  placeholder = "Pick a date range",
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | null>(null);

  const handlePresetChange = (key: PresetKey) => {
    setSelectedPreset(key);
    if (key !== "custom") {
      const preset = presets.find((p) => p.key === key);
      if (preset) {
        onChange(preset.getRange());
        setOpen(false);
      }
    }
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    if (range) {
      onChange(range);
      setSelectedPreset("custom");
    }
  };

  const formatDateRange = () => {
    if (!value?.from) return placeholder;
    if (!value.to) return format(value.from, "MMM d, yyyy");
    if (format(value.from, "yyyy-MM-dd") === format(value.to, "yyyy-MM-dd")) {
      return format(value.from, "MMM d, yyyy");
    }
    return `${format(value.from, "MMM d")} - ${format(value.to, "MMM d, yyyy")}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal h-9 sm:h-10",
            !value?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{formatDateRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col sm:flex-row">
          {/* Presets */}
          <div className="p-3 border-b sm:border-b-0 sm:border-r border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Quick select</p>
            <div className="flex flex-wrap sm:flex-col gap-1">
              {presets.map((preset) => (
                <Button
                  key={preset.key}
                  variant={selectedPreset === preset.key ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => handlePresetChange(preset.key)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="p-3">
            <Calendar
              mode="range"
              selected={value}
              onSelect={handleCalendarSelect}
              numberOfMonths={1}
              disabled={(date) => date > new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-border p-3 flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange({ from: undefined, to: undefined });
              setSelectedPreset(null);
              setOpen(false);
            }}
          >
            Clear
          </Button>
          <Button
            size="sm"
            onClick={() => setOpen(false)}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
