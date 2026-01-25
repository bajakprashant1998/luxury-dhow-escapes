import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  type: "booking" | "inquiry" | "review";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link: string;
}

const STORAGE_KEY = "admin_notifications_read";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const fetchNotifications = useCallback(async () => {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const oneDayAgoISO = oneDayAgo.toISOString();

      // Fetch recent pending bookings, new inquiries, and pending reviews in parallel
      const [bookingsRes, inquiriesRes, reviewsRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("id, customer_name, tour_name, created_at, status")
          .eq("status", "pending")
          .gte("created_at", oneDayAgoISO)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("inquiries")
          .select("id, name, subject, created_at, status")
          .eq("status", "new")
          .gte("created_at", oneDayAgoISO)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("reviews")
          .select("id, customer_name, rating, created_at, status")
          .eq("status", "pending")
          .gte("created_at", oneDayAgoISO)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      const allNotifications: Notification[] = [];

      // Map bookings to notifications
      if (bookingsRes.data) {
        bookingsRes.data.forEach((booking) => {
          allNotifications.push({
            id: `booking-${booking.id}`,
            type: "booking",
            title: "New Booking",
            message: `${booking.customer_name} booked ${booking.tour_name}`,
            timestamp: booking.created_at,
            read: readIds.has(`booking-${booking.id}`),
            link: "/admin/bookings",
          });
        });
      }

      // Map inquiries to notifications
      if (inquiriesRes.data) {
        inquiriesRes.data.forEach((inquiry) => {
          allNotifications.push({
            id: `inquiry-${inquiry.id}`,
            type: "inquiry",
            title: "New Inquiry",
            message: `${inquiry.name} sent ${inquiry.subject ? `"${inquiry.subject}"` : "a message"}`,
            timestamp: inquiry.created_at,
            read: readIds.has(`inquiry-${inquiry.id}`),
            link: "/admin/inquiries",
          });
        });
      }

      // Map reviews to notifications
      if (reviewsRes.data) {
        reviewsRes.data.forEach((review) => {
          allNotifications.push({
            id: `review-${review.id}`,
            type: "review",
            title: "New Review",
            message: `${review.customer_name} left a ${review.rating}-star review`,
            timestamp: review.created_at,
            read: readIds.has(`review-${review.id}`),
            link: "/admin/reviews",
          });
        });
      }

      // Sort by timestamp (newest first)
      allNotifications.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(allNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [readIds]);

  useEffect(() => {
    fetchNotifications();

    // Set up interval to refresh notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSet]));
      return newSet;
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    const allIds = notifications.map((n) => n.id);
    setReadIds((prev) => {
      const newSet = new Set([...prev, ...allIds]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSet]));
      return newSet;
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}
