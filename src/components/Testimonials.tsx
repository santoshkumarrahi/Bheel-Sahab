import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '../types/portfolio.ts';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
              07. Client Endorsements
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Feedback from Project Collaborators &amp; Founders
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Direct statements from executives, product leaders, and agency clients.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Testimonial Card */}
        <div className="relative rounded-3xl bg-slate-900/50 border border-white/10 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <Quote className="absolute top-8 right-8 w-24 h-24 text-white/5 pointer-events-none" />

          <div className="max-w-3xl space-y-6">
            {/* Star Rating */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: current.rating || 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-mono text-slate-400 ml-2">5.0 Verified Review</span>
            </div>

            {/* Testimonial Quote */}
            <p className="text-lg sm:text-2xl font-medium text-slate-100 leading-relaxed italic">
              "{current.content}"
            </p>

            {/* Client Info & Avatar with Guaranteed Proportions */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400/40 p-0.5 bg-slate-900 shrink-0 shadow-md">
                  <img
                    src={current.avatarUrl || '/assets/avatars/avatar_1.svg'}
                    alt={current.clientName}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-base font-bold text-white">{current.clientName}</div>
                  <div className="text-xs text-slate-400">
                    {current.clientRole} · <span className="text-amber-400 font-medium">{current.company}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Scope: <span className="text-slate-200 font-medium">{current.projectType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Preview Grid Below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => setCurrentIndex(idx)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                currentIndex === idx
                  ? 'bg-slate-900 border-amber-400/40 shadow-xl ring-1 ring-amber-400/20'
                  : 'bg-slate-900/30 border-white/5 hover:border-white/20'
              }`}
            >
              <p className="text-xs text-slate-300 line-clamp-3 italic mb-4">"{t.content}"</p>

              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0 bg-slate-900">
                  <img src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{t.clientName}</div>
                  <div className="text-[11px] text-slate-400 truncate">{t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
