import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Calendar,
  Ship,
  MessageSquare,
  Star,
  Image,
  Users,
  Settings,
  Percent,
  History,
  Scale,
  Headset,
  MapPin,
  Plus,
  Search,
  FileText,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  icon: React.ElementType;
  href: string;
  keywords?: string[];
  group: "navigation" | "actions" | "recent";
}

const navigationItems: CommandItem[] = [
  { id: "dashboard", title: "Dashboard", icon: LayoutDashboard, href: "/admin", keywords: ["home", "overview"], group: "navigation" },
  { id: "bookings", title: "Bookings", icon: Calendar, href: "/admin/bookings", keywords: ["reservations", "orders"], group: "navigation" },
  { id: "live-chat", title: "Live Chat", icon: Headset, href: "/admin/live-chat", keywords: ["support", "messages"], group: "navigation" },
  { id: "locations", title: "Locations", icon: MapPin, href: "/admin/locations", keywords: ["places", "areas"], group: "navigation" },
  { id: "tours", title: "All Tours", icon: Ship, href: "/admin/tours", keywords: ["products", "experiences"], group: "navigation" },
  { id: "categories", title: "Categories", icon: FileText, href: "/admin/tours/categories", keywords: ["types"], group: "navigation" },
  { id: "inquiries", title: "Inquiries", icon: MessageSquare, href: "/admin/inquiries", keywords: ["questions", "contact"], group: "navigation" },
  { id: "reviews", title: "Reviews", icon: Star, href: "/admin/reviews", keywords: ["ratings", "feedback"], group: "navigation" },
  { id: "gallery", title: "Gallery", icon: Image, href: "/admin/gallery", keywords: ["photos", "images"], group: "navigation" },
  { id: "customers", title: "Customers", icon: Users, href: "/admin/customers", keywords: ["clients", "users"], group: "navigation" },
  { id: "discounts", title: "Discounts", icon: Percent, href: "/admin/discounts", keywords: ["coupons", "promotions"], group: "navigation" },
  { id: "activity-log", title: "Activity Log", icon: History, href: "/admin/activity-log", keywords: ["audit", "history"], group: "navigation" },
  { id: "legal-pages", title: "Legal Pages", icon: Scale, href: "/admin/legal-pages", keywords: ["terms", "privacy"], group: "navigation" },
  { id: "settings", title: "Site Settings", icon: Settings, href: "/admin/settings/site", keywords: ["configuration"], group: "navigation" },
];

const actionItems: CommandItem[] = [
  { id: "add-tour", title: "Add New Tour", icon: Plus, href: "/admin/tours/add", keywords: ["create", "new"], group: "actions" },
  { id: "view-pending", title: "View Pending Bookings", icon: Calendar, href: "/admin/bookings?status=pending", keywords: ["pending"], group: "actions" },
];

const RECENT_KEY = "admin_command_recent";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) {
      try {
        setRecentIds(JSON.parse(stored));
      } catch {
        setRecentIds([]);
      }
    }
  }, []);

  const addToRecent = useCallback((id: string) => {
    setRecentIds((prev) => {
      const updated = [id, ...prev.filter((i) => i !== id)].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSelect = (item: CommandItem) => {
    addToRecent(item.id);
    navigate(item.href);
    onOpenChange(false);
  };

  const allItems = [...navigationItems, ...actionItems];
  const recentItems = recentIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter(Boolean) as CommandItem[];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, actions..." />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center py-6 text-muted-foreground">
            <Search className="w-10 h-10 mb-2 opacity-50" />
            <p>No results found</p>
          </div>
        </CommandEmpty>

        {recentItems.length > 0 && (
          <>
            <CommandGroup heading="Recent">
              {recentItems.map((item) => (
                <CommandItem
                  key={`recent-${item.id}`}
                  value={item.title}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-3 py-3"
                >
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.title} ${item.keywords?.join(" ") || ""}`}
              onSelect={() => handleSelect(item)}
              className="flex items-center gap-3 py-3"
            >
              <item.icon className="w-4 h-4 text-muted-foreground" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {actionItems.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.title} ${item.keywords?.join(" ") || ""}`}
              onSelect={() => handleSelect(item)}
              className="flex items-center gap-3 py-3"
            >
              <item.icon className="w-4 h-4 text-secondary" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
        <span>Navigate with ↑↓ arrows</span>
        <span>
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">ESC</kbd> to close
        </span>
      </div>
    </CommandDialog>
  );
};

export default CommandPalette;
