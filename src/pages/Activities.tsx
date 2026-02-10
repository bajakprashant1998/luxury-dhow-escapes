import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Waves, PartyPopper, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/layout/Layout";
import TourCard from "@/components/TourCard";
import PageMeta from "@/components/PageMeta";
import { useTours } from "@/hooks/useTours";

const tabs = [
  { id: "water-activity", label: "Water Activities", icon: Waves, description: "Thrilling water sports and marine adventures" },
  { id: "yacht-event", label: "Events & Experiences", icon: PartyPopper, description: "Celebration packages and yacht events" },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const } },
};

const Activities = () => {
  const [activeTab, setActiveTab] = useState<string>("water-activity");
  const { data: allTours = [], isLoading } = useTours();

  const filteredTours = allTours.filter((t) => t.category === activeTab);
  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <Layout>
      <PageMeta
        title="Water Activities & Events - Rental Yacht Dubai"
        description="Discover thrilling water activities and luxury yacht events in Dubai. Jet ski, parasailing, birthday parties, weddings, and more."
        canonicalPath="/activities"
      />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary z-10" />
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920"
            alt="Water Activities Dubai"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="container relative z-20">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-5 h-5 text-secondary" />
              <p className="text-secondary font-semibold tracking-wider uppercase">
                Adventures & Celebrations
              </p>
            </motion.div>
            <motion.h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Water Activities & Events
            </motion.h1>
            <motion.p
              className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              From adrenaline-pumping water sports to luxurious yacht celebrations,
              discover the perfect experience for your Dubai adventure.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-6 sm:py-8 bg-cream border-b border-border">
        <div className="container">
          <div className="flex gap-3 justify-center">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 sm:px-8 py-3 rounded-full font-medium transition-all text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card text-foreground hover:bg-muted border border-border"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-primary-foreground/20" : "bg-muted"
                }`}>
                  {allTours.filter((t) => t.category === tab.id).length}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-8 sm:py-12">
        <div className="container px-4 sm:px-6">
          {/* Tab Description */}
          <AnimatePresence mode="wait">
            {activeTabData && (
              <motion.div
                key={activeTab}
                className="mb-8 p-6 bg-gradient-to-r from-cream to-cream/50 rounded-xl border border-border/50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{activeTabData.label}</span> — {activeTabData.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden shadow-md">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between pt-4 border-t border-border">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cards Grid */}
          {!isLoading && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredTours.map((tour) => (
                  <motion.div key={tour.id} variants={itemVariants} layout>
                    <TourCard tour={tour} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!isLoading && filteredTours.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No listings found in this category yet.</p>
              <Link to="/contact">
                <Button>Contact Us for Custom Packages</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Need a Custom Package?
            </h2>
            <p className="text-muted-foreground mb-8">
              We can combine water activities with yacht events for the ultimate Dubai experience.
              Contact us to create your perfect package.
            </p>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold group"
              >
                Request Custom Package
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Activities;
