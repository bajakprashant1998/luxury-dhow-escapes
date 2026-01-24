import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Ship, Users, Anchor, Crown } from "lucide-react";

const experienceCategories = [
  { 
    icon: Ship, 
    title: "Dhow Cruises", 
    description: "Traditional dining experience",
    link: "/tours?category=dhow-cruise",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500"
  },
  { 
    icon: Users, 
    title: "Shared Yacht", 
    description: "Live BBQ on the water",
    link: "/tours?category=yacht-shared",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-500"
  },
  { 
    icon: Anchor, 
    title: "Private Charter", 
    description: "Exclusive yacht rental",
    link: "/tours?category=yacht-private",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500"
  },
  { 
    icon: Crown, 
    title: "Megayacht", 
    description: "Premium luxury cruise",
    link: "/tours?category=megayacht",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500"
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

const ExperienceCategories = () => {
  return (
    <section className="py-8 -mt-20 relative z-20">
      <div className="container">
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {experienceCategories.map((category, index) => (
            <motion.div key={index} variants={item}>
              <Link
                to={category.link}
                className="group block bg-card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-secondary/30 relative overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-secondary/20 transition-all duration-300">
                    <category.icon className={`w-7 h-7 ${category.iconColor} group-hover:text-secondary transition-colors`} />
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-1 group-hover:text-secondary transition-colors">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceCategories;
