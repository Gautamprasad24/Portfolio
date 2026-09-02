import React, { useState } from 'react';
import { SERVICES, TECH_SKILLS, PHILOSOPHY_PILLARS } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { Plus, Minus, CheckCircle2, Code2, Layers, Cpu } from 'lucide-react';

interface ServicesSectionProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onHoverStart,
  onHoverEnd
}) => {
  const [activeService, setActiveService] = useState<string>(SERVICES[0].id);

  return (
    <section id="services" className="relative w-full py-28 px-6 sm:px-12 md:px-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono-code text-xs text-neutral-500 uppercase tracking-[0.25em] mb-2">
              <span className="text-white">●</span>
              <span>Capabilities & Disciplines</span>
            </div>
            <h2 className="font-sans-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f0f0f0]">
              Craft & Execution
            </h2>
          </div>
          <p className="font-mono-code text-xs text-neutral-400 max-w-sm">
            Merging mathematical discipline with high-end aesthetic sensitivity.
          </p>
        </div>

        {/* Interactive Services Accordion / Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12">
          <div className="lg:col-span-6 space-y-4">
            {SERVICES.map((service) => {
              const isOpen = activeService === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveService(isOpen ? '' : service.id);
                  }}
                  onMouseEnter={() => {
                    sound.playHover();
                    onHoverStart?.();
                  }}
                  onMouseLeave={onHoverEnd}
                  className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isOpen
                      ? 'bg-neutral-900/60 border-white/20 shadow-lg'
                      : 'bg-neutral-950/40 border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-mono-code text-xs text-neutral-400">
                        {service.number}
                      </span>
                      <h3 className="font-sans-display text-2xl sm:text-3xl font-semibold text-[#f0f0f0]">
                        {service.title}
                      </h3>
                    </div>
                    <div className="p-2 rounded-full bg-white/5 text-neutral-300">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>

                  <p className="font-body text-sm text-neutral-400 mt-3">
                    {service.tagline}
                  </p>

                  {isOpen && (
                    <div className="pt-6 mt-6 border-t border-white/10 space-y-4 animate-in fade-in duration-300">
                      <p className="text-neutral-300 font-body text-xs sm:text-sm leading-relaxed">
                        {service.description}
                      </p>

                      <div className="space-y-2 pt-2">
                        <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-widest block">
                          Key Deliverables
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.deliverables.map((del, i) => (
                            <div key={i} className="flex items-center gap-2 font-mono-code text-xs text-neutral-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                              <span>{del}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tech Stack Matrix & Philosophy Box */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            {/* Tech Stack Grid */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 backdrop-blur-xs">
              <div className="flex items-center gap-2 font-mono-code text-xs text-neutral-500 uppercase tracking-[0.25em] mb-6">
                <Cpu className="w-4 h-4 text-white" />
                <span>Technical Stack & Ecosystem</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {TECH_SKILLS.map((skill) => (
                  <div
                    key={skill.name}
                    onMouseEnter={() => {
                      sound.playHover();
                      onHoverStart?.();
                    }}
                    onMouseLeave={onHoverEnd}
                    className={`font-mono-code text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-default ${
                      skill.highlight
                        ? 'bg-neutral-800 text-white border-neutral-600 shadow-sm hover:border-white'
                        : 'bg-neutral-900/40 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Philosophy Pillars */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono-code text-xs text-white/50 uppercase tracking-widest mb-2">
                <Layers className="w-4 h-4 text-[#ff2a3b]" />
                <span>Guiding Principles</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PHILOSOPHY_PILLARS.map((p) => (
                  <div
                    key={p.index}
                    className="p-5 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between"
                  >
                    <span className="font-mono-code text-xs text-[#ff2a3b] mb-2">{p.index}</span>
                    <h4 className="font-sans-display text-sm font-bold text-white mb-1">{p.title}</h4>
                    <p className="font-body text-xs text-white/60 leading-relaxed">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
