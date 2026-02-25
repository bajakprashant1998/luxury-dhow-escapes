import { Link } from "react-router-dom";
import { memo } from "react";
import { motion } from "framer-motion";
import { Ship, Users, Anchor, Waves, PartyPopper, UtensilsCrossed, TrendingUp, ArrowUpRight } from "lucide-react";

const experienceCategories = [
  {
    icon: Ship,
    title: "Dhow Cruises",
    description: "Traditional dining experience on the water",
    link: "/tours?category=dhow-cruise",
    iconBg: "bg-blue-100/80",
    iconColor: "text-blue-600",
    guestCount: "1,200+",
    guestLabel: "guests this month",
  },
  {
    icon: Users,
    title: "Shared Yacht",
    description: "Live BBQ on the water with friends",
    link: "/tours?category=yacht-shared",
    iconBg: "bg-orange-100/80",
    iconColor: "text-orange-500",
    guestCount: "800+",
    guestLabel: "guests this month",
  },
  {
    icon: Anchor,
    title: "Private Charter",
    description: "Exclusive yacht rental for your group",
    link: "/tours?category=yacht-private",
    iconBg: "bg-emerald-100/80",
    iconColor: "text-emerald-600",
    guestCount: "350+",
    guestLabel: "groups this month",
  },
  {
    icon: Waves,
    title: "Water Sports",
    description: "Jet ski, parasailing & more thrills",
    link: "/activities",
    iconBg: "bg-cyan-100/80",
    iconColor: "text-cyan-500",
    guestCount: "600+",
    guestLabel: "guests this month",
  },
  {
    icon: PartyPopper,
    title: "Private Events",
    description: "Celebrations on the open waters",
    link: "/activities?tab=events",
    iconBg: "bg-purple-100/80",
    iconColor: "text-purple-500",
    guestCount: "200+",
    guestLabel: "events this month",
  },
  {
    icon: UtensilsCrossed,
    title: "Megayacht Dining",
    description: "Fine dining aboard luxury megayachts",
    link: "/tours?category=megayacht",
    iconBg: "bg-amber-100/80",
    iconColor: "text-amber-600",
    guestCount: "450+",
    guestLabel: "guests this month",
  },
];

const CategoryCard = memo(({ category, index }: { category: typeof experienceCategories[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        to={category.link}
        className="group flex flex-col items-center h-full bg-card rounded-2xl sm:rounded-2xl p-3 py-4 sm:p-6 border border-border/50 shadow-md hover:shadow-2xl hover:border-secondary/40 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
      >
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Icon - centered on mobile */}
        <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${category.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm mb-2 sm:mb-3`}>
          <category.icon className={`w-5 h-5 sm:w-7 sm:h-7 ${category.iconColor}`} />
        </div>

        {/* Badge */}
        <div className="relative flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full mb-2 sm:mb-3">
          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span className="text-[10px] sm:text-[11px] font-bold">{category.guestCount}</span>
        </div>

        {/* Title */}
        <h3 className="relative font-display font-extrabold text-[13px] sm:text-base text-foreground text-center leading-tight tracking-tight group-hover:text-secondary transition-colors">
          {category.title}
        </h3>

        {/* Description — hidden on small mobile */}
        <p className="relative text-[11px] sm:text-sm text-muted-foreground leading-relaxed mb-3 sm:mb-4 line-clamp-2 text-center min-h-0 sm:min-h-[2.75rem] hidden sm:block mt-1.5">
          {category.description}
        </p>

        {/* Arrow */}
        <div className="relative mt-auto pt-2 sm:pt-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-secondary/10 flex items-center justify-center sm:opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-secondary/20">
            <ArrowUpRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-secondary" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

CategoryCard.displayName = "CategoryCard";

const ExperienceCategories = memo(() => {
  return (
    <section className="py-4 sm:py-8 -mt-12 sm:-mt-20 relative z-20">
      <div className="container">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 auto-rows-fr">
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
