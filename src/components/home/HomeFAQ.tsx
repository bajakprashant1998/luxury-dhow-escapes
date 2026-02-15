import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HelpCircle, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "What is included in the dhow cruise dinner?",
    answer: "Our dhow cruise dinner includes a premium international buffet, welcome drinks, soft beverages, live Tanura dance performance, background music, and a 2-hour cruise along Dubai Marina or Creek. Some packages also include canal views and photography.",
  },
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 24-48 hours in advance, especially during peak season (October–April). However, we do accept same-day bookings subject to availability. Instant confirmation is provided for all online bookings.",
  },
  {
    question: "What is the cancellation policy?",
    answer: "Free cancellation is available up to 24 hours before the experience. Cancellations within 24 hours may be subject to charges. Full details are available on each tour's booking page and our cancellation policy page.",
  },
  {
    question: "Are private yacht charters available for events?",
    answer: "Yes! We offer private yacht charters for birthdays, corporate events, weddings, anniversaries, and more. Our fleet ranges from 33ft to 100ft+ yachts with customizable packages including catering, decorations, and entertainment.",
  },
  {
    question: "Is transportation provided to the marina?",
    answer: "We offer multiple options: shared transfers, private vehicle transfers, or you can come directly to the boat. Choosing 'Direct To Boat' saves you money with a per-person discount. Pickup points are available across Dubai.",
  },
  {
    question: "Are children allowed on cruises?",
    answer: "Absolutely! Children of all ages are welcome on our dhow cruises and yacht experiences. Children under 4 typically ride free, and kids aged 4-11 get discounted rates. Life jackets are available for all ages.",
  },
];

const HomeFAQ = memo(() => {
  return (
    <section className="py-20 sm:py-28">
      <div className="container">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left: Header */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="lg:sticky lg:top-32">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                <HelpCircle className="w-7 h-7 text-secondary" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Everything you need to know before booking your Dubai cruise experience.
              </p>
              <Link to="/contact">
                <Button variant="outline" className="font-semibold group">
                  Still have questions?
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Accordion */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card border border-border rounded-xl px-5 sm:px-6 data-[state=open]:border-secondary/30 data-[state=open]:shadow-md transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-display font-semibold text-foreground text-sm sm:text-base hover:no-underline py-4 sm:py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

HomeFAQ.displayName = "HomeFAQ";

export default HomeFAQ;
