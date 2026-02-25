import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import TourForm from "@/components/admin/TourForm";
import { ArrowLeft, Loader2, FileText, DollarSign, Star, List, Search, Settings, Image, Sparkles, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type Tour = Tables<"tours">;

const steps = [
  { id: "basic", label: "Basic Info", icon: FileText, description: "Title, slug & descriptions" },
  { id: "pricing", label: "Pricing", icon: DollarSign, description: "Price, category & location" },
  { id: "content", label: "Content", icon: Star, description: "Highlights, included & excluded" },
  { id: "itinerary", label: "Itinerary & FAQ", icon: List, description: "Schedule & questions" },
  { id: "booking", label: "Booking", icon: Settings, description: "Features & options" },
  { id: "seo", label: "SEO", icon: Search, description: "Meta tags & keywords" },
  { id: "media", label: "Media", icon: Image, description: "Images & gallery" },
];

const EditTour = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState("basic");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const fetchTour = async () => {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from("tours")
          .select("*")
          .eq("slug", slug)
          .single();
        if (error) throw error;
        setTour(data);
      } catch (err: any) {
        console.error("Error fetching tour:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [slug]);

  // Observe which section is in view
  useEffect(() => {
    if (loading || !tour) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const id = entry.target.id.replace("section-", "");
            setActiveStep(id);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
    );

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
  }, [loading, tour]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveStep(id);
    }
  };

  const activeIndex = steps.findIndex((s) => s.id === activeStep);
  const progress = ((activeIndex + 1) / steps.length) * 100;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !tour) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive">Tour not found</p>
          <Button asChild>
            <Link to="/admin/tours">Back to Tours</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

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
                  Edit Tour
                </h1>
                <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  <Pencil className="w-3 h-3" />
                  Editing
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{tour.title}</p>
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
        <TourForm tour={tour} mode="edit" />
      </div>
    </AdminLayout>
  );
};

export default EditTour;
