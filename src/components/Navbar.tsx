import { useState, useEffect } from 'react';
import { Menu, X, Calendar, Lock } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onNavigateAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export function Navbar({ onOpenBooking, onNavigateAdmin, isAdminLoggedIn }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090b10]/85 backdrop-blur-md border-b border-white/8 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-Zone Top Bar Contract */}
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <a
            href="#hero"
            className="text-lg md:text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-sm">
              SB
            </span>
            <span>Santosh Kumar Bheel</span>
          </a>

          {/* Zone 2: 4–5 Clean Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              About
            </a>
            <a href="#services" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Services
            </a>
            <a href="#portfolio" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Portfolio
            </a>
            <a href="#skills" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Skills
            </a>
            <a href="#process" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Process
            </a>
            <a href="#testimonials" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Reviews
            </a>
            <a href="#contact" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Contact
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <button
              onClick={onNavigateAdmin}
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-slate-800/60"
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin'}</span>
            </button>
            <button
              onClick={onOpenBooking}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-500/20 transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a Meeting</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 rounded-md"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d111a] border-b border-white/10 px-4 pt-3 pb-5 space-y-3 shadow-2xl">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-200 hover:text-amber-400 font-medium"
          >
            About
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-200 hover:text-amber-400 font-medium"
          >
            Services
          </a>
          <a
            href="#portfolio"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-200 hover:text-amber-400 font-medium"
          >
            Portfolio
          </a>
          <a
            href="#skills"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-200 hover:text-amber-400 font-medium"
          >
            Skills
          </a>
          <a
            href="#process"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-200 hover:text-amber-400 font-medium"
          >
            Work Process
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-200 hover:text-amber-400 font-medium"
          >
            Reviews
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-200 hover:text-amber-400 font-medium"
          >
            Contact
          </a>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateAdmin();
              }}
              className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
