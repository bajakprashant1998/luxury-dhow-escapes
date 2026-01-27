import { useEffect, useState } from "react";
import { useConversations } from "@/hooks/useConversations";
import { useAdminPresence } from "@/hooks/useAdminPresence";
import { supabase } from "@/integrations/supabase/client";
import OnlineStatusToggle from "./OnlineStatusToggle";
import ConversationList from "./ConversationList";
import AdminChatWindow from "./AdminChatWindow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LiveChatDashboard = () => {
  const {
    conversations,
    isLoading,
    selectedConversation,
    selectedMessages,
    selectConversation,
    joinConversation,
    sendAgentMessage,
    closeConversation,
    refresh,
  } = useConversations();

  const { isOnline, toggleOnline, userId } = useAdminPresence();
  const { toast } = useToast();
  const [agentName, setAgentName] = useState("Support Agent");

  // Get agent name from profile
  useEffect(() => {
    const getAgentName = async () => {
      if (!userId) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", userId)
        .maybeSingle();
      if (data?.full_name) {
        setAgentName(data.full_name);
      }
    };
    getAgentName();
  }, [userId]);

  const handleJoin = async () => {
    if (!selectedConversation || !userId) return;
    await joinConversation(selectedConversation.id, userId);
    toast({
      title: "Connected",
      description: "You are now connected to this conversation.",
    });
  };

  const handleSend = async (content: string) => {
    if (!selectedConversation) return;
    try {
      await sendAgentMessage(selectedConversation.id, content, agentName);
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const handleClose = async () => {
    if (!selectedConversation) return;
    await closeConversation(selectedConversation.id);
    toast({
      title: "Conversation closed",
      description: "The conversation has been marked as closed.",
    });
  };

  const handleExportChats = async () => {
    // Export all conversations to CSV
    const { data } = await supabase
      .from("chat_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      const headers = ["Name", "Email", "Phone", "Travel Date", "Message", "Source", "Created At"];
      const rows = data.map((lead) => [
        lead.name,
        lead.email,
        lead.phone || "",
        lead.travel_date || "",
        lead.message || "",
        lead.source,
        lead.created_at,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chat-leads-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export complete",
        description: `Exported ${data.length} leads.`,
      });
    } else {
      toast({
        title: "No data",
        description: "No leads to export.",
      });
    }
  };

  const waitingCount = conversations.filter((c) => c.status === "waiting_agent").length;

  return (
    <div className="h-full flex gap-4">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        {/* Online Status */}
        <OnlineStatusToggle isOnline={isOnline} onToggle={toggleOnline} />

        {/* Stats */}
        <Card>
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Active Chats</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={refresh} className="h-7 w-7">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleExportChats} className="h-7 w-7">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{conversations.length}</span>
                <span className="text-muted-foreground">Total</span>
              </div>
              {waitingCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-orange-500">{waitingCount}</span>
                  <span className="text-muted-foreground">Waiting</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversations List */}
        <Card className="flex-1">
          <CardHeader className="py-3 px-4 border-b border-border">
            <CardTitle className="text-sm font-semibold">Conversations</CardTitle>
          </CardHeader>
          <ConversationList
            conversations={conversations}
            isLoading={isLoading}
            selectedId={selectedConversation?.id || null}
            onSelect={selectConversation}
          />
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        {selectedConversation ? (
          <AdminChatWindow
            conversation={selectedConversation}
            messages={selectedMessages}
            onJoin={handleJoin}
            onSend={handleSend}
            onClose={handleClose}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-card rounded-lg border border-border">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select a conversation to view</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChatDashboard;
