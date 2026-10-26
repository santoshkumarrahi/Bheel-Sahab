import { useState } from 'react';
import { Palette, Code2, Server, Wrench } from 'lucide-react';
import { Skill } from '../types/portfolio.ts';

interface SkillsProps {
  skills: Skill[];
}

export function Skills({ skills }: SkillsProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Design' | 'Frontend' | 'Backend' | 'Workflow & Tools'>('All');

  const categories = ['All', 'Design', 'Frontend', 'Backend', 'Workflow & Tools'] as const;

  const filteredSkills = activeTab === 'All'
    ? skills
    : skills.filter((s) => s.category === activeTab);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Design':
        return <Palette className="w-4 h-4 text-amber-400" />;
      case 'Frontend':
        return <Code2 className="w-4 h-4 text-blue-400" />;
      case 'Backend':
        return <Server className="w-4 h-4 text-emerald-400" />;
      default:
        return <Wrench className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 md:py-28 bg-[#0b0e17] border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            04. Technical Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Design Standards &amp; Engineering Stack
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Strictly technologies and software used in production. Configurable with real experience metrics.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeTab === cat
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-slate-900/40 border border-white/8 hover:border-amber-400/30 transition-all duration-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    {getCategoryIcon(skill.category)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{skill.name}</h3>
                    <div className="text-[11px] text-slate-400">{skill.category}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-amber-400">{skill.level}</span>
                  <div className="text-[10px] text-slate-500 font-mono">{skill.experienceYears}</div>
                </div>
              </div>

              {/* Progress Track */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Proficiency</span>
                  <span className="text-slate-200 tabular-nums">{skill.percentage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-700"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
