import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mapDbTourToTour } from "@/lib/tourMapper";
import TourCard from "@/components/TourCard";

const MAX_RECENT = 4;
const STORAGE_KEY = "recently-viewed-tours";

export function trackRecentlyViewed(tourId: string) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
    const updated = [tourId, ...stored.filter((id) => id !== tourId)].slice(0, MAX_RECENT + 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

interface Props {
  currentTourId: string;
}

const RecentlyViewedTours = ({ currentTourId }: Props) => {
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    const ids = (JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[])
      .filter((id) => id !== currentTourId)
      .slice(0, MAX_RECENT);

    if (ids.length === 0) return;

    supabase
      .from("tours")
      .select("*")
      .in("id", ids)
      .eq("status", "active")
      .then(({ data }) => {
        if (data) {
          // Maintain order from localStorage
          const mapped = data.map(mapDbTourToTour);
          const ordered = ids.map((id) => mapped.find((t) => t.id === id)).filter(Boolean);
          setTours(ordered);
        }
      });
  }, [currentTourId]);

  if (tours.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-6">
          Recently Viewed
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedTours;
