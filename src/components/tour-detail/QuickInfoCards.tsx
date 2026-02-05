import { memo } from "react";
import { Clock, Users, Globe, Calendar, MapPin } from "lucide-react";

interface QuickInfoCardsProps {
  duration: string;
  capacity?: string;
}

const QuickInfoCards = memo(({ duration, capacity }: QuickInfoCardsProps) => {
  const infoItems = [
    {
      icon: Clock,
      label: "Duration",
      value: duration,
      gradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: Users,
      label: "Group Size",
      value: capacity || "Max 12 guests",
      gradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      icon: Globe,
      label: "Language",
      value: "English, Arabic",
      gradient: "from-emerald-500/10 to-teal-500/10",
    },
    {
      icon: Calendar,
      label: "Availability",
      value: "Daily",
      gradient: "from-orange-500/10 to-amber-500/10",
    },
    {
      icon: MapPin,
      label: "Meeting Point",
      value: "Dubai Marina",
      gradient: "from-rose-500/10 to-red-500/10",
    },
  ];

  return (
    <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-5 gap-3 scrollbar-hide snap-x-mandatory">
      {infoItems.map((infoItem, index) => (
        <div
          key={index}
          className="flex-shrink-0 snap-start w-[140px] md:w-auto flex flex-col items-center p-3 md:p-4 bg-card rounded-xl border border-border/50 shadow-sm text-center hover:shadow-lg hover:border-secondary/30 hover:-translate-y-1 transition-all duration-200 cursor-default group relative overflow-hidden touch-target"
        >
          {/* Gradient Background on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${infoItem.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          
          <div className="relative w-10 md:w-12 h-10 md:h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-2 md:mb-3 group-hover:bg-secondary/20 transition-colors">
            <infoItem.icon className="w-5 md:w-6 h-5 md:h-6 text-secondary" />
          </div>
          <p className="relative text-[10px] md:text-xs text-muted-foreground mb-0.5 md:mb-1">{infoItem.label}</p>
          <p className="relative text-xs md:text-sm font-semibold text-foreground">{infoItem.value}</p>
        </div>
      ))}
    </div>
  );
});

QuickInfoCards.displayName = "QuickInfoCards";

export default QuickInfoCards;
