import { Star } from "lucide-react";
import { Testimonial } from "@/data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-lg">
              {testimonial.name.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">{testimonial.location}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
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
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h5 className="font-display font-semibold text-foreground">
          "{testimonial.title}"
        </h5>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {testimonial.content}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-secondary font-medium">{testimonial.tourName}</span>
        <span className="text-xs text-muted-foreground">{testimonial.date}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;
