import { Link } from "react-router-dom";
import { ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import TourCard from "@/components/TourCard";
import { tours } from "@/data/tours";

const Tours = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920"
            alt="Dubai Marina"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <p className="text-secondary font-semibold tracking-wider uppercase mb-4">
              Explore Our Experiences
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Dhow Cruise Packages
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Choose from our selection of carefully curated cruise experiences. 
              From intimate lower deck dining to exclusive private charters, 
              find the perfect voyage for your Dubai adventure.
            </p>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16">
        <div className="container">
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{tours.length}</span> available cruises
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Sort by: <span className="font-medium text-foreground">Most Popular</span></span>
            </div>
          </div>

          {/* Tours */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Requests */}
      <section className="py-16 bg-cream">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Looking for Something Special?
            </h2>
            <p className="text-muted-foreground mb-8">
              Whether it's a surprise proposal, corporate event, or custom celebration, 
              we can create a tailored experience just for you. Contact us to discuss your requirements.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
                Request Custom Package
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Tours;
