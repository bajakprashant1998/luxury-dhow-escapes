import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminPresence() {
  const [isOnline, setIsOnline] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        // Check existing presence
        const { data } = await supabase
          .from("admin_presence")
          .select("is_online")
          .eq("user_id", user.id)
          .maybeSingle();
        
        setIsOnline(data?.is_online || false);
      }
    };
    getUser();
  }, []);

  // Toggle online status
  const toggleOnline = useCallback(async () => {
    if (!userId) return;

    const newStatus = !isOnline;

    try {
      const { data: existing } = await supabase
        .from("admin_presence")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("admin_presence")
          .update({
            is_online: newStatus,
            last_seen: new Date().toISOString(),
          })
          .eq("user_id", userId);
      } else {
        await supabase.from("admin_presence").insert({
          user_id: userId,
          is_online: newStatus,
          last_seen: new Date().toISOString(),
        });
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
      await supabase
        .from("admin_presence")
        .update({ last_seen: new Date().toISOString() })
        .eq("user_id", userId);
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
