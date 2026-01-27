import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getVisitorId, getCurrentPage, ChatConversation, ChatMessage } from "@/lib/chatUtils";
import { useToast } from "@/hooks/use-toast";
import { withTimeout } from "@/lib/withTimeout";

export function useChat() {
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isAgentOnline, setIsAgentOnline] = useState(false);
  const { toast } = useToast();

  const visitorId = getVisitorId();

  // Check if any admin is online
  const checkAdminPresence = useCallback(async () => {
    try {
      const { data } = await withTimeout(
        supabase
          .from("admin_presence")
          .select("*")
          .eq("is_online", true)
          .limit(1),
        5000,
        "Failed to check admin presence"
      );
      setIsAgentOnline((data && data.length > 0) || false);
    } catch (error) {
      console.error("Error checking admin presence:", error);
      setIsAgentOnline(false);
    }
  }, []);

  // Initialize or resume conversation
  const initConversation = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check for existing active conversation
      const { data: existing } = await withTimeout(
        supabase
          .from("chat_conversations")
          .select("*")
          .eq("visitor_id", visitorId)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1),
        5000,
        "Failed to check existing conversation"
      );

      if (existing && existing.length > 0) {
        setConversation(existing[0] as ChatConversation);
        
        // Load messages
        const { data: msgs } = await withTimeout(
          supabase
            .from("chat_messages")
            .select("*")
            .eq("conversation_id", existing[0].id)
            .order("created_at", { ascending: true }),
          5000,
          "Failed to load messages"
        );
        
        setMessages((msgs || []) as ChatMessage[]);
      } else {
        // Create new conversation
        const { data: newConv, error } = await withTimeout(
          supabase
            .from("chat_conversations")
            .insert({
              visitor_id: visitorId,
              current_page: getCurrentPage(),
            })
            .select()
            .single(),
          5000,
          "Failed to create conversation"
        );

        if (error) throw error;
        setConversation(newConv as ChatConversation);
        
        // Add welcome message
        const welcomeMessage = {
          conversation_id: newConv.id,
          sender_type: "bot" as const,
          sender_name: "Luxury Dhow Escapes",
          content: "Welcome to Luxury Dhow Escapes! 🛥️ How can we help you today?",
          metadata: { isWelcome: true },
        };
        
        const { data: welcomeMsg } = await withTimeout(
          supabase
            .from("chat_messages")
            .insert(welcomeMessage)
            .select()
            .single(),
          5000,
          "Failed to send welcome message"
        );
        
        if (welcomeMsg) {
          setMessages([welcomeMsg as ChatMessage]);
        }
      }
    } catch (error) {
      console.error("Error initializing conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [visitorId, toast]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!conversation || !content.trim()) return;

    const visitorMessage = {
      conversation_id: conversation.id,
      sender_type: "visitor" as const,
      sender_name: conversation.visitor_name || "You",
      content: content.trim(),
    };

    // Optimistically add visitor message
    const tempId = crypto.randomUUID();
    const optimisticMessage: ChatMessage = {
      ...visitorMessage,
      id: tempId,
      metadata: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      // Insert visitor message
      const { data: savedMsg, error: msgError } = await withTimeout(
        supabase
          .from("chat_messages")
          .insert(visitorMessage)
          .select()
          .single(),
        5000,
        "Failed to send message"
      );

      if (msgError) throw msgError;

      // Update optimistic message with real data
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? (savedMsg as ChatMessage) : m))
      );

      // Update conversation page (fire and forget with timeout)
      withTimeout(
        supabase
          .from("chat_conversations")
          .update({ current_page: getCurrentPage(), updated_at: new Date().toISOString() })
          .eq("id", conversation.id),
        5000
      ).catch(console.error);

      // If agent is connected, don't call bot
      if (conversation.is_agent_connected) return;

      // Get bot response
      setIsBotTyping(true);
      
      const response = await supabase.functions.invoke("chat-bot", {
        body: { 
          message: content,
          conversationId: conversation.id,
          visitorId,
          messages: [...messages, savedMsg].slice(-10), // Last 10 messages for context
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Bot error");
      }

      // Bot response is inserted by edge function, realtime will pick it up
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBotTyping(false);
    }
  }, [conversation, messages, visitorId, toast]);

  // Update visitor details
  const updateVisitorDetails = useCallback(async (details: {
    name?: string;
    email?: string;
    phone?: string;
    travel_date?: string;
  }) => {
    if (!conversation) return;

    try {
      const { error } = await withTimeout(
        supabase
          .from("chat_conversations")
          .update({
            visitor_name: details.name,
            visitor_email: details.email,
            visitor_phone: details.phone,
            travel_date: details.travel_date,
            updated_at: new Date().toISOString(),
          })
          .eq("id", conversation.id),
        5000,
        "Failed to update visitor details"
      );

      if (error) throw error;

      setConversation((prev) => prev ? { ...prev, ...details } : null);

      // Create lead
      if (details.email) {
        await withTimeout(
          supabase.from("chat_leads").insert({
            conversation_id: conversation.id,
            name: details.name || "",
            email: details.email,
            phone: details.phone,
            travel_date: details.travel_date,
          }),
          5000,
          "Failed to create lead"
        );
      }

      toast({
        title: "Details saved",
        description: "Thank you! Our team will contact you soon.",
      });
    } catch (error) {
      console.error("Error updating visitor details:", error);
    }
  }, [conversation, toast]);

  // Request human agent
  const requestAgent = useCallback(async () => {
    if (!conversation) return;

    try {
      await withTimeout(
        supabase
          .from("chat_conversations")
          .update({ status: "waiting_agent", updated_at: new Date().toISOString() })
          .eq("id", conversation.id),
        5000,
        "Failed to request agent"
      );

      // Add system message
      await withTimeout(
        supabase.from("chat_messages").insert({
          conversation_id: conversation.id,
          sender_type: "bot",
          sender_name: "System",
          content: "Please wait, connecting you to our support team…",
          metadata: { isSystem: true },
        }),
        5000,
        "Failed to add system message"
      );

      setConversation((prev) => prev ? { ...prev, status: "waiting_agent" } : null);

      // Notify admins via email (fire and forget)
      supabase.functions.invoke("notify-agent-request", {
        body: {
          conversationId: conversation.id,
          visitorName: conversation.visitor_name,
          visitorEmail: conversation.visitor_email,
          currentPage: getCurrentPage(),
        },
      }).catch((err) => console.error("Failed to notify admins:", err));
    } catch (error) {
      console.error("Error requesting agent:", error);
    }
  }, [conversation]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!conversation) return;

    const messagesChannel = supabase
      .channel(`chat_messages_${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          // Avoid duplicates (from optimistic updates)
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage];
          });
          setIsBotTyping(false);
        }
      )
      .subscribe();

    const conversationChannel = supabase
      .channel(`chat_conversation_${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_conversations",
          filter: `id=eq.${conversation.id}`,
        },
        (payload) => {
          setConversation(payload.new as ChatConversation);
        }
      )
      .subscribe();

    return () => {
      messagesChannel.unsubscribe();
      conversationChannel.unsubscribe();
    };
  }, [conversation?.id]);

  // Check admin presence on mount
  useEffect(() => {
    checkAdminPresence();
    const interval = setInterval(checkAdminPresence, 30000);
    return () => clearInterval(interval);
  }, [checkAdminPresence]);

  return {
    conversation,
    messages,
    isLoading,
    isBotTyping,
    isAgentOnline,
    initConversation,
    sendMessage,
    updateVisitorDetails,
    requestAgent,
  };
}
