import { Compass, DraftingCompass, Layers, Code2, CheckCircle2, Rocket } from 'lucide-react';
import { WorkStep } from '../types/portfolio.ts';

interface WorkProcessProps {
  steps: WorkStep[];
}

export function WorkProcess({ steps }: WorkProcessProps) {
  const getStepIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'compass':
        return <Compass className="w-5 h-5 text-amber-400" />;
      case 'draftingcompass':
        return <DraftingCompass className="w-5 h-5 text-blue-400" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-purple-400" />;
      case 'code2':
        return <Code2 className="w-5 h-5 text-emerald-400" />;
      case 'checkcircle2':
        return <CheckCircle2 className="w-5 h-5 text-amber-400" />;
      case 'rocket':
      default:
        return <Rocket className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <section id="process" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            05. Engineering Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How I Collaborate With Clients From Concept to Launch
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            A disciplined, 6-phase iterative workflow ensuring transparent communication and zero unpleasant surprises.
          </p>
        </div>

        {/* 6-Step Visual Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="relative p-6 rounded-2xl bg-slate-900/40 border border-white/8 hover:border-amber-400/30 transition-all duration-200 flex flex-col justify-between group h-full shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-amber-400/10 flex items-center justify-center transition-colors">
                    {getStepIcon(step.iconName)}
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-500 group-hover:text-amber-400 transition-colors">
                    0{step.stepNumber}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors tracking-tight">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Phase 0{step.stepNumber}</span>
                <span className="text-amber-400/80 font-semibold">Active Milestone</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
