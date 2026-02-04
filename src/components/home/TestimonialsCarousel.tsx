import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTestimonials, useAverageRating } from "@/hooks/useTestimonials";
import { Skeleton } from "@/components/ui/skeleton";

// Platform badges for verified reviews
const PlatformBadge = ({ platform }: { platform?: string }) => {
  if (!platform) return null;

  const badges: Record<string, { bg: string; text: string; label: string }> = {
    google: { bg: "bg-blue-500/10", text: "text-blue-600", label: "Google Review" },
    tripadvisor: { bg: "bg-emerald-500/10", text: "text-emerald-600", label: "TripAdvisor" },
    verified: { bg: "bg-secondary/10", text: "text-secondary", label: "Verified Guest" },
  };

  const badge = badges[platform.toLowerCase()] || badges.verified;

  return (
    <span className={`inline-flex items-center gap-1 ${badge.bg} ${badge.text} px-2 py-0.5 rounded-full text-xs font-medium`}>
      <BadgeCheck className="w-3 h-3" />
      {badge.label}
    </span>
  );
};

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const { data: testimonials = [], isLoading } = useTestimonials(6);
  const { data: ratingData } = useAverageRating();

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection: number) => {
    if (testimonials.length === 0) return;
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let next = prevIndex + newDirection;
      if (next < 0) next = testimonials.length - 1;
      if (next >= testimonials.length) next = 0;
      return next;
    });
  }, [testimonials.length]);

  // Auto-advance carousel with pause on interaction
  useEffect(() => {
    if (testimonials.length === 0 || isPaused) return;
    
    autoPlayRef.current = setInterval(() => {
      paginate(1);
    }, 6000);
    
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [testimonials.length, isPaused, paginate]);

  // Pause on user interaction
  const handleInteraction = useCallback(() => {
    setIsPaused(true);
    // Resume after 10 seconds of no interaction
    setTimeout(() => setIsPaused(false), 10000);
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 bg-muted/30 overflow-hidden">
        <div className="container">
          <div className="text-center mb-16">
            <Skeleton className="h-6 w-32 mx-auto mb-3" />
            <Skeleton className="h-12 w-80 mx-auto mb-6" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-80 w-full rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-secondary font-semibold tracking-wider uppercase mb-3">
            Guest Reviews
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our Guests Say
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="font-bold text-lg sm:text-xl text-foreground">{ratingData?.average || 4.9}</span>
            </div>
            <span className="text-muted-foreground">• {ratingData?.count || 0}+ verified reviews</span>
          </div>
          
          {/* Platform trust badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <PlatformBadge platform="google" />
            <PlatformBadge platform="tripadvisor" />
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleInteraction}
          onTouchStart={handleInteraction}
        >
          {/* Quote Icon */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shadow-lg">
              <Quote className="w-8 h-8 text-secondary-foreground" />
            </div>
          </div>

          <div className="bg-card rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8 md:p-12 pt-12 sm:pt-16 relative overflow-hidden min-h-[280px] sm:min-h-[320px]">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragStart={handleInteraction}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="text-center relative"
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>

                {/* Title */}
                {currentTestimonial.title && (
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                    "{currentTestimonial.title}"
                  </h3>
                )}

                {/* Content */}
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                  {currentTestimonial.content}
                </p>

                {/* Author */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-xl font-bold text-secondary">
                    {currentTestimonial.name.charAt(0)}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-foreground">{currentTestimonial.name}</p>
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                      <p className="text-sm text-muted-foreground">
                        {currentTestimonial.location || currentTestimonial.date}
                      </p>
                      <PlatformBadge platform="verified" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all touch-target"
              onClick={() => {
                handleInteraction();
                paginate(-1);
              }}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleInteraction();
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`transition-all duration-300 rounded-full touch-target ${
                    index === currentIndex
                      ? "w-6 sm:w-8 h-2.5 sm:h-3 bg-secondary"
                      : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all touch-target"
              onClick={() => {
                handleInteraction();
                paginate(1);
              }}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
