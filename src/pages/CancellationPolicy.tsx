import { motion } from "framer-motion";
import { XCircle, Calendar, RefreshCw, CloudRain, AlertCircle, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useSiteSetting } from "@/hooks/useSiteSettings";

const CancellationPolicy = () => {
  const { data: siteSettings } = useSiteSetting("site");
  const siteName = (siteSettings?.siteName as string) || "Rental Yacht Dubai";

  const refundTiers = [
    {
      timeframe: "48+ hours before",
      refund: "100%",
      description: "Full refund",
      color: "bg-green-500",
    },
    {
      timeframe: "24-48 hours before",
      refund: "50%",
      description: "Half refund",
      color: "bg-yellow-500",
    },
    {
      timeframe: "Less than 24 hours",
      refund: "0%",
      description: "No refund",
      color: "bg-red-500",
    },
  ];

  const sections = [
    {
      icon: Calendar,
      title: "Standard Cancellation",
      content: [
        "Cancellations must be submitted in writing via email or through your booking account.",
        "The cancellation date is determined by when we receive your request.",
        "Refunds will be processed within 7-10 business days.",
        "Refunds will be issued to the original payment method.",
      ],
    },
    {
      icon: RefreshCw,
      title: "Rescheduling Policy",
      content: [
        "Free rescheduling is available up to 24 hours before your booking.",
        "Rescheduled bookings are subject to availability.",
        "Each booking can be rescheduled a maximum of two times.",
        "Rescheduled bookings must be used within 6 months of original date.",
      ],
    },
    {
      icon: CloudRain,
      title: "Weather-Related Cancellations",
      content: [
        "If we cancel due to unsafe weather conditions, you will receive a full refund or free rescheduling.",
        "Weather decisions are made by our experienced captains for your safety.",
        "Light rain or overcast skies generally do not qualify for weather cancellations.",
        "We will notify you at least 2 hours before departure if weather cancellation is necessary.",
      ],
    },
    {
      icon: AlertCircle,
      title: "No-Show Policy",
      content: [
        "Failure to arrive at the departure point results in a full charge.",
        "No refund will be provided for no-shows.",
        "Please arrive 15 minutes before your scheduled departure time.",
        "Contact us immediately if you're running late—we may be able to accommodate.",
      ],
    },
    {
      icon: CheckCircle,
      title: "Special Circumstances",
      content: [
        "Medical emergencies with documentation may qualify for special consideration.",
        "Flight cancellations with proof may be eligible for full refund.",
        "Group bookings may have different cancellation terms.",
        "Holiday and peak season bookings may have stricter policies.",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary/20 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <XCircle className="w-10 h-10 text-secondary" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Cancellation Policy
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              We understand plans change. Here's everything you need to know about cancellations and refunds at {siteName}.
            </p>
            <p className="text-primary-foreground/60 text-sm mt-4">
              Last updated: January 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Refund Tiers Section */}
      <section className="py-12 bg-cream">
        <div className="container">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
              Refund Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {refundTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full ${tier.color} flex items-center justify-center`}
                  >
                    <span className="text-2xl font-bold text-white">
                      {tier.refund}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {tier.timeframe}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {tier.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div
            className="max-w-4xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
                variants={itemVariants}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-3">
                      {section.content.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Contact Section */}
            <motion.div
              className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-2xl p-6 md:p-8"
              variants={itemVariants}
            >
              <h2 className="font-display text-xl md:text-2xl font-semibold mb-4">
                Need to Cancel or Reschedule?
              </h2>
              <p className="text-primary-foreground/80 mb-4">
                Contact our customer service team as soon as possible. We're here to help make the process smooth and hassle-free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <p className="text-secondary font-medium">
                  Email: bookings@{siteName.toLowerCase().replace(/\s+/g, '')}.com
                </p>
                <span className="hidden sm:block text-primary-foreground/40">|</span>
                <p className="text-secondary font-medium">
                  Phone: +971 4 XXX XXXX
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default CancellationPolicy;
