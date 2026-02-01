import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, startOfWeek, startOfMonth, subDays, subWeeks, format } from "date-fns";

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("visitor_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("visitor_session_id", sessionId);
  }
  return sessionId;
};

// Track a page view (fire and forget)
export const trackPageView = async (pagePath: string) => {
  const sessionId = getSessionId();
  const referrer = document.referrer || null;
  const userAgent = navigator.userAgent || null;

  // Fire and forget - don't await
  supabase
    .from("page_views")
    .insert({
      session_id: sessionId,
      page_path: pagePath,
      referrer,
      user_agent: userAgent,
    })
    .then(({ error }) => {
      if (error) {
        console.error("Failed to track page view:", error);
      }
    });
};

// Hook to track page views on mount
export const useTrackPageView = (pagePath: string) => {
  useEffect(() => {
    trackPageView(pagePath);
  }, [pagePath]);
};

// Types for analytics data
interface VisitorStats {
  uniqueVisitors: number;
  totalPageViews: number;
  previousUniqueVisitors: number;
  previousPageViews: number;
  visitorChange: number;
  pageViewChange: number;
}

interface ConversionStats {
  visitors: number;
  bookings: number;
  conversionRate: number;
  previousConversionRate: number;
  conversionChange: number;
}

interface DailyVisitorData {
  date: string;
  day: string;
  visitors: number;
  pageViews: number;
}

