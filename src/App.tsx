import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import SavedTours from "./pages/SavedTours";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBookings from "./pages/admin/Bookings";
import AdminInquiries from "./pages/admin/Inquiries";
import AdminTours from "./pages/admin/Tours";
import AdminAddTour from "./pages/admin/AddTour";
import AdminEditTour from "./pages/admin/EditTour";
import AdminReviews from "./pages/admin/Reviews";
import AdminGallery from "./pages/admin/Gallery";
import AdminSettings from "./pages/admin/Settings";
import AdminLocations from "./pages/admin/Locations";
import AdminCategories from "./pages/admin/Categories";
import AdminCustomers from "./pages/admin/Customers";
import AdminDiscounts from "./pages/admin/Discounts";
import AdminUploadTourImages from "./pages/admin/UploadTourImages";
import NotFound from "./pages/NotFound";
import RequireSession from "./components/admin/RequireSession";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:slug" element={<TourDetail />} />
          <Route path="/saved-tours" element={<SavedTours />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
