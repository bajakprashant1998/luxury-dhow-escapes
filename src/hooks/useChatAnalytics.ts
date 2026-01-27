import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format, parseISO, differenceInSeconds } from "date-fns";
import { withTimeout } from "@/lib/withTimeout";

export type TimePeriod = "today" | "7days" | "30days" | "all";

interface HourlyData {
  hour: number;
  count: number;
}

interface DailyTrend {
  date: string;
  conversations: number;
  leads: number;
}

export interface ChatAnalytics {
  totalConversations: number;
  conversationsToday: number;
  avgResponseTime: number;
  leadConversionRate: number;
  agentHandledCount: number;
  botHandledCount: number;
  messagesPerConversation: number;
  hourlyDistribution: HourlyData[];
  dailyTrend: DailyTrend[];
  isLoading: boolean;
}

export function useChatAnalytics(period: TimePeriod = "7days") {
  const [analytics, setAnalytics] = useState<ChatAnalytics>({
    totalConversations: 0,
    conversationsToday: 0,
    avgResponseTime: 0,
    leadConversionRate: 0,
    agentHandledCount: 0,
    botHandledCount: 0,
    messagesPerConversation: 0,
    hourlyDistribution: [],
    dailyTrend: [],
    isLoading: true,
  });

  const getDateRange = useCallback(() => {
    const now = new Date();
    const today = startOfDay(now);

    switch (period) {
      case "today":
        return { start: today, end: now };
      case "7days":
        return { start: subDays(today, 7), end: now };
      case "30days":
        return { start: subDays(today, 30), end: now };
      case "all":
        return { start: new Date("2020-01-01"), end: now };
    }
  }, [period]);

  const fetchAnalytics = useCallback(async () => {
    setAnalytics((prev) => ({ ...prev, isLoading: true }));

    try {
      const { start, end } = getDateRange();
      const startISO = start.toISOString();
      const endISO = end.toISOString();
      const todayISO = startOfDay(new Date()).toISOString();

      // Fetch conversations with limit for performance
      const { data: conversations, error: convError } = await withTimeout(
        supabase
          .from("chat_conversations")
          .select("id, created_at, is_agent_connected, status")
          .gte("created_at", startISO)
          .lte("created_at", endISO)
          .limit(1000),
        8000,
        "Failed to load conversations"
      );

      if (convError) throw convError;

      // Fetch conversations today (count only)
      const { count: todayCount } = await withTimeout(
        supabase
          .from("chat_conversations")
          .select("*", { count: "exact", head: true })
          .gte("created_at", todayISO),
        5000,
        "Failed to count today's conversations"
      );

      // Fetch leads with limit
      const { data: leads, error: leadsError } = await withTimeout(
        supabase
          .from("chat_leads")
          .select("id, created_at")
          .gte("created_at", startISO)
          .lte("created_at", endISO)
          .limit(1000),
        5000,
        "Failed to load leads"
      );

      if (leadsError) throw leadsError;

      // Fetch messages for response time calculation - limit to recent for performance
      const { data: messages, error: msgsError } = await withTimeout(
        supabase
          .from("chat_messages")
          .select("conversation_id, sender_type, created_at")
          .gte("created_at", startISO)
          .lte("created_at", endISO)
          .order("created_at", { ascending: true })
          .limit(1000),
        8000,
        "Failed to load messages"
      );

      if (msgsError) throw msgsError;

      // Calculate metrics
      const totalConversations = conversations?.length || 0;
      const agentHandledCount = conversations?.filter((c) => c.is_agent_connected).length || 0;
      const botHandledCount = totalConversations - agentHandledCount;
      const leadConversionRate = totalConversations > 0
        ? ((leads?.length || 0) / totalConversations) * 100
        : 0;

      // Calculate average response time (visitor message to agent response)
      let totalResponseTime = 0;
      let responseCount = 0;

      const messagesByConv = (messages || []).reduce((acc, msg) => {
        if (!acc[msg.conversation_id]) acc[msg.conversation_id] = [];
        acc[msg.conversation_id].push(msg);
        return acc;
      }, {} as Record<string, typeof messages>);

      Object.values(messagesByConv).forEach((convMessages) => {
        for (let i = 0; i < (convMessages?.length || 0) - 1; i++) {
          const current = convMessages![i];
          const next = convMessages![i + 1];

          if (current.sender_type === "user" && next.sender_type === "agent") {
            const diff = differenceInSeconds(
              parseISO(next.created_at),
              parseISO(current.created_at)
            );
            if (diff > 0 && diff < 3600) {
              totalResponseTime += diff;
              responseCount++;
            }
          }
        }
      });

      const avgResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0;

      // Messages per conversation
      const messagesPerConversation = totalConversations > 0
        ? (messages?.length || 0) / totalConversations
        : 0;

      // Hourly distribution
      const hourlyMap = new Map<number, number>();
      for (let i = 0; i < 24; i++) hourlyMap.set(i, 0);

      (messages || []).forEach((msg) => {
        const hour = parseISO(msg.created_at).getHours();
        hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
      });

      const hourlyDistribution = Array.from(hourlyMap.entries()).map(([hour, count]) => ({
        hour,
        count,
      }));

      // Daily trend
      const dailyConvMap = new Map<string, number>();
      const dailyLeadMap = new Map<string, number>();

      (conversations || []).forEach((conv) => {
        const date = format(parseISO(conv.created_at), "yyyy-MM-dd");
        dailyConvMap.set(date, (dailyConvMap.get(date) || 0) + 1);
      });

      (leads || []).forEach((lead) => {
        const date = format(parseISO(lead.created_at), "yyyy-MM-dd");
        dailyLeadMap.set(date, (dailyLeadMap.get(date) || 0) + 1);
      });

      const allDates = new Set([...dailyConvMap.keys(), ...dailyLeadMap.keys()]);
      const dailyTrend = Array.from(allDates)
        .sort()
        .map((date) => ({
          date,
          conversations: dailyConvMap.get(date) || 0,
          leads: dailyLeadMap.get(date) || 0,
        }));

      setAnalytics({
        totalConversations,
        conversationsToday: todayCount || 0,
        avgResponseTime,
        leadConversionRate,
        agentHandledCount,
        botHandledCount,
        messagesPerConversation,
        hourlyDistribution,
        dailyTrend,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching chat analytics:", error);
      setAnalytics((prev) => ({ ...prev, isLoading: false }));
    }
  }, [getDateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { ...analytics, refresh: fetchAnalytics };
}
