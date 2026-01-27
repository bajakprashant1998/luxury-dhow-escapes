import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatConversation, ChatMessage } from "@/lib/chatUtils";

export function useConversations() {
  const [conversations, setConversations] = useState<(ChatConversation & { lastMessage?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<ChatMessage[]>([]);

  // Fetch all active conversations
  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: convs, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .in("status", ["active", "waiting_agent"])
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Fetch last message for each conversation
      const convsWithMessages = await Promise.all(
        (convs || []).map(async (conv) => {
          const { data: msgs } = await supabase
            .from("chat_messages")
            .select("content")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1);

          return {
            ...conv,
            lastMessage: msgs?.[0]?.content || "No messages",
          } as ChatConversation & { lastMessage?: string };
        })
      );

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
    
    const { data: msgs } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: true });

    setSelectedMessages((msgs || []) as ChatMessage[]);
  }, []);

  // Join conversation as agent
  const joinConversation = useCallback(async (conversationId: string, userId: string) => {
    try {
      await supabase
        .from("chat_conversations")
        .update({
          is_agent_connected: true,
          agent_id: userId,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId);

      // Send system message
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        sender_type: "bot",
        sender_name: "System",
        content: "You are now connected with a live agent.",
        metadata: { isSystem: true },
      });

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
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: conversationId,
          sender_type: "agent",
          sender_name: agentName || "Support Agent",
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from("chat_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      return data;
    } catch (error) {
      console.error("Error sending agent message:", error);
      throw error;
    }
  }, []);

  // Close conversation
  const closeConversation = useCallback(async (conversationId: string) => {
    try {
      await supabase
        .from("chat_conversations")
        .update({
          status: "closed",
          closed_at: new Date().toISOString(),
          is_agent_connected: false,
        })
        .eq("id", conversationId);

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
