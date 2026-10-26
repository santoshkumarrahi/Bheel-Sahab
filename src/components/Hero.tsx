import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calendar, Github, Linkedin, Mail, MessageCircle, ChevronDown, CheckCircle } from 'lucide-react';
import { SiteSettings } from '../types/portfolio.ts';

interface HeroProps {
  settings: SiteSettings;
  onOpenBooking: () => void;
}

export function Hero({ settings, onOpenBooking }: HeroProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = settings.roles || [
    'Graphic Designer',
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Specialist',
    'Full-Stack Engineer',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [roles.length]);

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Screen 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Clean unboxed editorial kicker */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-amber-400 font-medium tracking-wide uppercase mb-3">
              <span>Personal Portfolio &amp; Engineering Studio</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">Available For Hire</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4 text-balance">
              {settings.heroHeadline || 'Designing Digital Experiences. Building Powerful Websites.'}
            </h1>

            {/* Dynamic Animated Role Cycle */}
            <div className="h-10 sm:h-12 flex items-center mb-5 text-xl sm:text-2xl font-semibold text-slate-300">
              <span className="text-slate-400 mr-2 font-normal">Specializing in</span>
              <div className="relative overflow-hidden inline-block h-8 sm:h-10">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roles[roleIndex]}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -24, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block text-amber-400 font-bold"
                  >
                    {roles[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Lead Narrative */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
              {settings.heroSubtext ||
                "I'm Santosh Kumar Bheel, a graphic designer and full-stack web developer who combines creative visual design with practical development to build meaningful digital experiences for businesses and individuals."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20 transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Meeting</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#portfolio"
                className="px-6 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <span>View My Work</span>
              </a>

              <a
                href="#contact"
                className="px-4 py-3.5 text-sm font-medium text-slate-400 hover:text-amber-400 transition-colors"
              >
                Get a Custom Quote
              </a>
            </div>

            {/* Social Links & Trust Markers */}
            <div className="flex items-center gap-6 text-slate-400 text-sm pt-4 border-t border-white/8">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Connect</span>
              <div className="flex items-center gap-4">
                {settings.socialLinks?.github && (
                  <a
                    href={settings.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks?.linkedin && (
                  <a
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks?.whatsapp && (
                  <a
                    href={settings.socialLinks.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg hover:text-emerald-400 hover:bg-white/5 transition-colors"
                    aria-label="WhatsApp Contact"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks?.email && (
                  <a
                    href={settings.socialLinks.email}
                    className="p-2 rounded-lg hover:text-amber-400 hover:bg-white/5 transition-colors"
                    aria-label="Direct Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Professional Portrait Container */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Refined Framed Portrait Card */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-2xl p-2.5">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={settings.profileImage || '/assets/aistudio/Santosh_Profile_Image_814470b2.png'}
                    alt="Santosh Kumar Bheel - Graphic Designer & Full-Stack Developer"
                    className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle contrast gradient at base */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Identification Overlay on Portrait */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-base">Santosh Kumar Bheel</div>
                        <div className="text-xs text-amber-400 font-medium">Design &amp; Code Craftsman</div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Verified Pro</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI / Trust Strip in a full-width row below the hero split */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {settings.yearsExperience || '6+'}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">Years Production Experience</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {settings.completedProjects || '45+'}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">Completed Client Projects</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {settings.clientSatisfaction || '99%'}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">Client Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              Full-Stack
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">Graphic Design &amp; Web Eng</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-10">
          <a
            href="#about"
            className="text-slate-500 hover:text-slate-300 transition-colors p-2 flex flex-col items-center gap-1 text-xs"
            aria-label="Scroll to about section"
          >
            <span>Explore Experience</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
