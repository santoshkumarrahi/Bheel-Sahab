import { Palette, Layout, Server, Layers, ArrowRight, Check } from 'lucide-react';
import { Service } from '../types/portfolio.ts';

interface ServicesProps {
  services: Service[];
  onSelectService: (serviceTitle: string) => void;
}

export function Services({ services, onSelectService }: ServicesProps) {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'palette':
        return <Palette className="w-6 h-6 text-amber-400" />;
      case 'layout':
        return <Layout className="w-6 h-6 text-blue-400" />;
      case 'server':
        return <Server className="w-6 h-6 text-emerald-400" />;
      case 'layers':
      default:
        return <Layers className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
              02. Comprehensive Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Specialized Services Tailored for High Impact
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
            Whether creating a distinctive visual identity or engineering a resilient full-stack web application, each solution is handcrafted for commercial viability.
          </p>
        </div>

        {/* 4-Column Grid for Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className="group relative rounded-2xl bg-slate-900/40 hover:bg-slate-900/90 border border-white/8 hover:border-amber-400/30 p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl h-full"
            >
              <div className="flex-1 flex flex-col">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-amber-400/10 flex items-center justify-center transition-colors">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-xs font-mono text-slate-500 group-hover:text-amber-400/80 transition-colors">
                    0{idx + 1}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors tracking-tight">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {service.shortDesc}
                </p>

                {/* Features List */}
                <ul className="space-y-2.5 mb-8 border-t border-white/5 pt-5 text-xs text-slate-300 flex-1">
                  {service.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & CTA - Pinned cleanly to card bottom */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Starting from</span>
                    <span className="text-lg font-bold text-white font-mono">{service.startingPrice}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{service.deliveryTime}</span>
                </div>

                <button
                  onClick={() => onSelectService(service.title)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-amber-400 hover:text-slate-950 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-white/5 hover:border-amber-400 shadow-sm"
                >
                  <span>Get a Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
