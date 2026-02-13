import { Link } from "react-router-dom";
import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Ship, Users, Anchor, Waves, PartyPopper, TrendingUp } from "lucide-react";

// Import preview images
import dhowCruiseImg from "@/assets/tours/dhow-cruise-marina.webp";
import sharedYachtImg from "@/assets/tours/yacht-bbq-experience.jpg";
import privateCharterImg from "@/assets/tours/private-yacht-55ft.webp";
const experienceCategories = [
  {
    icon: Ship,
    title: "Dhow Cruises",
    description: "Traditional dining experience",
    link: "/tours?category=dhow-cruise",
    bgClass: "bg-gradient-to-br from-blue-950 to-cyan-900",
    iconColor: "text-blue-400",
    textColor: "text-blue-50",
    mutedColor: "text-blue-200/70",
    badgeBg: "bg-blue-400/20 text-blue-300",
    previewImage: dhowCruiseImg,
    guestCount: "1,200+",
    guestLabel: "guests this month",
  },
  {
    icon: Users,
    title: "Shared Yacht",
    description: "Live BBQ on the water",
    link: "/tours?category=yacht-shared",
    bgClass: "bg-gradient-to-br from-amber-900 to-orange-950",
    iconColor: "text-amber-400",
    textColor: "text-amber-50",
    mutedColor: "text-amber-200/70",
    badgeBg: "bg-amber-400/20 text-amber-300",
    previewImage: sharedYachtImg,
    guestCount: "800+",
    guestLabel: "guests this month",
  },
  {
    icon: Anchor,
    title: "Private Charter",
    description: "Exclusive yacht rental",
    link: "/tours?category=yacht-private",
    bgClass: "bg-gradient-to-br from-emerald-950 to-teal-900",
    iconColor: "text-emerald-400",
    textColor: "text-emerald-50",
    mutedColor: "text-emerald-200/70",
    badgeBg: "bg-emerald-400/20 text-emerald-300",
    previewImage: privateCharterImg,
    guestCount: "350+",
    guestLabel: "groups this month",
  },
  {
    icon: Waves,
    title: "Water Sports",
    description: "Jet ski, parasailing & more",
    link: "/activities",
    bgClass: "bg-gradient-to-br from-sky-950 to-indigo-900",
    iconColor: "text-sky-400",
    textColor: "text-sky-50",
    mutedColor: "text-sky-200/70",
    badgeBg: "bg-sky-400/20 text-sky-300",
    previewImage: sharedYachtImg,
    guestCount: "600+",
    guestLabel: "guests this month",
  },
  {
    icon: PartyPopper,
    title: "Private Events",
    description: "Celebrations on the water",
    link: "/activities?tab=events",
    bgClass: "bg-gradient-to-br from-purple-950 to-fuchsia-900",
    iconColor: "text-purple-400",
    textColor: "text-purple-50",
    mutedColor: "text-purple-200/70",
    badgeBg: "bg-purple-400/20 text-purple-300",
    previewImage: privateCharterImg,
    guestCount: "200+",
    guestLabel: "events this month",
  },
];

const CategoryCard = memo(({ category, index }: { category: typeof experienceCategories[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={category.link}
      className={`group block ${category.bgClass} p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-white/25 relative overflow-hidden touch-target hover:-translate-y-1`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview Image on Hover (Desktop only) */}
      <div 
        className={`absolute inset-0 hidden lg:block transition-opacity duration-300 ${isHovered ? 'opacity-15' : 'opacity-0'}`}
        style={{
          backgroundImage: `url(${category.previewImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-2.5 sm:mb-4">
          <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
            <category.icon className={`w-5 sm:w-7 h-5 sm:h-7 ${category.iconColor} transition-colors`} />
          </div>
          
          {/* Guest Count Indicator */}
          <div className={`hidden sm:flex items-center gap-1 text-xs ${category.badgeBg} px-2 py-1 rounded-full`}>
            <TrendingUp className="w-3 h-3" />
            <span className="font-semibold">{category.guestCount}</span>
          </div>
        </div>

        <h3 className={`font-display font-bold text-sm sm:text-base ${category.textColor} mb-0.5 sm:mb-1 transition-colors`}>
          {category.title}
        </h3>
        <p className={`text-xs sm:text-sm ${category.mutedColor} line-clamp-1 mb-2`}>
          {category.description}
        </p>

        {/* Guest label - visible on larger screens */}
        <div className={`hidden sm:flex items-center gap-1 text-[10px] ${category.mutedColor}`}>
          <Users className="w-3 h-3" />
          <span>{category.guestCount} {category.guestLabel}</span>
        </div>
      </div>
    </Link>
  );
});

CategoryCard.displayName = "CategoryCard";

const ExperienceCategories = memo(() => {
  return (
    <section className="py-6 sm:py-8 -mt-16 sm:-mt-20 relative z-20">
      <div className="container">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, staggerChildren: 0.05 }}
        >
          {experienceCategories.map((category, index) => (
            <CategoryCard key={index} category={category} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
});

ExperienceCategories.displayName = "ExperienceCategories";

export default ExperienceCategories;
