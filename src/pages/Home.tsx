import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import ExperienceCategories from "@/components/home/ExperienceCategories";
import HighlightsSection from "@/components/home/HighlightsSection";
import FeaturedTours from "@/components/home/FeaturedTours";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import CTASection from "@/components/home/CTASection";

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <ExperienceCategories />
      <HighlightsSection />
      <FeaturedTours />
      <WhyChooseUs />
      <TestimonialsCarousel />
      <CTASection />
    </Layout>
  );
};

export default Home;
