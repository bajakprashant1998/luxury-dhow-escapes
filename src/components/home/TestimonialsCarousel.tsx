import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Quote, BadgeCheck } from "lucide-react";
import { useTestimonials, useAverageRating } from "@/hooks/useTestimonials";
import { Skeleton } from "@/components/ui/skeleton";

const PlatformBadge = ({ platform }: { platform?: string }) => {
  if (!platform) return null;
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    google: { bg: "bg-blue-500/10", text: "text-blue-600", label: "Google" },
    tripadvisor: { bg: "bg-emerald-500/10", text: "text-emerald-600", label: "TripAdvisor" },
    verified: { bg: "bg-secondary/10", text: "text-secondary", label: "Verified" },
  };
  const badge = badges[platform.toLowerCase()] || badges.verified;
  return (
    <span className={`inline-flex items-center gap-1 ${badge.bg} ${badge.text} px-2 py-0.5 rounded-full text-xs font-medium`}>
      <BadgeCheck className="w-3 h-3" />
      {badge.label}
    </span>
  );
};

interface ReviewCardProps {
  testimonial: {
    id: string;
    name: string;
    location?: string;
    rating: number;
    date: string;
    title?: string;
    content: string;
    tourName?: string;
  };
  index: number;
}

const ReviewCard = memo(({ testimonial, index }: ReviewCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative bg-card rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all duration-500 flex flex-col h-full"
  >
    {/* Quote watermark */}
    <Quote className="absolute top-4 right-4 w-8 h-8 text-secondary/10 group-hover:text-secondary/20 transition-colors" />

    {/* Stars */}
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < testimonial.rating
              ? "fill-secondary text-secondary"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>

    {/* Title */}
    {testimonial.title && (
      <h4 className="font-display font-bold text-foreground text-base mb-3 line-clamp-2">
        "{testimonial.title}"
      </h4>
    )}

    {/* Content */}
    <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-4 flex-1">
      {testimonial.content}
    </p>

    {/* Author */}
    <div className="flex items-center gap-3 pt-4 border-t border-border/50 mt-auto">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
        <span className="text-primary-foreground font-semibold text-sm">
          {testimonial.name.charAt(0)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground text-sm truncate">{testimonial.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground truncate">
            {testimonial.location || testimonial.date}
          </span>
          <PlatformBadge platform="verified" />
        </div>
      </div>
    </div>

    {/* Tour name tag */}
    {testimonial.tourName && (
      <div className="mt-3">
        <span className="text-xs text-secondary font-medium bg-secondary/10 px-2.5 py-1 rounded-full">
          {testimonial.tourName}
        </span>
      </div>
    )}
  </motion.div>
));

ReviewCard.displayName = "ReviewCard";

const TestimonialsCarousel = () => {
  const { data: testimonials = [], isLoading } = useTestimonials(6);
  const { data: ratingData } = useAverageRating();

  if (isLoading) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-14">
            <Skeleton className="h-5 w-28 mx-auto mb-3" />
            <Skeleton className="h-10 w-72 mx-auto mb-4" />
            <Skeleton className="h-5 w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-secondary font-bold tracking-widest uppercase mb-3 text-sm">
            Guest Reviews
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-5 tracking-tight">
            What Our Guests Say
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="font-bold text-lg text-foreground">
                {ratingData?.average || 4.9}
              </span>
            </div>
            <span className="text-muted-foreground">
              • {ratingData?.count || 0}+ verified reviews
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <PlatformBadge platform="google" />
            <PlatformBadge platform="tripadvisor" />
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ReviewCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
