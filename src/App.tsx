import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Critical path - load immediately
import Home from "./pages/Home";

// Lazy-loaded pages for code splitting
const Tours = lazy(() => import("./pages/Tours"));
const TourDetail = lazy(() => import("./pages/TourDetail"));
const SavedTours = lazy(() => import("./pages/SavedTours"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CancellationPolicy = lazy(() => import("./pages/CancellationPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages - lazy load entire admin section
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminBookings = lazy(() => import("./pages/admin/Bookings"));
const AdminInquiries = lazy(() => import("./pages/admin/Inquiries"));
const AdminTours = lazy(() => import("./pages/admin/Tours"));
const AdminAddTour = lazy(() => import("./pages/admin/AddTour"));
const AdminEditTour = lazy(() => import("./pages/admin/EditTour"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminGallery = lazy(() => import("./pages/admin/Gallery"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminLocations = lazy(() => import("./pages/admin/Locations"));
const AdminCategories = lazy(() => import("./pages/admin/Categories"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminDiscounts = lazy(() => import("./pages/admin/Discounts"));
const AdminUploadTourImages = lazy(() => import("./pages/admin/UploadTourImages"));
const AdminActivityLog = lazy(() => import("./pages/admin/ActivityLog"));
const AdminLegalPages = lazy(() => import("./pages/admin/LegalPages"));

// RequireSession must be loaded synchronously as it's a wrapper component
import RequireSession from "./components/admin/RequireSession";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="space-y-4 w-full max-w-md p-8">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  </div>
);

// Optimized QueryClient with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/:slug" element={<TourDetail />} />
            <Route path="/saved-tours" element={<SavedTours />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cancellation-policy" element={<CancellationPolicy />} />
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <RequireSession>
                  <AdminDashboard />
                </RequireSession>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <RequireSession>
                  <AdminBookings />
                </RequireSession>
              }
            />
            <Route
              path="/admin/inquiries"
              element={
                <RequireSession>
                  <AdminInquiries />
                </RequireSession>
              }
            />
            <Route
              path="/admin/tours"
              element={
                <RequireSession>
                  <AdminTours />
                </RequireSession>
              }
            />
            <Route
              path="/admin/tours/add"
              element={
                <RequireSession>
                  <AdminAddTour />
                </RequireSession>
              }
            />
            <Route
              path="/admin/tours/edit/:slug"
              element={
                <RequireSession>
                  <AdminEditTour />
                </RequireSession>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <RequireSession>
                  <AdminReviews />
                </RequireSession>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <RequireSession>
                  <AdminGallery />
                </RequireSession>
              }
            />
            <Route
              path="/admin/settings/*"
              element={
                <RequireSession>
                  <AdminSettings />
                </RequireSession>
              }
            />
            <Route
              path="/admin/locations"
              element={
                <RequireSession>
                  <AdminLocations />
                </RequireSession>
              }
            />
            <Route
              path="/admin/tours/categories"
              element={
                <RequireSession>
                  <AdminCategories />
                </RequireSession>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <RequireSession>
                  <AdminCustomers />
                </RequireSession>
              }
            />
            <Route
              path="/admin/discounts"
              element={
                <RequireSession>
                  <AdminDiscounts />
                </RequireSession>
              }
              />
            <Route
              path="/admin/upload-images"
              element={
                <RequireSession>
                  <AdminUploadTourImages />
                </RequireSession>
              }
            />
            <Route
              path="/admin/activity-log"
              element={
                <RequireSession>
                  <AdminActivityLog />
                </RequireSession>
              }
            />
            <Route
              path="/admin/legal-pages"
              element={
                <RequireSession>
                  <AdminLegalPages />
                </RequireSession>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
