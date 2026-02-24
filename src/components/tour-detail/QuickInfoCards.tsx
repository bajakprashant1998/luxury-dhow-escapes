import { memo } from "react";
import { Clock, Users, Globe, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface QuickInfoCardsProps {
  duration: string;
  capacity?: string;
}

const QuickInfoCards = memo(({ duration, capacity }: QuickInfoCardsProps) => {
  const infoItems = [
    { icon: Clock, label: "Duration", value: duration, color: "from-blue-500/15 to-cyan-500/15" },
    { icon: Users, label: "Group Size", value: capacity || "Max 12 guests", color: "from-purple-500/15 to-pink-500/15" },
    { icon: Globe, label: "Language", value: "English, Arabic", color: "from-emerald-500/15 to-teal-500/15" },
    { icon: Calendar, label: "Availability", value: "Daily", color: "from-orange-500/15 to-amber-500/15" },
    { icon: MapPin, label: "Meeting Point", value: "Dubai Marina", color: "from-rose-500/15 to-red-500/15" },
  ];

  return (
    <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-5 gap-2.5 scrollbar-hide snap-x-mandatory">
      {infoItems.map((item, index) => (
        <motion.div
          key={index}
          className="flex-shrink-0 snap-start w-[130px] md:w-auto flex flex-col items-center p-3.5 md:p-4 bg-card rounded-xl border border-border/50 shadow-sm text-center hover:shadow-lg hover:border-secondary/30 hover:-translate-y-1 transition-all duration-200 cursor-default group relative overflow-hidden"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06, duration: 0.4 }}
        >
          {/* Gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

          <div className="relative w-10 md:w-11 h-10 md:h-11 rounded-xl bg-gradient-to-br from-secondary/15 to-secondary/5 flex items-center justify-center mb-2.5 group-hover:from-secondary/25 group-hover:to-secondary/10 transition-colors">
            <item.icon className="w-5 md:w-5 h-5 md:h-5 text-secondary" />
          </div>
          <p className="relative text-[10px] md:text-[11px] text-muted-foreground mb-0.5 uppercase tracking-wider font-medium">
            {item.label}
          </p>
          <p className="relative text-xs md:text-sm font-bold text-foreground">{item.value}</p>
        </motion.div>
      ))}
    </div>
  );
});

QuickInfoCards.displayName = "QuickInfoCards";

export default QuickInfoCards;
