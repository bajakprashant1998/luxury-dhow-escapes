import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { withTimeout } from "@/lib/withTimeout";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (cancelled) return;

        if (event === "SIGNED_OUT") {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          navigate("/auth");
          return;
        }

        if (session?.user) {
          setUser(session.user);
          await checkAdminRole(session.user.id);
        }
      },
    );

    const init = async () => {
      setLoading(true);
      try {
        const { data, error } = await withTimeout(
          supabase.auth.getSession(),
          8000,
          "Auth check timed out",
        );
        if (cancelled) return;
        if (error) throw error;

        const session = data.session;
        if (!session) {
          setIsAdmin(false);
          setLoading(false);
          navigate("/auth");
          return;
        }

        setUser(session.user);
        await checkAdminRole(session.user.id);
      } catch (err) {
        console.error("Error checking auth:", err);
        if (!cancelled) {
          setIsAdmin(false);
          setLoading(false);
          navigate("/auth");
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await withTimeout(
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle(),
        8000,
        "Role check timed out",
      );

      if (error) throw error;

      if (data) {
        setIsAdmin(true);
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      toast({
        title: "Admin check failed",
        description: "Couldn't verify admin access. Please refresh and try again.",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <AdminTopBar
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
