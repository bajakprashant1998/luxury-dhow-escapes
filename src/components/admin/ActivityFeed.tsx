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
  Activity,
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
  create: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
  update: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
  delete: "bg-rose-500/10 text-rose-600 ring-rose-500/20",
  confirm: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
  cancel: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
};

const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();

    const channel = supabase
      .channel("activity-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_logs" },
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

  const getActionIcon = (action: string) => actionIcons[action.toLowerCase()] || Edit;
  const getEntityIcon = (entityType: string) => entityIcons[entityType.toLowerCase()] || Calendar;
  const getActionColor = (action: string) => actionColors[action.toLowerCase()] || "bg-muted text-muted-foreground ring-border";

  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
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
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
            <Activity className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">Recent Activity</h3>
            <p className="text-xs text-muted-foreground">Live updates</p>
          </div>
        </div>
        <a
          href="/admin/activity-log"
          className="text-xs text-secondary hover:underline font-medium"
        >
          View all
        </a>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No recent activity</p>
          <p className="text-xs mt-1">Activity will appear here in real-time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const ActionIcon = getActionIcon(activity.action);
            const EntityIcon = getEntityIcon(activity.entity_type);

            return (
              <div
                key={activity.id}
                className={cn(
                  "flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors animate-fade-in",
                  index === 0 && "relative"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl ring-1 flex items-center justify-center shrink-0",
                    getActionColor(activity.action)
                  )}
                >
                  <ActionIcon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">
                    <span className="font-semibold capitalize">{activity.action}</span>{" "}
                    <span className="text-muted-foreground">{activity.entity_type}</span>
                    {activity.entity_name && (
                      <span className="font-medium"> "{activity.entity_name}"</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <EntityIcon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {index === 0 && (
                  <span className="shrink-0 w-2 h-2 rounded-full bg-secondary animate-pulse mt-2" />
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
