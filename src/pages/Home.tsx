import Layout from "@/components/layout/Layout";
import PageMeta from "@/components/PageMeta";
import HeroSection from "@/components/home/HeroSection";
import ExperienceCategories from "@/components/home/ExperienceCategories";
import HighlightsSection from "@/components/home/HighlightsSection";
import FeaturedTours from "@/components/home/FeaturedTours";
import ActivitiesShowcase from "@/components/home/ActivitiesShowcase";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import CTASection from "@/components/home/CTASection";

const Home = () => {
  return (
    <Layout>
      <PageMeta
        title="Rental Yacht Dubai - Premium Yacht Charters & Dhow Cruises"
        description="Experience Dubai from the water with premium yacht charters, dhow cruises, and luxury marine experiences. Book your unforgettable Dubai cruise today."
        canonicalPath="/"
      />
      <HeroSection />
      <ExperienceCategories />
      <HighlightsSection />
      <FeaturedTours />
      <ActivitiesShowcase />
      <WhyChooseUs />
      <TestimonialsCarousel />
      <CTASection />
    </Layout>
  );
};

export default Home;
