import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface NewsletterFormProps {
  variant?: "footer" | "standalone";
}

const NewsletterForm = memo(({ variant = "footer" }: NewsletterFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - in production, integrate with your email service
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail("");
    toast.success("Thanks for subscribing! Check your inbox for exclusive offers.");

    // Reset success state after animation
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const isFooter = variant === "footer";

  return (
    <div className={isFooter ? "" : "bg-card rounded-2xl p-6 shadow-lg"}>
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
            >
              <CheckCircle2 className={`w-12 h-12 mb-3 ${isFooter ? "text-secondary" : "text-emerald-500"}`} />
            </motion.div>
            <p className={`font-semibold ${isFooter ? "text-primary-foreground" : "text-foreground"}`}>
              You're subscribed!
            </p>
            <p className={`text-sm ${isFooter ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              Check your inbox for exclusive offers
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            {!isFooter && (
              <div className="mb-4">
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                  Get Exclusive Offers
                </h3>
                <p className="text-sm text-muted-foreground">
                  Subscribe for special deals and updates
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className={`flex-1 ${
                  isFooter
                    ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary"
                    : ""
                }`}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`${
                  isFooter
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                } min-w-[44px]`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            <p className={`text-[10px] ${isFooter ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
});

NewsletterForm.displayName = "NewsletterForm";

export default NewsletterForm;
