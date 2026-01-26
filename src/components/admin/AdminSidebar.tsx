import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Ship,
  MessageSquare,
  Star,
  Image,
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  FileText,
  Home,
  Mail,
  Percent,
  Globe,
  History,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Bookings", href: "/admin/bookings", icon: Calendar },
  { title: "Locations", href: "/admin/locations", icon: MapPin },
  {
    title: "Tours",
    icon: Ship,
    children: [
      { title: "All Tours", href: "/admin/tours" },
      { title: "Add Tour", href: "/admin/tours/add" },
      { title: "Categories", href: "/admin/tours/categories" },
    ],
  },
  { title: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { title: "Reviews", href: "/admin/reviews", icon: Star },
  { title: "Gallery", href: "/admin/gallery", icon: Image },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Discounts", href: "/admin/discounts", icon: Percent },
  { title: "Activity Log", href: "/admin/activity-log", icon: History },
  { title: "Legal Pages", href: "/admin/legal-pages", icon: Scale },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "Site Settings", href: "/admin/settings/site" },
      { title: "Homepage", href: "/admin/settings/homepage" },
      { title: "Footer", href: "/admin/settings/footer" },
      { title: "Email Templates", href: "/admin/settings/email" },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Tours", "Settings"]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children: { href: string }[]) =>
    children.some((child) => location.pathname === child.href);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-primary text-white transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-white/10">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <Ship className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold">BetterView</h1>
            <p className="text-xs text-white/60">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-88px)]">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isParentActive(item.children)
                        ? "bg-secondary text-primary"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.title}
                    </span>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedItems.includes(item.title) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={onClose}
                          className={cn(
                            "block px-4 py-2 rounded-lg text-sm transition-colors",
                            isActive(child.href)
                              ? "bg-secondary/20 text-secondary"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href!}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href!)
                      ? "bg-secondary text-primary"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
