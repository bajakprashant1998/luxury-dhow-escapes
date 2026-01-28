import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import MobileBottomNav from "./MobileBottomNav";
import CommandPalette from "./CommandPalette";

import {
  ADMIN_CACHE_KEY,
  ADMIN_USER_KEY,
  getAdminCache,
  setAdminCache,
  clearAdminCache,
} from "@/lib/adminAuth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminGateError, setAdminGateError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  // Track if admin has been verified to prevent re-checking on token refresh
  const adminVerifiedRef = useRef(false);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const checkAdminRole = async (userId: string, background: boolean = false) => {
      if (!background) {
        setLoading(true);
      }
      setAdminGateError(null);

      // Create a timeout promise that doesn't throw but returns a special flag
      const timeoutPromise = new Promise<{ timeout: true }>((resolve) => {
        setTimeout(() => resolve({ timeout: true }), 8000);
      });

      const queryPromise = supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle(); // Use maybeSingle for better 0/1 row handling

      try {
        const result = await Promise.race([queryPromise, timeoutPromise]);

        if ("timeout" in result) {
          throw new Error("Connection timed out");
        }

        const { data, error } = result;

        if (error) throw error;

        const hasAdminRole = !!data;

        if (hasAdminRole) {
          setIsAdmin(true);
          adminVerifiedRef.current = true;
          setAdminCache(userId);
        } else {
          setIsAdmin(false);
          adminVerifiedRef.current = false;
          clearAdminCache();
          setAdminGateError("You don't have admin privileges.");
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
        clearAdminCache();

        const errorMessage = (error as Error).message === "Connection timed out"
          ? "Connection timed out. Please check your internet connection."
          : (error as any)?.message || "Unknown error";

        setAdminGateError(
          `We couldn't verify admin access. Error: ${errorMessage}. Please retry.`
        );
        toast({
          title: "Admin verification failed",
          description: "Please refresh and try again.",
          variant: "destructive",
        });
      } finally {
        if (!background) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (cancelled) return;

        if (event === "SIGNED_OUT") {
          adminVerifiedRef.current = false;
          clearAdminCache();
          setUser(null);
          setIsAdmin(false);
          setAdminGateError(null);
          setLoading(false);
          navigate("/auth");
          return;
        }

        if (session?.user) {
          setUser(session.user);

          // Skip role check if already verified and just a token refresh
          if (adminVerifiedRef.current && event === "TOKEN_REFRESHED") {
            return;
          }

          // Only verify on meaningful auth events
          if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
            // Check in background if we think we are already verified (e.g. from cache or previous run)
            // But usually these events mean we should check. 
            // If it's INITIAL_SESSION, we might already be checking in init().
            // If it's SIGNED_IN (e.g. from another tab), we want to verify but not necessarily show spinner if we are already admin.
            const isBackground = adminVerifiedRef.current;
            await checkAdminRole(session.user.id, isBackground);
          }
        }
      },
    );

    const init = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error) throw error;

        const session = data.session;
        if (!session) {
          setIsAdmin(false);
          clearAdminCache();
          setAdminGateError(null);
          setLoading(false);
          navigate("/auth");
          return;
        }

        setUser(session.user);
        console.log("DEBUG: Session User", session.user, "App Metadata:", session.user.app_metadata);

        // Check sessionStorage cache first for instant load
        const cache = getAdminCache();
        if (cache && cache.userId === session.user.id && cache.verified) {
          setIsAdmin(true);
          adminVerifiedRef.current = true;
          setLoading(false);
          // Still verify in background for security
          checkAdminRole(session.user.id, true);
          return;
        }

        await checkAdminRole(session.user.id);
      } catch (err) {
        console.error("Error checking auth:", err);
        if (!cancelled) {
          setIsAdmin(false);
          clearAdminCache();
          setAdminGateError("Couldn't verify your session. Please sign in again.");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4 animate-fade-in">
          <div className="space-y-1">
            <h1 className="font-display text-xl font-bold text-foreground">
              Admin access
            </h1>
            <p className="text-sm text-muted-foreground">
              {adminGateError ?? "Admin access is required to view this page."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Button variant="secondary" onClick={() => navigate("/auth")}>
              Sign in
            </Button>
            <Button onClick={() => navigate("/")}>Go home</Button>
          </div>
        </div>
      </div>
    );
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
          onSearchClick={() => setCommandOpen(true)}
          user={user}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onMenuClick={() => setSidebarOpen(true)} />

      {/* Command Palette */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
};

export default AdminLayout;
