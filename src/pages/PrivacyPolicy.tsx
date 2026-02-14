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
    icon: "FileText",
    title: "Information We Collect",
    content: [
      "Personal identification information (Name, email address, phone number)",
      "Booking and transaction details",
      "Payment information (processed securely through our payment partners)",
      "Communication preferences and correspondence",
      "Device and browser information for website optimization",
    ],
  },
  {
    icon: "Eye",
    title: "How We Use Your Information",
    content: [
      "To process and confirm your bookings",
      "To communicate with you about your reservations",
      "To send promotional offers (with your consent)",
      "To improve our services and website experience",
      "To comply with legal obligations",
    ],
  },
  {
    icon: "Lock",
    title: "Data Protection",
    content: [
      "All data is encrypted using industry-standard SSL technology",
      "Payment information is processed through PCI-compliant partners",
      "Access to personal data is restricted to authorized personnel only",
      "Regular security audits and updates are conducted",
      "Data is stored on secure servers with backup systems",
    ],
  },
  {
    icon: "Users",
    title: "Data Sharing",
    content: [
      "We do not sell your personal information to third parties",
      "Data may be shared with service providers essential to your booking",
      "Legal requirements may necessitate disclosure to authorities",
      "Partners are bound by strict confidentiality agreements",
    ],
  },
  {
    icon: "Globe",
    title: "Cookies & Tracking",
    content: [
      "We use cookies to enhance your browsing experience",
      "Analytics cookies help us understand website usage",
      "You can manage cookie preferences in your browser settings",
      "Third-party cookies may be used for marketing purposes",
    ],
  },
];

const PrivacyPolicy = () => {
  const { data: siteSettings } = useSiteSetting("site");
  const { data: privacySettings } = useSiteSetting("legal_privacy");
  
  const siteName = (siteSettings?.siteName as string) || "Rental Yacht Dubai";
  const lastUpdated = (privacySettings?.lastUpdated as string) || "January 2026";
  const contactEmail = (privacySettings?.contactEmail as string) || `privacy@${siteName.toLowerCase().replace(/\s+/g, '')}.com`;
  const heroDescription = (privacySettings?.heroDescription as string) || `Your privacy is important to us at ${siteName}. This policy outlines how we collect, use, and protect your personal information.`;
  const sections = (privacySettings?.sections as unknown as LegalSection[]) || defaultSections;

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
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl" />
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
              <Shield className="w-10 h-10 text-secondary" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              {heroDescription}
            </p>
            <p className="text-primary-foreground/60 text-sm mt-4">
              Last updated: {lastUpdated}
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

            {/* Contact Section */}
            <motion.div
              className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-2xl p-6 md:p-8"
              variants={itemVariants}
            >
              <h2 className="font-display text-xl md:text-2xl font-semibold mb-4">
                Questions About Your Privacy?
              </h2>
              <p className="text-primary-foreground/80 mb-4">
                If you have any questions about this Privacy Policy or how we handle your data, please don't hesitate to contact us.
              </p>
              <p className="text-secondary font-medium">
                Email: {contactEmail}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
