import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import InstallPWA from "@/components/InstallPWA";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Gallery from "./pages/Gallery";
import Consultancy from "./pages/Consultancy";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminConsultations from "./pages/admin/Consultations";
import AdminMessages from "./pages/admin/Messages";
import AdminPortfolio from "./pages/admin/Portfolio";
import AdminGallery from "./pages/admin/Gallery";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminServices from "./pages/admin/Services";
import AdminTeam from "./pages/admin/Team";
import AdminProjects from "./pages/admin/Projects";
import AdminProposals from "./pages/admin/Proposals";
import AdminUsers from "./pages/admin/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/consultancy" element={<Consultancy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/consultations" element={<AdminConsultations />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/portfolio" element={<AdminPortfolio />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/team" element={<AdminTeam />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/proposals" element={<AdminProposals />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <InstallPWA />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
