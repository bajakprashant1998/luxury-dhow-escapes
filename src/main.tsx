import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Web Vitals reporting for performance monitoring
const reportWebVitals = async () => {
  if (typeof window !== "undefined" && "performance" in window) {
    try {
      // Use Performance Observer API for Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Log to console in development
          if (import.meta.env.DEV) {
            console.log(`[Web Vitals] ${entry.name}:`, entry);
          }

          // Send to Google Analytics if available
          if (typeof window.gtag === "function") {
            const metric = entry as PerformanceEntry & { value?: number };
            window.gtag("event", entry.name, {
              event_category: "Web Vitals",
              event_label: entry.entryType,
              value: Math.round(metric.value || entry.duration || 0),
              non_interaction: true,
            });
          }
        }
      });

      // Observe LCP, FID, CLS, FCP, TTFB
      observer.observe({ type: "largest-contentful-paint", buffered: true });
      observer.observe({ type: "first-input", buffered: true });
      observer.observe({ type: "layout-shift", buffered: true });
      observer.observe({ type: "paint", buffered: true });
      observer.observe({ type: "navigation", buffered: true });
    } catch (e) {
      // PerformanceObserver not fully supported
      console.debug("[Web Vitals] Performance monitoring not available");
    }
  }
};

// Initialize app
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Report Web Vitals after initial render
if (typeof requestIdleCallback === "function") {
  requestIdleCallback(() => reportWebVitals());
} else {
  setTimeout(reportWebVitals, 100);
}

// Add gtag type declaration
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
