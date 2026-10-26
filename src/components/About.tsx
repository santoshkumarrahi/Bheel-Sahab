import { Download, Sparkles, Code2, Palette, ShieldCheck, MapPin, CheckCircle2, UserCheck } from 'lucide-react';
import { SiteSettings } from '../types/portfolio.ts';

interface AboutProps {
  settings: SiteSettings;
  onOpenBooking: () => void;
}

export function About({ settings, onOpenBooking }: AboutProps) {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#0b0e17] border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            01. Professional Profile
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bridging Creative Visual Design with Resilient Software Engineering
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            A comprehensive working methodology uniting visual brand identity with full-stack execution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Narrative Column */}
          <div className="lg:col-span-7 space-y-6 text-slate-300 leading-relaxed text-base">
            <p className="text-lg text-slate-200 font-medium leading-relaxed">
              {settings.bio ||
                "I am a multi-disciplinary designer and full-stack software engineer with an obsession for refined visual balance, robust systems architecture, and fluid digital experiences. From brand identities and design systems to high-concurrency Node.js microservices and pixel-precise React applications, I translate ambitious concepts into reliable, production-ready software."}
            </p>

            {/* Design & Dev Philosophy Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Design Philosophy Card */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/8 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Design Philosophy</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {settings.philosophy ||
                    "Design is not superficial decoration; it is functional clarity, intent, and respectful communication with the user. Every curve, typographic pairing, and spacing decision should serve the product's ultimate purpose."}
                </p>
              </div>

              {/* Development Approach Card */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/8 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Development Approach</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {settings.devApproach ||
                    "Strongly typed architecture, scalable component structures, zero-fluff performance, and security by design. I craft code that teams can maintain and users love to experience."}
                </p>
              </div>
            </div>

            {/* Quick Highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{settings.location || 'Karachi, PK / Remote Worldwide'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Clean Code &amp; Verified Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Pixel-Perfect Visual Craftsmanship</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={settings.resumeUrl || '#contact'}
                target="_blank"
                rel="noreferrer"
                download
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm flex items-center gap-2 transition-colors border border-white/10"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Resume (CV)</span>
              </a>

              <button
                onClick={onOpenBooking}
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm transition-colors cursor-pointer shadow-md shadow-amber-400/20"
              >
                Schedule Direct Consultation
              </button>
            </div>
          </div>

          {/* Right Column: Status & Visual Identity */}
          <div className="lg:col-span-5 space-y-6">
            {/* Status Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/20 shadow-xl">
              <div className="text-xs uppercase font-mono tracking-wider text-amber-400 mb-1">
                Current Availability Status
              </div>
              <div className="text-xl font-bold text-white mb-2">
                {settings.currentAvailability || 'Available for Selected Contracts & Projects'}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                Accepting new engagements for full-stack web builds, corporate rebrands, UI/UX overhauls, and backend API engineering.
              </p>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Response Time:</span>
                  <span className="font-semibold text-white">Within 12 Hours</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Typical Project Lead:</span>
                  <span className="font-semibold text-white">1 – 3 Weeks</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Direct Contact:</span>
                  <span className="font-semibold text-amber-400 font-mono">{settings.contactEmail}</span>
                </div>
              </div>
            </div>

            {/* Core Competencies Bento Box */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/8 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Triple Discipline Synthesis
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-400 font-bold font-mono">01.</span>
                  <span><strong>Graphic Design:</strong> Vector branding, typographic hierarchy, editorial art direction, marketing creative suites.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-400 font-bold font-mono">02.</span>
                  <span><strong>Frontend Engineering:</strong> React 19, TypeScript, Tailwind CSS, high-conversion responsive UX, smooth animations.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold font-mono">03.</span>
                  <span><strong>Backend Architecture:</strong> Node.js, Express, REST APIs, relational databases, secure authentication &amp; RBAC.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
