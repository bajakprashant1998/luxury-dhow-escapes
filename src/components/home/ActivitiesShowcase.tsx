import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Waves, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TourCard from "@/components/TourCard";
import { useTours } from "@/hooks/useTours";

const ActivitiesShowcase = memo(() => {
  const { data: allTours = [], isLoading } = useTours();

  const activityTours = allTours
    .filter((t) => t.category === "water-activity" || t.category === "yacht-event")
    .filter((t) => t.featured)
    .slice(0, 4);

  // Don't render section if no activities exist yet
  if (!isLoading && activityTours.length === 0) return null;

  return (
    <section className="py-24 bg-cream">
      <div className="container">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Waves className="w-5 h-5 text-secondary" />
              <p className="text-secondary font-semibold tracking-wider uppercase">
                New Experiences
              </p>
              <PartyPopper className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Water Activities & Events
            </h2>
          </div>
          <Link to="/activities" className="mt-6 md:mt-0">
            <Button variant="outline" size="lg" className="font-semibold group">
              View All Activities
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-md">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && activityTours.length > 0 && (
          <>
            {/* Mobile: horizontal scroll */}
            <div className="lg:hidden -mx-4 px-4">
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x-mandatory scrollbar-hide">
                {activityTours.map((tour) => (
                  <div key={tour.id} className="flex-shrink-0 w-[85%] sm:w-[75%] snap-start h-full">
                    <TourCard tour={tour} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: grid */}
            <motion.div
              className="hidden lg:grid lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
            >
              {activityTours.map((tour) => (
                <div key={tour.id} className="h-full">
                  <TourCard tour={tour} />
                </div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
});

ActivitiesShowcase.displayName = "ActivitiesShowcase";

export default ActivitiesShowcase;
