import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, Users, Globe, FileCheck, AlertTriangle, CreditCard, Clock, Anchor, Scale, Calendar, RefreshCw, CloudRain, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import { LucideIcon } from "lucide-react";

interface LegalSection {
  icon: string;
  title: string;
  content: string[];
}

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Eye,
  Lock,
  Users,
  Globe,
  Shield,
  Scale,
  FileCheck,
  AlertTriangle,
  CreditCard,
  Clock,
  Anchor,
  Calendar,
  RefreshCw,
  CloudRain,
  AlertCircle,
  CheckCircle,
  XCircle,
};

const defaultSections: LegalSection[] = [
  {
    icon: "FileCheck",
    title: "Acceptance of Terms",
    content: [
      "By accessing and using our services, you agree to be bound by these Terms of Service.",
      "These terms apply to all visitors, users, and customers of our services.",
      "If you disagree with any part of these terms, you may not use our services.",
      "We reserve the right to update these terms at any time with notice.",
    ],
  },
  {
    icon: "Anchor",
    title: "Booking & Reservations",
    content: [
      "All bookings are subject to availability and confirmation.",
      "Accurate personal information must be provided during booking.",
      "Booking confirmation will be sent via email within 24 hours.",
      "Group bookings may require additional verification.",
      "Special requests are subject to availability and cannot be guaranteed.",
    ],
  },
  {
    icon: "CreditCard",
    title: "Payment Terms",
    content: [
      "Full payment is required at the time of booking unless otherwise specified.",
      "We accept major credit cards, debit cards, and bank transfers.",
      "Prices are quoted in AED and include applicable taxes.",
      "Additional services requested on board will be charged separately.",
      "Payment information is processed securely through our payment partners.",
    ],
  },
  {
    icon: "Clock",
    title: "Service Delivery",
    content: [
      "Guests should arrive at the departure point 15 minutes before scheduled time.",
      "Late arrivals may result in reduced cruise time without refund.",
      "The captain reserves the right to modify routes due to weather or safety concerns.",
      "All cruises are subject to weather conditions; alternative dates will be offered if cancelled.",
    ],
  },
  {
    icon: "AlertTriangle",
    title: "Guest Responsibilities",
    content: [
      "Guests must follow all safety instructions provided by the crew.",
      "Consumption of outside alcohol may be subject to corkage fees.",
      "Guests are responsible for any damage caused to the vessel or equipment.",
      "Inappropriate behavior may result in immediate termination of the cruise.",
      "Children must be supervised by adults at all times.",
    ],
  },
  {
    icon: "Scale",
    title: "Liability & Insurance",
    content: [
      "We maintain comprehensive marine insurance for all vessels.",
      "Personal belongings are the responsibility of guests.",
      "We are not liable for injuries resulting from guest negligence.",
      "Force majeure events are beyond our control and liability.",
      "Medical conditions should be disclosed at the time of booking.",
    ],
  },
];

const TermsOfService = () => {
  const { data: siteSettings } = useSiteSetting("site");
  const { data: termsSettings } = useSiteSetting("legal_terms");
  
  const siteName = (siteSettings?.siteName as string) || "Rental Yacht Dubai";
  const lastUpdated = (termsSettings?.lastUpdated as string) || "January 2026";
  const contactEmail = (termsSettings?.contactEmail as string) || `legal@${siteName.toLowerCase().replace(/\s+/g, '')}.com`;
  const heroDescription = (termsSettings?.heroDescription as string) || `Please read these terms carefully before using ${siteName}'s services. By booking with us, you agree to these terms.`;
  const sections = (termsSettings?.sections as unknown as LegalSection[]) || defaultSections;

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
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl" />
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
              <Scale className="w-10 h-10 text-secondary" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              {heroDescription}
            </p>
            <p className="text-primary-foreground/60 text-sm mt-4">
              Effective Date: {lastUpdated}
            </p>
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
            {sections.map((section, index) => {
              const IconComponent = iconMap[section.icon] || FileText;
              return (
                <motion.div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-secondary" />
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
              );
            })}

            {/* Agreement Notice */}
            <motion.div
              className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-2xl p-6 md:p-8"
              variants={itemVariants}
            >
              <h2 className="font-display text-xl md:text-2xl font-semibold mb-4">
                Agreement
              </h2>
              <p className="text-primary-foreground/80 mb-4">
                By proceeding with your booking, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
              <p className="text-secondary font-medium">
                For questions: {contactEmail}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsOfService;
