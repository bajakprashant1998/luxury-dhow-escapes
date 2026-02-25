import { useState, useRef, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import TourForm from "@/components/admin/TourForm";
import { ArrowLeft, FileText, DollarSign, Star, List, Search, Settings, Image, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  { id: "basic", label: "Basic Info", icon: FileText, description: "Title, slug & descriptions" },
  { id: "pricing", label: "Pricing", icon: DollarSign, description: "Price, category & location" },
  { id: "content", label: "Content", icon: Star, description: "Highlights, included & excluded" },
  { id: "itinerary", label: "Itinerary & FAQ", icon: List, description: "Schedule & questions" },
  { id: "booking", label: "Booking", icon: Settings, description: "Features & options" },
  { id: "seo", label: "SEO", icon: Search, description: "Meta tags & keywords" },
  { id: "media", label: "Media", icon: Image, description: "Images & gallery" },
];

const AddTour = () => {
  const [activeStep, setActiveStep] = useState("basic");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Observe which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveStep(entry.target.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
    );

    // Observe all section elements
    const timer = setTimeout(() => {
      steps.forEach((step) => {
        const el = document.getElementById(`section-${step.id}`);
        if (el) {
          sectionRefs.current[step.id] = el;
          observer.observe(el);
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveStep(id);
    }
  };

  const activeIndex = steps.findIndex((s) => s.id === activeStep);
  const progress = ((activeIndex + 1) / steps.length) * 100;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="rounded-xl border-border/60 hover:bg-muted/50">
              <Link to="/admin/tours">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                  Add New Tour
                </h1>
                <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  Draft
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Fill in the details below to create a new tour listing
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Step Navigation */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 -mx-4 px-4 sm:-mx-6 sm:px-6 py-3">
          {/* Progress bar */}
          <div className="h-1 bg-muted rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step pills */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {steps.map((step, i) => {
              const isActive = step.id === activeStep;
              const isPast = i < activeIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => scrollToSection(step.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0",
                    isActive
                      ? "bg-secondary text-secondary-foreground shadow-sm"
                      : isPast
                        ? "bg-secondary/10 text-secondary hover:bg-secondary/20"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <step.icon className="w-3.5 h-3.5" />
                  {step.label}
                  {isPast && (
                    <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <TourForm mode="create" />
      </div>
    </AdminLayout>
  );
};

export default AddTour;
