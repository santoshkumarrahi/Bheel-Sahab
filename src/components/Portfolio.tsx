import { useState, useMemo } from 'react';
import { ExternalLink, Github, Eye, Sparkles } from 'lucide-react';
import { Project } from '../types/portfolio.ts';
import { ProjectSlider } from './ProjectSlider.tsx';
import { BeforeAfterSlider } from './BeforeAfterSlider.tsx';

interface PortfolioProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

const CATEGORIES = [
  'All Projects',
  'Graphic Design',
  'Branding and Logos',
  'Social Media Design',
  'Frontend Development',
  'Backend Development',
  'Full-Stack Websites',
];

export function Portfolio({ projects, onSelectProject }: PortfolioProps) {
  const [activeCategory, setActiveCategory] = useState('All Projects');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All Projects') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  const comparisonProject = useMemo(() => {
    return projects.find((p) => p.beforeAfter?.beforeImage && p.beforeAfter?.afterImage);
  }, [projects]);

  return (
    <section id="portfolio" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            03. Portfolio &amp; Case Studies
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Curated Graphic Design &amp; Full-Stack Engineering Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Explore commercial brand identities, responsive React interfaces, and production REST architectures.
          </p>
        </div>

        {/* Featured Project Slider Showcase */}
        <div className="mb-16">
          <ProjectSlider projects={projects} onSelectProject={onSelectProject} />
        </div>

        {/* Interactive Before & After Design Evolution */}
        {comparisonProject?.beforeAfter && (
          <div className="mb-20 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-white/10 shadow-xl">
            <div className="max-w-2xl mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Interactive Design Evolution</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Before &amp; After Redesign Comparison
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Drag the divider horizontally to compare the legacy visual identity against Santosh's modern design system.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <BeforeAfterSlider
                beforeImage={comparisonProject.beforeAfter.beforeImage}
                afterImage={comparisonProject.beforeAfter.afterImage}
                beforeLabel={comparisonProject.beforeAfter.beforeLabel}
                afterLabel={comparisonProject.beforeAfter.afterLabel}
              />
            </div>
          </div>
        )}

        {/* Category Filter Tabs (Segmented Controls) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Project Grid with Uniform Aspect Ratios and Restrained Transitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-slate-900/50 hover:bg-slate-900/90 border border-white/8 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl"
            >
              <div className="flex-1 flex flex-col">
                {/* Image Frame with Guaranteed Aspect Ratio and No Distortion */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                  {/* Subtle backdrop glow */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-15 scale-110 pointer-events-none"
                    style={{ backgroundImage: `url(${project.coverImage})` }}
                  />

                  {/* Artwork Image */}
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out relative z-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gentle scrim */}
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors z-10" />

                  {/* Hover Inspect CTA Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px] z-20">
                    <span className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Case Study</span>
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata with Separators */}
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-2">
                      <span className="font-semibold">{project.category}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">{project.date}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors mb-2 tracking-tight">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack Unboxed */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 pt-3 border-t border-white/5">
                    {project.technologies.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="flex items-center gap-1.5">
                        <span className="text-slate-300 font-mono">{t}</span>
                        {idx < 2 && idx < project.technologies.length - 1 && (
                          <span className="text-slate-600">/</span>
                        )}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-amber-400/80 font-mono text-[10px]">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer with Direct Links */}
              <div
                className="px-6 py-4 bg-slate-950/40 border-t border-white/5 flex items-center justify-between text-xs text-slate-400"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[11px] text-slate-500 font-mono truncate max-w-[150px]">
                  Client: {project.client}
                </span>

                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors p-1"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-amber-400 transition-colors p-1"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
