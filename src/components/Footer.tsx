import { Github, Linkedin, MessageCircle, Mail, ArrowUp, Lock } from 'lucide-react';
import { SiteSettings } from '../types/portfolio.ts';

interface FooterProps {
  settings: SiteSettings;
  onOpenBooking: () => void;
  onNavigateAdmin: () => void;
}

export function Footer({ settings, onOpenBooking, onNavigateAdmin }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07090e] border-t border-white/8 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-extrabold text-sm">
                SB
              </span>
              <span className="text-base font-bold text-white tracking-tight">
                Santosh Kumar Bheel
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Graphic Designer, Frontend Developer, and Backend Developer crafting refined brand identities, responsive user interfaces, and robust server architectures.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings.socialLinks?.github && (
                <a
                  href={settings.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.whatsapp && (
                <a
                  href={settings.socialLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-emerald-400 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.email && (
                <a
                  href={settings.socialLinks.email}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Sections</div>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  About Santosh
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Services &amp; Pricing
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-amber-400 transition-colors">
                  Portfolio Works
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-amber-400 transition-colors">
                  Skills &amp; Technologies
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-amber-400 transition-colors">
                  Methodology &amp; Delivery
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-amber-400 transition-colors">
                  Client Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Actions & Booking */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Engagement</div>
            <p className="text-xs text-slate-400">
              Ready to start your next creative or software project? Book an introductory consultation or request a custom proposal.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Schedule Direct Video Call
              </button>
              <a
                href="#contact"
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-colors text-center border border-white/5"
              >
                Request Custom Quote
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} Santosh Kumar Bheel. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onNavigateAdmin}
              className="text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Dashboard</span>
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
