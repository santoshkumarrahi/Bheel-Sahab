import { Briefcase, GraduationCap } from 'lucide-react';
import { ExperienceItem } from '../types/portfolio.ts';

interface ExperienceProps {
  experience: ExperienceItem[];
}

export function Experience({ experience }: ExperienceProps) {
  const workItems = experience.filter((e) => e.type === 'experience');
  const educationItems = experience.filter((e) => e.type === 'education' || e.type === 'certification');

  return (
    <section id="experience" className="py-20 md:py-28 bg-[#0b0e17] border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            06. Background &amp; Credentials
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Professional Experience &amp; Academic Foundation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            A history of designing brands and building scalable software applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Work Experience */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 text-base font-bold text-white pb-3 border-b border-white/10">
              <Briefcase className="w-5 h-5 text-amber-400" />
              <span>Career History</span>
            </div>

            <div className="space-y-8 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {workItems.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Node */}
                  <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-amber-400 group-hover:scale-125 transition-transform shadow-sm" />

                  <div className="text-xs font-mono text-amber-400 mb-1 font-semibold">{item.period}</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight">
                    {item.role}
                  </h3>
                  <div className="text-xs text-slate-400 mb-2 font-medium">{item.company}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    {item.skills.map((s, i) => (
                      <span key={i} className="flex items-center gap-1.5">
                        <span className="text-slate-300 font-mono">{s}</span>
                        {i < item.skills.length - 1 && <span className="text-slate-600">·</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 text-base font-bold text-white pb-3 border-b border-white/10">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <span>Education &amp; Specializations</span>
            </div>

            <div className="space-y-8 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {educationItems.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-blue-400 group-hover:scale-125 transition-transform shadow-sm" />

                  <div className="text-xs font-mono text-blue-400 mb-1 font-semibold">{item.period}</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors tracking-tight">
                    {item.role}
                  </h3>
                  <div className="text-xs text-slate-400 mb-2 font-medium">{item.company}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    {item.skills.map((s, i) => (
                      <span key={i} className="flex items-center gap-1.5">
                        <span className="text-slate-300 font-mono">{s}</span>
                        {i < item.skills.length - 1 && <span className="text-slate-600">·</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
