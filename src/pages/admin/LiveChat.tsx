import AdminLayout from "@/components/admin/AdminLayout";
import LiveChatDashboard from "@/components/admin/chat/LiveChatDashboard";

const LiveChat = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 h-[calc(100vh-140px)]">
        <div>
          <h1 className="text-2xl font-display font-bold">Live Chat Support</h1>
          <p className="text-muted-foreground mt-1">
            Real-time customer support and conversation management
          </p>
        </div>
        <LiveChatDashboard />
      </div>
    </AdminLayout>
  );
};

export default LiveChat;
