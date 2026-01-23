import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface RequireSessionProps {
  children: ReactNode;
}

/**
 * Ensures the user is signed in before entering admin routes.
 * If not signed in, redirects to /auth with a redirect back to the original URL.
 */
export default function RequireSession({ children }: RequireSessionProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error) throw error;

        if (!data.session) {
          const returnTo = `${location.pathname}${location.search}`;
          navigate(`/auth?redirect=${encodeURIComponent(returnTo)}`, { replace: true });
          return;
        }
      } catch (e) {
        const returnTo = `${location.pathname}${location.search}`;
        navigate(`/auth?redirect=${encodeURIComponent(returnTo)}`, { replace: true });
        return;
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
