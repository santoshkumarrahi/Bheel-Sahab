import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, ExternalLink, ArrowRight } from 'lucide-react';
import { Project } from '../types/portfolio.ts';

interface ProjectSliderProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function ProjectSlider({ projects, onSelectProject }: ProjectSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const touchStartX = useRef<number | null>(null);

  const featured = projects.filter((p) => p.featured);
  const items = featured.length > 0 ? featured : projects;

  useEffect(() => {
    if (!isPlaying || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, items.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    touchStartX.current = null;
  };

  if (items.length === 0) return null;

  const current = items[currentIndex];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900/60 border border-white/10 shadow-2xl">
      {/* Slider Viewport with balanced 16:9 / 16:10 aspect ratio */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden bg-slate-950"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            {/* Ambient blurred backdrop for consistent edge filling */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-20 scale-110 pointer-events-none"
              style={{ backgroundImage: `url(${current.coverImage})` }}
            />

            {/* Main Project Visual - perfectly scaled and centered */}
            <img
              src={current.coverImage}
              alt={current.title}
              className="w-full h-full object-cover object-center relative z-0 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />

            {/* Measured Bottom Scrim for Maximum Legibility without blinding artwork */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#090b10] via-[#090b10]/75 to-transparent z-10 pointer-events-none" />

            {/* Floating Quick Navigation Arrows */}
            <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="pointer-events-auto p-2.5 rounded-2xl bg-slate-950/70 hover:bg-slate-900 text-white/90 hover:text-white border border-white/10 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="pointer-events-auto p-2.5 rounded-2xl bg-slate-950/70 hover:bg-slate-900 text-white/90 hover:text-white border border-white/10 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6 z-20">
              <div className="max-w-2xl space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-400">
                  <span className="font-semibold">{current.category}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-300">{current.date}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">Client: {current.client}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {current.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl leading-relaxed">
                  {current.description}
                </p>

                {/* Tech tags unboxed */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                  {current.technologies.slice(0, 4).map((tech, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <span className="text-amber-300 font-mono text-[11px]">{tech}</span>
                      {i < 3 && i < current.technologies.length - 1 && (
                        <span aria-hidden="true" className="text-slate-600">/</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onSelectProject(current)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  <span>Explore Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {current.liveUrl && (
                  <a
                    href={current.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 transition-colors shadow-md backdrop-blur-sm"
                    aria-label="Open Live Demo"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950/90 border-t border-white/8 text-xs text-slate-400">
        {/* Pagination Dots with Slide Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all rounded-full cursor-pointer ${
                  currentIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] text-slate-500 tabular-nums">
            0{currentIndex + 1} / 0{items.length}
          </span>
        </div>

        {/* Play/Pause & Minimalist Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            {isPlaying ? 'Autoplay' : 'Paused'}
          </span>
        </div>
      </div>
    </div>
  );
}
