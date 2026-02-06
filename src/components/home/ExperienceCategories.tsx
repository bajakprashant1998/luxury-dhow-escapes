import { Link } from "react-router-dom";
import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Ship, Users, Anchor, Crown, TrendingUp } from "lucide-react";

// Import preview images
import dhowCruiseImg from "@/assets/tours/dhow-cruise-marina.webp";
import sharedYachtImg from "@/assets/tours/yacht-bbq-experience.jpg";
import privateCharterImg from "@/assets/tours/private-yacht-55ft.webp";
import megayachtImg from "@/assets/tours/megayacht-burj-khalifa.webp";

const experienceCategories = [
  {
    icon: Ship,
    title: "Dhow Cruises",
    description: "Traditional dining experience",
    link: "/tours?category=dhow-cruise",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
    previewImage: dhowCruiseImg,
    guestCount: "1,200+",
    guestLabel: "guests this month",
  },
  {
    icon: Users,
    title: "Shared Yacht",
    description: "Live BBQ on the water",
    link: "/tours?category=yacht-shared",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-500",
    previewImage: sharedYachtImg,
    guestCount: "800+",
    guestLabel: "guests this month",
  },
  {
    icon: Anchor,
    title: "Private Charter",
    description: "Exclusive yacht rental",
    link: "/tours?category=yacht-private",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
    previewImage: privateCharterImg,
    guestCount: "350+",
    guestLabel: "groups this month",
  },
  {
    icon: Crown,
    title: "Megayacht",
    description: "Premium luxury cruise",
    link: "/tours?category=megayacht",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
    previewImage: megayachtImg,
    guestCount: "500+",
    guestLabel: "guests this month",
  },
];

const CategoryCard = memo(({ category, index }: { category: typeof experienceCategories[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={category.link}
      className="group block bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-secondary/30 relative overflow-hidden touch-target hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Preview Image on Hover (Desktop only) */}
      <div 
        className={`absolute inset-0 hidden lg:block transition-opacity duration-300 ${isHovered ? 'opacity-20' : 'opacity-0'}`}
        style={{
          backgroundImage: `url(${category.previewImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-2.5 sm:mb-4">
          <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-lg sm:rounded-xl bg-muted/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary/20 transition-all duration-300">
            <category.icon className={`w-5 sm:w-7 h-5 sm:h-7 ${category.iconColor} group-hover:text-secondary transition-colors`} />
          </div>
          
          {/* Guest Count Indicator */}
          <div className="hidden sm:flex items-center gap-1 text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span className="font-semibold">{category.guestCount}</span>
          </div>
        </div>

        <h3 className="font-display font-bold text-sm sm:text-base text-foreground mb-0.5 sm:mb-1 group-hover:text-secondary transition-colors">
          {category.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mb-2">
          {category.description}
        </p>

        {/* Guest label - visible on larger screens */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
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
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4"
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
