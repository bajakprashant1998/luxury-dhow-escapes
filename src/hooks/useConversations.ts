import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatConversation, ChatMessage } from "@/lib/chatUtils";
import { withTimeout } from "@/lib/withTimeout";

export function useConversations() {
  const [conversations, setConversations] = useState<(ChatConversation & { lastMessage?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<ChatMessage[]>([]);

  // Fetch all active conversations with optimized query
  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch conversations
      const { data: convs, error } = await withTimeout(
        supabase
          .from("chat_conversations")
          .select("*")
          .in("status", ["active", "waiting_agent"])
          .order("updated_at", { ascending: false }),
        5000,
        "Failed to load conversations"
      );

      if (error) throw error;

      if (!convs || convs.length === 0) {
        setConversations([]);
        return;
      }

      // Fetch last message for ALL conversations in ONE query
      const convIds = convs.map((c) => c.id);
      
      const { data: allMessages } = await withTimeout(
        supabase
          .from("chat_messages")
          .select("conversation_id, content, created_at")
          .in("conversation_id", convIds)
          .order("created_at", { ascending: false }),
        5000,
        "Failed to load messages"
      );

      // Group messages by conversation_id and take the first (most recent)
      const lastMessageMap = new Map<string, string>();
      (allMessages || []).forEach((msg) => {
        if (!lastMessageMap.has(msg.conversation_id)) {
          lastMessageMap.set(msg.conversation_id, msg.content);
        }
      });

      // Merge conversations with their last message
      const convsWithMessages = convs.map((conv) => ({
        ...conv,
        lastMessage: lastMessageMap.get(conv.id) || "No messages",
      })) as (ChatConversation & { lastMessage?: string })[];

      setConversations(convsWithMessages);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Select a conversation and load its messages
  const selectConversation = useCallback(async (conv: ChatConversation) => {
    setSelectedConversation(conv);
    
    try {
      const { data: msgs } = await withTimeout(
        supabase
          .from("chat_messages")
          .select("*")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: true }),
        5000,
        "Failed to load conversation messages"
      );

      setSelectedMessages((msgs || []) as ChatMessage[]);
    } catch (error) {
      console.error("Error loading conversation messages:", error);
      setSelectedMessages([]);
    }
  }, []);

  // Join conversation as agent
  const joinConversation = useCallback(async (conversationId: string, userId: string) => {
    try {
      await withTimeout(
        supabase
          .from("chat_conversations")
          .update({
            is_agent_connected: true,
            agent_id: userId,
            status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", conversationId),
        5000,
        "Failed to join conversation"
      );

      // Send system message
      await withTimeout(
        supabase.from("chat_messages").insert({
          conversation_id: conversationId,
          sender_type: "bot",
          sender_name: "System",
          content: "You are now connected with a live agent.",
          metadata: { isSystem: true },
        }),
        5000,
        "Failed to send system message"
      );

      setSelectedConversation((prev) =>
        prev ? { ...prev, is_agent_connected: true } : null
      );
    } catch (error) {
      console.error("Error joining conversation:", error);
    }
  }, []);

  // Send message as agent
  const sendAgentMessage = useCallback(async (conversationId: string, content: string, agentName: string) => {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from("chat_messages")
          .insert({
            conversation_id: conversationId,
            sender_type: "agent",
            sender_name: agentName || "Support Agent",
            content,
          })
          .select()
          .single(),
        5000,
        "Failed to send message"
      );

      if (error) throw error;

      // Update conversation timestamp (fire and forget)
      withTimeout(
        supabase
          .from("chat_conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversationId),
        5000
      ).catch(console.error);

      return data;
    } catch (error) {
      console.error("Error sending agent message:", error);
      throw error;
    }
  }, []);

  // Close conversation
  const closeConversation = useCallback(async (conversationId: string) => {
    try {
      await withTimeout(
        supabase
          .from("chat_conversations")
          .update({
            status: "closed",
            closed_at: new Date().toISOString(),
            is_agent_connected: false,
          })
          .eq("id", conversationId),
        5000,
        "Failed to close conversation"
      );

      // Remove from list
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setSelectedMessages([]);
      }
    } catch (error) {
      console.error("Error closing conversation:", error);
    }
  }, [selectedConversation]);

  // Set up realtime subscriptions
  useEffect(() => {
    fetchConversations();

    // Subscribe to new conversations
    const conversationsChannel = supabase
      .channel("admin_conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_conversations",
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      conversationsChannel.unsubscribe();
    };
  }, [fetchConversations]);

  // Subscribe to messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const messagesChannel = supabase
      .channel(`admin_messages_${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setSelectedMessages((prev) => {
            const exists = prev.some((m) => m.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      messagesChannel.unsubscribe();
    };
  }, [selectedConversation?.id]);

  return {
    conversations,
    isLoading,
    selectedConversation,
    selectedMessages,
    selectConversation,
    joinConversation,
    sendAgentMessage,
    closeConversation,
    refresh: fetchConversations,
  };
}
