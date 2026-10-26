import { useState, useEffect, useCallback } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { PortfolioData, Project } from './types/portfolio.ts';
import { fetchPortfolioData, authStorage } from './lib/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Services } from './components/Services.tsx';
import { Portfolio } from './components/Portfolio.tsx';
import { Skills } from './components/Skills.tsx';
import { WorkProcess } from './components/WorkProcess.tsx';
import { Experience } from './components/Experience.tsx';
import { Testimonials } from './components/Testimonials.tsx';
import { BookingSection } from './components/BookingSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { ProjectDetailModal } from './components/ProjectDetailModal.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';

export default function App() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View state: 'site' | 'admin-login' | 'admin-dashboard'
  const [view, setView] = useState<'site' | 'admin-login' | 'admin-dashboard'>('site');

  // Modals
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchPortfolioData();
      setData(res);
    } catch (err: any) {
      console.error('Failed to load portfolio bundle:', err);
      setError(err.message || 'Unable to connect to portfolio service');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Check hash for #admin routing
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin' || hash === '#admin-dashboard') {
        if (authStorage.isAuthenticated()) {
          setView('admin-dashboard');
        } else {
          setView('admin-login');
        }
      } else if (hash === '#admin-login') {
        setView('admin-login');
      } else if (hash === '#book-meeting-modal') {
        setBookingModalOpen(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [loadData]);

  const handleOpenBooking = () => {
    setBookingModalOpen(true);
  };

  const handleSelectServiceQuote = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateAdmin = () => {
    if (authStorage.isAuthenticated()) {
      setView('admin-dashboard');
      window.location.hash = '#admin';
    } else {
      setView('admin-login');
      window.location.hash = '#admin-login';
    }
  };

  const handleBackToSite = () => {
    setView('site');
    window.location.hash = '';
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#090b10] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-xl mb-4 shadow-xl">
          SB
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
          <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Loading Santosh Kumar Bheel's Studio Portfolio...</span>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-[#090b10] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm mb-4">
          {error}
        </div>
        <button
          onClick={loadData}
          className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Render Admin Login
  if (view === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setView('admin-dashboard');
          window.location.hash = '#admin';
        }}
        onBackToSite={handleBackToSite}
      />
    );
  }

  // Render Admin Dashboard
  if (view === 'admin-dashboard') {
    return (
      <AdminDashboard
        onBackToSite={handleBackToSite}
        onRefreshSiteData={loadData}
      />
    );
  }

  // Public Facing Website
  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-[#f1f5f9] relative">
      {/* Navbar */}
      <Navbar
        onOpenBooking={handleOpenBooking}
        onNavigateAdmin={handleNavigateAdmin}
        isAdminLoggedIn={authStorage.isAuthenticated()}
      />

      <main className="flex-1">
        {/* Animated Hero Section */}
        <Hero settings={data.settings} onOpenBooking={handleOpenBooking} />

        {/* About Me Section */}
        <About settings={data.settings} onOpenBooking={handleOpenBooking} />

        {/* Services Section */}
        <Services
          services={data.services}
          onSelectService={handleSelectServiceQuote}
        />

        {/* Portfolio & Case Studies Showcase */}
        <Portfolio
          projects={data.projects}
          onSelectProject={(proj) => setActiveProject(proj)}
        />

        {/* Skills & Technologies Section */}
        <Skills skills={data.skills} />

        {/* Work Process */}
        <WorkProcess steps={data.workSteps} />

        {/* Professional Experience & Education */}
        <Experience experience={data.experience} />

        {/* Testimonials Showcase */}
        <Testimonials testimonials={data.testimonials} />

        {/* Interactive Meeting Booking Section */}
        <BookingSection settings={data.settings} />

        {/* Contact Section */}
        <ContactSection
          settings={data.settings}
          preselectedService={preselectedService}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={data.settings}
        onOpenBooking={handleOpenBooking}
        onNavigateAdmin={handleNavigateAdmin}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />

      {/* Booking Modal Overlay */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl my-auto">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close booking modal"
            >
              <X className="w-6 h-6" />
            </button>
            <BookingSection
              settings={data.settings}
              isModal
              onCloseModal={() => setBookingModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
