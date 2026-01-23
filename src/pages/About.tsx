import { Link } from "react-router-dom";
import { Award, Users, Heart, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const About = () => {
  const stats = [
    { value: "8+", label: "Years Experience" },
    { value: "50K+", label: "Happy Guests" },
    { value: "4.8", label: "Average Rating" },
    { value: "100%", label: "Commitment" },
  ];

  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service, from the moment you book until you disembark.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Our passion for creating unforgettable experiences drives everything we do.",
    },
    {
      icon: Users,
      title: "Family Values",
      description: "We treat every guest like family, ensuring warmth and hospitality throughout your journey.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Your safety and satisfaction are our top priorities. We maintain the highest standards.",
    },
  ];

  const team = [
    { name: "Ahmed Hassan", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
    { name: "Sarah Al-Rashid", role: "Operations Director", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" },
    { name: "Mohammed Khan", role: "Guest Experience Manager", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
  ];

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
              Our Story
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              About BetterView Tourism
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Since 2015, we've been creating magical moments on the waters of Dubai Marina, 
              combining traditional Arabian hospitality with world-class service.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-display text-4xl font-bold text-secondary-foreground mb-2">
                  {stat.value}
                </p>
                <p className="text-secondary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Legacy of Excellence on Dubai's Waters
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  BetterView Tourism was born from a simple dream: to share the breathtaking beauty 
                  of Dubai Marina with visitors from around the world. What started as a single 
                  traditional dhow has grown into one of Dubai's most trusted cruise experiences.
                </p>
                <p>
                  Our founder, Ahmed Hassan, grew up on these waters. His grandfather was a pearl 
                  diver, and his father captained trading dhows across the Arabian Gulf. This deep 
                  connection to maritime tradition inspires everything we do.
                </p>
                <p>
                  Today, we combine this rich heritage with modern luxury and impeccable service. 
                  Every cruise is carefully crafted to offer an authentic experience while exceeding 
                  the expectations of our discerning guests.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600"
                alt="Traditional dhow"
                className="rounded-xl h-64 object-cover w-full"
              />
              <img
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600"
                alt="Dubai Marina"
                className="rounded-xl h-64 object-cover w-full mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-cream">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make and every experience we create
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-card p-6 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The dedicated professionals behind your unforgettable cruise experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">{member.name}</h3>
                <p className="text-secondary">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the BetterView Difference?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join thousands of satisfied guests who have discovered the magic of Dubai Marina 
              aboard our traditional dhow cruises.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/tours">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
                  Explore Our Cruises
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
