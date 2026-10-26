import { useEffect, useState } from 'react';
import { X, ExternalLink, Github, Layers, CheckCircle2, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Project } from '../types/portfolio.ts';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');

  useEffect(() => {
    setActiveImageIndex(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && project?.gallery && project.gallery.length > 1) {
        setActiveImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
      }
      if (e.key === 'ArrowRight' && project?.gallery && project.gallery.length > 1) {
        setActiveImageIndex((prev) => (prev + 1) % project.gallery.length);
      }
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [project, onClose]);

  if (!project) return null;

  const galleryImages = project.gallery && project.gallery.length > 0
    ? project.gallery
    : [project.coverImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span className="font-semibold">{project.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">{project.date}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Main Title & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {project.title}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Client / Organization: <span className="text-slate-200 font-medium">{project.client}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Github className="w-4 h-4" />
                  <span>Repository</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-amber-400/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Project</span>
                </a>
              )}
            </div>
          </div>

          {/* Interactive Image Gallery Viewer with Zero-Distortion Framing */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[58vh] w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 flex items-center justify-center">
              {/* Subtle backdrop blur matching image */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-20 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${galleryImages[activeImageIndex]})` }}
              />

              {/* Main Displayed Image with togglable fit */}
              <img
                src={galleryImages[activeImageIndex]}
                alt={`${project.title} gallery slide ${activeImageIndex + 1}`}
                className={`w-full h-full relative z-0 transition-all duration-300 ${
                  fitMode === 'contain' ? 'object-contain p-2 sm:p-4' : 'object-cover'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Fit Mode Toggle & Counter Pill */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                <button
                  onClick={() => setFitMode((prev) => (prev === 'contain' ? 'cover' : 'contain'))}
                  className="px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white text-[11px] font-mono border border-white/10 backdrop-blur-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Toggle Full Fit vs Fill"
                >
                  <Maximize2 className="w-3 h-3 text-amber-400" />
                  <span>{fitMode === 'contain' ? 'View Fit' : 'View Fill'}</span>
                </button>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-amber-400 text-[11px] font-mono border border-white/10 backdrop-blur-sm">
                  0{activeImageIndex + 1} / 0{galleryImages.length}
                </span>
              </div>

              {/* Gallery Previous / Next Controls */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-slate-950/80 text-white hover:bg-slate-900 transition-all border border-white/10 shadow-lg cursor-pointer hover:scale-105 active:scale-95"
                    aria-label="Previous gallery image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % galleryImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-slate-950/80 text-white hover:bg-slate-900 transition-all border border-white/10 shadow-lg cursor-pointer hover:scale-105 active:scale-95"
                    aria-label="Next gallery image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip with Proportional Sizing */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[16/10] w-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-950 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Technology Badges (Zero-Pill format with dividers) */}
          <div className="pt-2 border-t border-white/8">
            <div className="text-xs uppercase font-semibold text-slate-400 mb-2 tracking-wider">
              Technologies &amp; Architecture
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              {project.technologies.map((tech, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="font-mono text-amber-300">{tech}</span>
                  {i < project.technologies.length - 1 && (
                    <span className="text-slate-600" aria-hidden="true">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Deep Case Study Breakdown */}
          <div className="space-y-6 pt-4 border-t border-white/8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Project Case Study &amp; Engineering Decisions</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">The Challenge</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {project.caseStudy?.challenge || project.description}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wide">The Solution</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {project.caseStudy?.solution || 'Engineered tailored visual architecture and high-performance implementation.'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Measurable Commercial Results
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {project.caseStudy?.results || 'Substantial improvements in user retention, response metrics, and conversion rates.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Project by Santosh Kumar Bheel</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
