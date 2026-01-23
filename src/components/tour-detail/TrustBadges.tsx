import { Shield, Award, CreditCard, Clock, ThumbsUp, Star } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: Star,
      label: "Top Rated",
      sublabel: "4.9 Average",
    },
    {
      icon: Shield,
      label: "Verified Seller",
      sublabel: "Licensed operator",
    },
    {
      icon: ThumbsUp,
      label: "Best Price",
      sublabel: "Guarantee",
    },
    {
      icon: Clock,
      label: "Free Cancel",
      sublabel: "Up to 24h before",
    },
    {
      icon: CreditCard,
      label: "Secure Payment",
      sublabel: "SSL encrypted",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-4">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border/50 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
            <badge.icon className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-foreground leading-tight">{badge.label}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{badge.sublabel}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
