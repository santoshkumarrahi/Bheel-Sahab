import React, { useState, useRef, useCallback, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before Redesign',
  afterLabel = 'Santosh Modern Redesign',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Before and after comparison slider"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-white/10 shadow-2xl bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
    >
      {/* After Image (Base Layer - 100% full width, perfect cover) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        draggable={false}
      />
      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold shadow-md tracking-wide">
        {afterLabel}
      </div>

      {/* Before Image (Top Layer - using clip-path for zero-distortion alignment) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: `inset(0 calc(100% - ${sliderPosition}%) 0 0)`,
        }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          draggable={false}
        />
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg bg-slate-900/90 text-slate-200 text-xs font-medium border border-white/10 shadow-md tracking-wide">
          {beforeLabel}
        </div>
      </div>

      {/* Center Draggable Hairline Divider */}
      <div
        className="absolute top-0 bottom-0 z-20 flex items-center justify-center -translate-x-1/2 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-0.5 h-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
        <div className="absolute w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl font-mono text-xs font-black cursor-ew-resize transition-transform hover:scale-110 active:scale-95">
          ⇄
        </div>
      </div>
    </div>
  );
}
