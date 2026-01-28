import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  MessageSquare,
  Star,
  Ship,
  User,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_name: string | null;
  user_email: string | null;
  created_at: string;
}

const actionIcons: Record<string, React.ElementType> = {
  create: Plus,
  update: Edit,
  delete: Trash2,
  confirm: CheckCircle,
  cancel: XCircle,
};

const entityIcons: Record<string, React.ElementType> = {
  booking: Calendar,
  tour: Ship,
  inquiry: MessageSquare,
  review: Star,
  customer: User,
};

const actionColors: Record<string, string> = {
  create: "bg-emerald-500/10 text-emerald-600",
  update: "bg-blue-500/10 text-blue-600",
  delete: "bg-rose-500/10 text-rose-600",
  confirm: "bg-emerald-500/10 text-emerald-600",
  cancel: "bg-amber-500/10 text-amber-600",
};

const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("activity-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_logs",
        },
        (payload) => {
          setActivities((prev) => [payload.new as ActivityLog, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("id, action, entity_type, entity_name, user_email, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    const normalizedAction = action.toLowerCase();
    return actionIcons[normalizedAction] || Edit;
  };

  const getEntityIcon = (entityType: string) => {
    const normalized = entityType.toLowerCase();
    return entityIcons[normalized] || Calendar;
  };

  const getActionColor = (action: string) => {
    const normalizedAction = action.toLowerCase();
    return actionColors[normalizedAction] || "bg-muted text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-foreground">Recent Activity</h3>
        <a
          href="/admin/activity-log"
          className="text-xs text-secondary hover:underline"
        >
          View all
        </a>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const ActionIcon = getActionIcon(activity.action);
            const EntityIcon = getEntityIcon(activity.entity_type);

            return (
              <div
                key={activity.id}
                className={cn(
                  "flex items-start gap-3 animate-fade-in",
                  index === 0 && "relative"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    getActionColor(activity.action)
                  )}
                >
                  <ActionIcon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium capitalize">{activity.action}</span>{" "}
                    <span className="text-muted-foreground">{activity.entity_type}</span>
                    {activity.entity_name && (
                      <span className="font-medium truncate"> "{activity.entity_name}"</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <EntityIcon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* New indicator for first item */}
                {index === 0 && (
                  <span className="shrink-0 w-2 h-2 rounded-full bg-secondary animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
