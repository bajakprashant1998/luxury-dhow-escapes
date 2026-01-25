import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TourCard from "@/components/TourCard";
import { useFeaturedTours } from "@/hooks/useTours";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeaturedTours = () => {
  const { data: featuredTours = [], isLoading } = useFeaturedTours();

  return (
    <section className="py-24">
      <div className="container">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-secondary font-semibold tracking-wider uppercase mb-3">
              Popular Experiences
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Featured Tours
            </h2>
          </div>
          <Link to="/tours" className="mt-6 md:mt-0">
            <Button variant="outline" size="lg" className="font-semibold group">
              View All Tours
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-md">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-4 pt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tours Grid - Horizontal scroll on mobile */}
        {!isLoading && featuredTours.length > 0 && (
          <>
            {/* Mobile: Horizontal scroll carousel */}
            <div className="lg:hidden -mx-4 px-4">
              <motion.div 
                className="flex overflow-x-auto gap-4 pb-4 snap-x-mandatory scrollbar-hide"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {featuredTours.slice(0, 4).map((tour, index) => (
                  <motion.div 
                    key={tour.id} 
                    className="flex-shrink-0 w-[85%] sm:w-[75%] snap-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TourCard tour={tour} />
                  </motion.div>
                ))}
              </motion.div>
              {/* Scroll indicator */}
              <div className="flex justify-center gap-1.5 mt-2">
                {featuredTours.slice(0, 4).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${index === 0 ? 'bg-secondary w-4' : 'bg-muted-foreground/30'}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Desktop: Grid layout */}
            <motion.div 
              className="hidden lg:grid lg:grid-cols-2 gap-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
            >
              {featuredTours.slice(0, 4).map((tour) => (
                <motion.div key={tour.id} variants={item}>
                  <TourCard tour={tour} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && featuredTours.length === 0 && (
          <motion.div 
            className="text-center py-16 bg-muted/30 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground mb-4">No featured tours available at the moment.</p>
            <Link to="/tours">
              <Button>Browse All Tours</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTours;
