import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import PageMeta from "@/components/PageMeta";
import HeroSection from "@/components/home/HeroSection";
import ExperienceCategories from "@/components/home/ExperienceCategories";
import FeaturedTours from "@/components/home/FeaturedTours";

// Lazy-load below-fold sections for better LCP/TTI
const HighlightsSection = lazy(() => import("@/components/home/HighlightsSection"));
const HowItWorks = lazy(() => import("@/components/home/HowItWorks"));
const ActivitiesShowcase = lazy(() => import("@/components/home/ActivitiesShowcase"));
const WhyChooseUs = lazy(() => import("@/components/home/WhyChooseUs"));
const TestimonialsCarousel = lazy(() => import("@/components/home/TestimonialsCarousel"));
const HomeFAQ = lazy(() => import("@/components/home/HomeFAQ"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Lightweight fallback to prevent layout shift
const SectionFallback = () => <div className="h-48 bg-muted/10 animate-pulse" />;

const Home = () => {
  return (
    <Layout>
      <PageMeta
        title="Rental Yacht Dubai - Premium Yacht Charters & Dhow Cruises"
        description="Experience Dubai from the water with premium yacht charters, dhow cruises, and luxury marine experiences. Book your unforgettable Dubai cruise today."
        canonicalPath="/"
      />
      {/* Above-fold: eager */}
      <HeroSection />
      <ExperienceCategories />
      <FeaturedTours />

      {/* Below-fold: lazy loaded */}
      <Suspense fallback={<SectionFallback />}>
        <ActivitiesShowcase />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HighlightsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsCarousel />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HomeFAQ />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CTASection />
      </Suspense>
    </Layout>
  );
};

export default Home;
