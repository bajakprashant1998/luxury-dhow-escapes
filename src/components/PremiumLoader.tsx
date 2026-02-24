import { useEffect, useState, useRef } from "react";
import loaderVideo from "@/assets/loader-yacht.mp4";

const LOADER_DURATION = 3000; // 3 seconds
const SESSION_KEY = "loader_shown";

const PremiumLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"playing" | "fading">("playing");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setPhase("fading"), LOADER_DURATION);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "fading") {
      const exit = setTimeout(onComplete, 800); // match CSS transition
      return () => clearTimeout(exit);
    }
  }, [phase, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-primary transition-opacity duration-700 ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden
    >
      {/* Video background */}
      <video
        ref={videoRef}
        src={loaderVideo}
        autoPlay
        muted
        playsInline
        loop={false}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        {/* Decorative line */}
        <div
          className="w-12 h-px bg-secondary origin-left"
          style={{
            animation: "loaderLineIn 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s both",
          }}
        />

        {/* Headline */}
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.08em] uppercase"
          style={{
            color: "hsl(var(--secondary))",
            animation: "loaderTextIn 1.4s cubic-bezier(0.22,1,0.36,1) 0.5s both",
          }}
        >
          Sail Beyond Luxury
        </h1>

        {/* Subtitle */}
        <p
          className="text-primary-foreground/70 text-sm sm:text-base tracking-[0.2em] uppercase font-light"
          style={{
            animation: "loaderTextIn 1.4s cubic-bezier(0.22,1,0.36,1) 0.8s both",
          }}
        >
          Your journey begins
        </p>

        {/* Progress bar */}
        <div className="w-40 sm:w-56 h-[2px] bg-primary-foreground/10 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-secondary rounded-full"
            style={{
              animation: `loaderProgress ${LOADER_DURATION}ms cubic-bezier(0.4,0,0.2,1) forwards`,
            }}
          />
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes loaderTextIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes loaderLineIn {
          0% { opacity: 0; transform: scaleX(0); }
          100% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes loaderProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

/**
 * Wrapper that shows the loader once per session.
 * Returns `true` when loader is done / already shown.
 */
export const useLoaderGate = () => {
  const [ready, setReady] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  const markDone = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    setReady(true);
  };

  return { ready, markDone };
};

export default PremiumLoader;
