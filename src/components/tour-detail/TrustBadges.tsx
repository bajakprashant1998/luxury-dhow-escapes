import { memo } from "react";
import { Shield, ThumbsUp, Clock, CreditCard, Star, Award } from "lucide-react";

const TrustBadges = memo(() => {
  const badges = [
    { icon: Star, label: "Top Rated", sublabel: "4.9 Average" },
    { icon: Shield, label: "Verified Seller", sublabel: "Licensed operator" },
    { icon: ThumbsUp, label: "Best Price", sublabel: "Guarantee" },
    { icon: Clock, label: "Free Cancel", sublabel: "Up to 24h before" },
    { icon: CreditCard, label: "Secure Payment", sublabel: "SSL encrypted" },
    { icon: Award, label: "Award Winning", sublabel: "Top experience" },
  ];

  return (
    <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-6 gap-2 md:gap-3 scrollbar-hide snap-x-mandatory">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex-shrink-0 snap-start flex items-center gap-2.5 px-3.5 py-2.5 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:border-secondary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-default group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary/15 to-secondary/5 flex items-center justify-center group-hover:from-secondary/25 group-hover:to-secondary/10 transition-colors">
            <badge.icon className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-left">
            <p className="text-[11px] md:text-xs font-bold text-foreground leading-tight group-hover:text-secondary transition-colors whitespace-nowrap">
              {badge.label}
            </p>
            <p className="text-[9px] md:text-[10px] text-muted-foreground leading-tight whitespace-nowrap">
              {badge.sublabel}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
});

TrustBadges.displayName = "TrustBadges";

export default TrustBadges;
