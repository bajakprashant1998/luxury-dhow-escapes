import Layout from "@/components/layout/Layout";
import PageMeta from "@/components/PageMeta";
import HeroSection from "@/components/home/HeroSection";
import ExperienceCategories from "@/components/home/ExperienceCategories";
import FeaturedTours from "@/components/home/FeaturedTours";
import TourSearchBox from "@/components/home/TourSearchBox";
import HighlightsSection from "@/components/home/HighlightsSection";
import HowItWorks from "@/components/home/HowItWorks";
import ActivitiesShowcase from "@/components/home/ActivitiesShowcase";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import HomeFAQ from "@/components/home/HomeFAQ";
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
      <TourSearchBox variant="hero" />
      <FeaturedTours />
      <ActivitiesShowcase />
      <HighlightsSection />
      <HowItWorks />
      <WhyChooseUs />
      <TestimonialsCarousel />
      <HomeFAQ />
      <CTASection />
    </Layout>
  );
};

export default Home;
