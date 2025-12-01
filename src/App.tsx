import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WebsiteMetaTags } from "@/hooks/useWebsiteSettings";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProfileCreate from "./pages/ProfileCreate";
import ProfileSync from "./pages/ProfileSync";
import CoverLetterEditor from "./pages/CoverLetterEditor";
import Checkout from "./pages/Checkout";
import CheckoutComplete from "./pages/CheckoutComplete";
import NotFound from "./pages/NotFound";
import AppLauncher from "./pages/AppLauncher";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Disclaimer from "./pages/Disclaimer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WebsiteMetaTags />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/complete" element={<CheckoutComplete />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <AppLauncher />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile-create" 
            element={
              <ProtectedRoute>
                <ProfileCreate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile-sync" 
            element={
              <ProtectedRoute>
                <ProfileSync />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cover-letters" 
            element={
              <ProtectedRoute>
                <CoverLetterEditor />
              </ProtectedRoute>
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