// Fetch visitor stats for admin dashboard
export const useVisitorStats = (period: "week" | "month" = "week") => {
  return useQuery({
    queryKey: ["visitor-stats", period],
    queryFn: async (): Promise<VisitorStats> => {
      const now = new Date();
      let currentStart: Date;
      let previousStart: Date;
      let previousEnd: Date;

      if (period === "week") {
        currentStart = startOfWeek(now, { weekStartsOn: 1 });
        previousEnd = subDays(currentStart, 1);
        previousStart = startOfWeek(previousEnd, { weekStartsOn: 1 });
      } else {
        currentStart = startOfMonth(now);
        previousEnd = subDays(currentStart, 1);
        previousStart = startOfMonth(previousEnd);
      }

      // Current period stats
      const { data: currentViews, error: currentError } = await supabase
        .from("page_views")
        .select("session_id")
        .gte("created_at", currentStart.toISOString());

      if (currentError) throw currentError;

      // Previous period stats
      const { data: previousViews, error: prevError } = await supabase
        .from("page_views")
        .select("session_id")
        .gte("created_at", previousStart.toISOString())
        .lt("created_at", currentStart.toISOString());

      if (prevError) throw prevError;

      const currentUnique = new Set(currentViews?.map(v => v.session_id) || []).size;
      const previousUnique = new Set(previousViews?.map(v => v.session_id) || []).size;
      const currentTotal = currentViews?.length || 0;
      const previousTotal = previousViews?.length || 0;

      const visitorChange = previousUnique > 0 
        ? ((currentUnique - previousUnique) / previousUnique) * 100 
        : currentUnique > 0 ? 100 : 0;
      
      const pageViewChange = previousTotal > 0 
        ? ((currentTotal - previousTotal) / previousTotal) * 100 
        : currentTotal > 0 ? 100 : 0;

      return {
        uniqueVisitors: currentUnique,
        totalPageViews: currentTotal,
        previousUniqueVisitors: previousUnique,
        previousPageViews: previousTotal,
        visitorChange: Math.round(visitorChange * 10) / 10,
        pageViewChange: Math.round(pageViewChange * 10) / 10,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch conversion rate stats
export const useConversionStats = (period: "week" | "month" = "week") => {
  return useQuery({
    queryKey: ["conversion-stats", period],
    queryFn: async (): Promise<ConversionStats> => {
      const now = new Date();
      let currentStart: Date;
      let previousStart: Date;

      if (period === "week") {
        currentStart = startOfWeek(now, { weekStartsOn: 1 });
        previousStart = subWeeks(currentStart, 1);
      } else {
        currentStart = startOfMonth(now);
        previousStart = subDays(currentStart, 30);
      }

      // Current visitors
      const { data: currentViews, error: viewsError } = await supabase
        .from("page_views")
        .select("session_id")
        .gte("created_at", currentStart.toISOString());

      if (viewsError) throw viewsError;

      // Previous visitors
      const { data: previousViews, error: prevViewsError } = await supabase
        .from("page_views")
        .select("session_id")
        .gte("created_at", previousStart.toISOString())
        .lt("created_at", currentStart.toISOString());

      if (prevViewsError) throw prevViewsError;

      // Current bookings
      const { data: currentBookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("id")
        .gte("created_at", currentStart.toISOString());

      if (bookingsError) throw bookingsError;

      // Previous bookings
      const { data: previousBookings, error: prevBookingsError } = await supabase
        .from("bookings")
        .select("id")
        .gte("created_at", previousStart.toISOString())
        .lt("created_at", currentStart.toISOString());

      if (prevBookingsError) throw prevBookingsError;

      const currentVisitors = new Set(currentViews?.map(v => v.session_id) || []).size;
      const previousVisitors = new Set(previousViews?.map(v => v.session_id) || []).size;
      const currentBookingCount = currentBookings?.length || 0;
      const previousBookingCount = previousBookings?.length || 0;

      const currentRate = currentVisitors > 0 
        ? (currentBookingCount / currentVisitors) * 100 
        : 0;
      const previousRate = previousVisitors > 0 
        ? (previousBookingCount / previousVisitors) * 100 
        : 0;

      const conversionChange = previousRate > 0 
        ? ((currentRate - previousRate) / previousRate) * 100 
        : currentRate > 0 ? 100 : 0;

      return {
        visitors: currentVisitors,
        bookings: currentBookingCount,
        conversionRate: Math.round(currentRate * 100) / 100,
        previousConversionRate: Math.round(previousRate * 100) / 100,
        conversionChange: Math.round(conversionChange * 10) / 10,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch daily visitor data for charts
export const useDailyVisitors = (days: number = 7) => {
  return useQuery({
    queryKey: ["daily-visitors", days],
    queryFn: async (): Promise<DailyVisitorData[]> => {
      const now = new Date();
      const startDate = subDays(startOfDay(now), days - 1);

      const { data: views, error } = await supabase
        .from("page_views")
        .select("session_id, created_at")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by day
      const dailyData: Map<string, { sessions: Set<string>; count: number }> = new Map();

      for (let i = 0; i < days; i++) {
        const date = subDays(now, days - 1 - i);
        const dateKey = format(date, "yyyy-MM-dd");
        dailyData.set(dateKey, { sessions: new Set(), count: 0 });
      }

      views?.forEach(view => {
        const dateKey = format(new Date(view.created_at), "yyyy-MM-dd");
        if (dailyData.has(dateKey)) {
          const data = dailyData.get(dateKey)!;
          data.sessions.add(view.session_id);
          data.count++;
        }
      });

      return Array.from(dailyData.entries()).map(([dateKey, data]) => ({
        date: dateKey,
        day: format(new Date(dateKey), "EEE"),
        visitors: data.sessions.size,
        pageViews: data.count,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch top pages
export const useTopPages = (limit: number = 10) => {
  return useQuery({
    queryKey: ["top-pages", limit],
    queryFn: async () => {
      const startDate = subDays(new Date(), 30);

      const { data, error } = await supabase
        .from("page_views")
        .select("page_path")
        .gte("created_at", startDate.toISOString());

      if (error) throw error;

      // Count page views per path
      const pageCounts: Map<string, number> = new Map();
      data?.forEach(view => {
        const count = pageCounts.get(view.page_path) || 0;
        pageCounts.set(view.page_path, count + 1);
      });

      // Sort and return top pages
      return Array.from(pageCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([path, views]) => ({ path, views }));
    },
    staleTime: 1000 * 60 * 5,
  });
};
