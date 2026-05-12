import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { MobileDock } from "./components/layout/MobileDock";
import { AuthModal } from "./components/auth/AuthModal";
import { CookieConsent } from "./components/layout/CookieConsent";

// Public Pages
import { LandingPage } from "./pages/public/LandingPage";
import { ResortsPage } from "./pages/public/ResortsPage";
import { ResortDetailPage } from "./pages/public/ResortDetailPage";
import { ResortComparePage } from "./pages/public/ResortComparePage";
import { GalleryPage } from "./pages/public/GalleryPage";
import { ExperiencesPage } from "./pages/public/ExperiencesPage";
import { OurStoryPage } from "./pages/public/OurStoryPage";
import { ContactPage } from "./pages/public/ContactPage";
import { TermsOfServicePage } from "./pages/public/TermsOfServicePage";
import { PrivacyPolicyPage } from "./pages/public/PrivacyPolicyPage";
import { LocalExpertsPage } from "./pages/public/LocalExpertsPage";
import { DiscoveryPage } from "./pages/public/DiscoveryPage";
import { CookiesPage } from "./pages/public/CookiesPage";
import { NotFoundPage } from "./pages/public/NotFoundPage";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";

// Role-based Pages
import { CheckoutPage } from "./pages/traveler/CheckoutPage";
import { CheckoutSuccessPage } from "./pages/traveler/CheckoutSuccessPage";
import { BookingConfirmationPage } from "./pages/traveler/BookingConfirmationPage";
import { BookingsPage } from "./pages/traveler/BookingsPage";
import { WishlistPage } from "./pages/traveler/WishlistPage";
import { ProfilePage } from "./pages/traveler/ProfilePage";
import { NotificationsPage } from "./pages/traveler/NotificationsPage";
import { DashboardSelector } from "./components/shared/DashboardSelector";
import { ResortSetupPage } from "./pages/owner/ResortSetupPage";
import { InventoryPage } from "./pages/owner/InventoryPage";
import { ScrollToTop } from "./components/shared/ScrollToTop";

import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Layout with Navbar and Footer
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <MobileDock />
    </div>
  );
};

// Auth Layout (Minimalist footer for auth flow)
const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Main Routes (with Navbar + Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/resorts" element={<ResortsPage />} />
            <Route path="/resorts/compare" element={<ResortComparePage />} />
            <Route path="/resorts/:slug" element={<ResortDetailPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/success"
              element={
                <ProtectedRoute>
                  <CheckoutSuccessPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-confirmation"
              element={
                <ProtectedRoute>
                  <BookingConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardSelector />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
            <Route path="/dashboard/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/dashboard/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route
              path="/dashboard/resort-setup"
              element={
                <ProtectedRoute>
                  <ResortSetupPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/inventory"
              element={
                <ProtectedRoute>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/about" element={<OurStoryPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/guide" element={<LocalExpertsPage />} />
            <Route path="/discovery" element={<DiscoveryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0A1128', // Luxury Navy
            color: '#F5F1E9',      // Sand White
            borderRadius: '1.5rem',
            border: '1px solid rgba(197, 160, 89, 0.2)', // Subtle Gold border
            padding: '16px 24px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            fontFamily: 'Outfit, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#C5A059', // Gold
              secondary: '#0A1128',
            },
            style: {
              border: '1px solid #C5A059',
            }
          },
          error: {
            iconTheme: {
              primary: '#EF4444', // Red for errors
              secondary: '#FFFFFF',
            },
            style: {
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }
          }
        }}
      />
      <ScrollToTop />
      <AnimatedRoutes />
      <AuthModal />
      <CookieConsent />
    </Router>
  );
}

export default App;
