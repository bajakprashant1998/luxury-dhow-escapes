import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/testimonials";

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const displayTestimonials = testimonials.slice(0, 6);

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

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let next = prevIndex + newDirection;
      if (next < 0) next = displayTestimonials.length - 1;
      if (next >= displayTestimonials.length) next = 0;
      return next;
    });
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentTestimonial = displayTestimonials[currentIndex];

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
          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-secondary text-secondary" />
              ))}
            </div>
            <span className="font-bold text-xl text-foreground">4.9</span>
            <span className="text-muted-foreground">• 3,245+ reviews</span>
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shadow-lg">
              <Quote className="w-8 h-8 text-secondary-foreground" />
            </div>
          </div>

          <div className="bg-card rounded-3xl shadow-xl p-8 md:p-12 pt-16 relative overflow-hidden min-h-[320px]">
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
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                  "{currentTestimonial.title}"
                </h3>

                {/* Content */}
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                  {currentTestimonial.content}
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-xl font-bold text-secondary">
                    {currentTestimonial.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{currentTestimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{currentTestimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            {/* Dots */}
            <div className="flex items-center gap-2">
              {displayTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex 
                      ? "w-8 h-3 bg-secondary" 
                      : "w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all"
              onClick={() => paginate(1)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
