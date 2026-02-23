import { Link } from "react-router-dom";
import { memo } from "react";
import { motion } from "framer-motion";
import { Ship, Users, Anchor, Waves, PartyPopper, TrendingUp } from "lucide-react";

const experienceCategories = [
  {
    icon: Ship,
    title: "Dhow Cruises",
    description: "Traditional dining...",
    link: "/tours?category=dhow-cruise",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badgeBg: "bg-secondary/10",
    badgeText: "text-secondary",
    guestCount: "1,200+",
    guestLabel: "guests this month",
  },
  {
    icon: Users,
    title: "Shared Yacht",
    description: "Live BBQ on the water",
    link: "/tours?category=yacht-shared",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    badgeBg: "bg-secondary/10",
    badgeText: "text-secondary",
    guestCount: "800+",
    guestLabel: "guests this month",
  },
  {
    icon: Anchor,
    title: "Private Charter",
    description: "Exclusive yacht rental",
    link: "/tours?category=yacht-private",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badgeBg: "bg-secondary/10",
    badgeText: "text-secondary",
    guestCount: "350+",
    guestLabel: "groups this month",
  },
  {
    icon: Waves,
    title: "Water Sports",
    description: "Jet ski, parasailing &...",
    link: "/activities",
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-500",
    badgeBg: "bg-secondary/10",
    badgeText: "text-secondary",
    guestCount: "600+",
    guestLabel: "guests this month",
  },
  {
    icon: PartyPopper,
    title: "Private Events",
    description: "Celebrations on the...",
    link: "/activities?tab=events",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    badgeBg: "bg-secondary/10",
    badgeText: "text-secondary",
    guestCount: "200+",
    guestLabel: "events this month",
  },
];

const CategoryCard = memo(({ category, index }: { category: typeof experienceCategories[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link
        to={category.link}
        className="group block bg-card rounded-2xl p-5 sm:p-6 border border-border/60 shadow-sm hover:shadow-xl hover:border-secondary/30 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
      >
        {/* Top row: icon + badge */}
        <div className="flex items-start justify-between mb-4 sm:mb-5">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${category.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <category.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${category.iconColor}`} />
          </div>
          <div className={`flex items-center gap-1 ${category.badgeBg} ${category.badgeText} px-2.5 py-1 rounded-full`}>
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-bold">{category.guestCount}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-extrabold text-base sm:text-lg text-foreground mb-1 tracking-tight group-hover:text-secondary transition-colors">
          {category.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
          {category.description}
        </p>

        {/* Guest stats */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <Users className="w-3.5 h-3.5" />
          <span>{category.guestCount} {category.guestLabel}</span>
        </div>
      </Link>
    </motion.div>
  );
});

CategoryCard.displayName = "CategoryCard";

const ExperienceCategories = memo(() => {
  return (
    <section className="py-6 sm:py-8 -mt-16 sm:-mt-20 relative z-20">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {experienceCategories.map((category, index) => (
            <CategoryCard key={index} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

ExperienceCategories.displayName = "ExperienceCategories";

export default ExperienceCategories;
