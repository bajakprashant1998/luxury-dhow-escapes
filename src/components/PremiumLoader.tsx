import { useEffect, useState } from "react";

const LOADER_DURATION = 3200;
const SESSION_KEY = "loader_shown";

const PremiumLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"playing" | "fading">("playing");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("fading"), LOADER_DURATION);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "fading") {
      const exit = setTimeout(onComplete, 900);
      return () => clearTimeout(exit);
    }
  }, [phase, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-800 ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden
      style={{ background: "linear-gradient(170deg, hsl(220 55% 8%) 0%, hsl(220 50% 14%) 40%, hsl(210 45% 22%) 100%)" }}
    >
      {/* Stars / particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animation: `starTwinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Moon glow */}
      <div
        className="absolute w-32 h-32 rounded-full"
        style={{
          top: "12%",
          right: "18%",
          background: "radial-gradient(circle, hsl(45 60% 85% / 0.15) 0%, transparent 70%)",
          animation: "moonPulse 4s ease-in-out infinite",
        }}
      />

      {/* Ocean waves at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%]">
        {/* Wave 1 */}
        <svg
          className="absolute bottom-0 w-[200%] h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ animation: "waveMove1 6s ease-in-out infinite" }}
        >
          <path
            d="M0,224 C180,180 360,280 540,224 C720,168 900,280 1080,224 C1260,168 1440,280 1440,224 L1440,320 L0,320 Z"
            fill="hsl(210 60% 18% / 0.6)"
          />
        </svg>
        {/* Wave 2 */}
        <svg
          className="absolute bottom-0 w-[200%] h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ animation: "waveMove2 5s ease-in-out infinite" }}
        >
          <path
            d="M0,256 C240,200 480,300 720,256 C960,212 1200,300 1440,256 L1440,320 L0,320 Z"
            fill="hsl(210 55% 14% / 0.8)"
          />
        </svg>
        {/* Wave 3 - darkest */}
        <svg
          className="absolute bottom-0 w-[200%] h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ animation: "waveMove3 7s ease-in-out infinite" }}
        >
          <path
            d="M0,288 C180,250 360,310 540,288 C720,266 900,310 1080,288 C1260,266 1440,310 1440,288 L1440,320 L0,320 Z"
            fill="hsl(220 55% 8%)"
          />
        </svg>
      </div>

      {/* Floating Yacht */}
      <div
        className="absolute"
        style={{
          bottom: "28%",
          left: "50%",
          transform: "translateX(-50%)",
          animation: "yachtFloat 3s ease-in-out infinite, yachtSlideIn 1.5s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <svg
          width="180"
          height="80"
          viewBox="0 0 180 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_4px_20px_rgba(212,168,83,0.3)]"
        >
          {/* Hull */}
          <path
            d="M20,55 Q30,70 90,70 Q150,70 160,55 L155,50 Q140,60 90,60 Q40,60 25,50 Z"
            fill="hsl(45 60% 65%)"
            opacity="0.9"
          />
          {/* Hull line */}
          <path
            d="M30,57 Q90,67 150,57"
            stroke="hsl(45 50% 50%)"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          {/* Deck */}
          <path
            d="M35,50 L50,35 L130,35 L145,50 Q120,55 90,55 Q60,55 35,50 Z"
            fill="hsl(220 30% 95%)"
            opacity="0.95"
          />
          {/* Cabin */}
          <rect x="60" y="28" width="50" height="10" rx="2" fill="hsl(220 30% 90%)" opacity="0.9" />
          {/* Windows */}
          {[68, 78, 88, 98].map((x) => (
            <rect key={x} x={x} y="31" width="4" height="4" rx="0.5" fill="hsl(45 60% 75%)" opacity="0.8" />
          ))}
          {/* Mast */}
          <line x1="80" y1="28" x2="80" y2="8" stroke="hsl(220 20% 80%)" strokeWidth="1.5" />
          {/* Flag */}
          <path d="M80,8 L95,13 L80,18 Z" fill="hsl(45 60% 65%)" opacity="0.8" />
          {/* Antenna */}
          <line x1="105" y1="28" x2="108" y2="15" stroke="hsl(220 20% 75%)" strokeWidth="0.8" />
          {/* Bow detail */}
          <path d="M155,50 L165,45 L160,55 Z" fill="hsl(45 55% 60%)" opacity="0.7" />
          {/* Water reflection */}
          <ellipse cx="90" cy="73" rx="50" ry="3" fill="hsl(45 60% 65%)" opacity="0.15" />
        </svg>
      </div>

      {/* Text content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center mt-[-8%]">
        {/* Gold compass decoration */}
        <div
          className="w-10 h-10 rounded-full border border-secondary/40 flex items-center justify-center"
          style={{ animation: "compassSpin 8s linear infinite, loaderFadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.3s both" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-secondary/80" />
          <div className="absolute w-6 h-px bg-secondary/30" />
          <div className="absolute w-px h-6 bg-secondary/30" />
        </div>

        {/* Headline */}
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.12em] uppercase"
          style={{
            color: "hsl(45 60% 70%)",
            textShadow: "0 0 40px hsl(45 60% 65% / 0.3)",
            animation: "loaderFadeUp 1.2s cubic-bezier(0.22,1,0.36,1) 0.5s both",
          }}
        >
          Sail Beyond Luxury
        </h1>

        {/* Subtitle */}
        <p
          className="text-sm sm:text-base tracking-[0.25em] uppercase font-light"
          style={{
            color: "hsl(45 30% 80% / 0.7)",
            animation: "loaderFadeUp 1.2s cubic-bezier(0.22,1,0.36,1) 0.8s both",
          }}
        >
          Your Dubai Voyage Awaits
        </p>

        {/* Progress bar */}
        <div
          className="w-44 sm:w-56 h-[2px] rounded-full overflow-hidden mt-3"
          style={{
            background: "hsl(220 30% 30% / 0.5)",
            animation: "loaderFadeUp 1s cubic-bezier(0.22,1,0.36,1) 1s both",
          }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, hsl(45 60% 65%), hsl(45 70% 75%))",
              animation: `loaderProgress ${LOADER_DURATION}ms cubic-bezier(0.4,0,0.2,1) forwards`,
            }}
          />
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes loaderFadeUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes loaderProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes yachtFloat {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(-1deg); }
          50% { transform: translateX(-50%) translateY(-8px) rotate(1deg); }
        }
        @keyframes yachtSlideIn {
          0% { opacity: 0; transform: translateX(-30%) translateY(20px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes waveMove1 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-15%); }
        }
        @keyframes waveMove2 {
          0%, 100% { transform: translateX(-5%); }
          50% { transform: translateX(-20%); }
        }
        @keyframes waveMove3 {
          0%, 100% { transform: translateX(-3%); }
          50% { transform: translateX(-12%); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes moonPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes compassSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/**
 * Wrapper that shows the loader once per session.
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
