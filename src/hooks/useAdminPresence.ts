import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { withTimeout } from "@/lib/withTimeout";

export function useAdminPresence() {
  const [isOnline, setIsOnline] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          // Check existing presence
          const { data } = await withTimeout(
            supabase
              .from("admin_presence")
              .select("is_online")
              .eq("user_id", user.id)
              .maybeSingle(),
            5000,
            "Failed to check presence"
          );
          
          setIsOnline(data?.is_online || false);
        }
      } catch (error) {
        console.error("Error getting user presence:", error);
      }
    };
    getUser();
  }, []);

  // Toggle online status
  const toggleOnline = useCallback(async () => {
    if (!userId) return;

    const newStatus = !isOnline;

    try {
      const { data: existing } = await withTimeout(
        supabase
          .from("admin_presence")
          .select("user_id")
          .eq("user_id", userId)
          .maybeSingle(),
        5000,
        "Failed to check existing presence"
      );

      if (existing) {
        await withTimeout(
          supabase
            .from("admin_presence")
            .update({
              is_online: newStatus,
              last_seen: new Date().toISOString(),
            })
            .eq("user_id", userId),
          5000,
          "Failed to update presence"
        );
      } else {
        await withTimeout(
          supabase.from("admin_presence").insert({
            user_id: userId,
            is_online: newStatus,
            last_seen: new Date().toISOString(),
          }),
          5000,
          "Failed to create presence"
        );
      }

      setIsOnline(newStatus);
    } catch (error) {
      console.error("Error toggling presence:", error);
    }
  }, [userId, isOnline]);

  // Update last_seen periodically when online
  useEffect(() => {
    if (!userId || !isOnline) return;

    const interval = setInterval(async () => {
      try {
        await withTimeout(
          supabase
            .from("admin_presence")
            .update({ last_seen: new Date().toISOString() })
            .eq("user_id", userId),
          5000,
          "Failed to update last seen"
        );
      } catch (error) {
        console.error("Error updating last seen:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [userId, isOnline]);

  // Set offline on unmount
  useEffect(() => {
    return () => {
      if (userId && isOnline) {
        supabase
          .from("admin_presence")
          .update({ is_online: false, last_seen: new Date().toISOString() })
          .eq("user_id", userId);
      }
    };
  }, [userId, isOnline]);

  return {
    isOnline,
    toggleOnline,
    userId,
  };
}
