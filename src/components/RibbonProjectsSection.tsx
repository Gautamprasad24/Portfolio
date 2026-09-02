import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '../types';
import { PROJECTS } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { ExternalLink, Sparkles, ArrowUpRight, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface RibbonProjectsSectionProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
}

export const RibbonProjectsSection: React.FC<RibbonProjectsSectionProps> = ({
  onHoverStart,
  onHoverEnd,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const ribbonPathRef = useRef<SVGPathElement | null>(null);
  const ribbonGlowRef = useRef<SVGPathElement | null>(null);
  const mockupContainerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeProject = PROJECTS[activeIndex] || PROJECTS[0];

  // Lock body scroll, pause Lenis, and handle Escape key when modal is open
  useEffect(() => {
    if (selectedProject) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      (window as any).lenis?.stop();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedProject(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        (window as any).lenis?.start();
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedProject]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Precise Red Ribbon Drawing synchronized with scroll (Video 00:00 - 00:08)
      if (ribbonPathRef.current && ribbonGlowRef.current) {
        const path = ribbonPathRef.current;
        const glow = ribbonGlowRef.current;
        const pathLength = path.getTotalLength();

        gsap.set([path, glow], {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to([path, glow], {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'bottom 25%',
            scrub: 0.6,
          },
        });
      }

      // 2. Parallax floating effect for the sticky laptop device mockup
      if (mockupContainerRef.current) {
        gsap.to(mockupContainerRef.current, {
          y: 35,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        });
      }

      // 3. ScrollTrigger per project item to activate on scroll
      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        ScrollTrigger.create({
          trigger: item,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative w-full min-h-screen py-20 sm:py-32 px-4 sm:px-12 md:px-16 border-t border-white/10 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Sinuous Dynamic Red Ribbon SVG traversing the screen (Video 00:00 - 00:08) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-95">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 2800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Glowing blur underlayer */}
          <path
            ref={ribbonGlowRef}
            d="M -40,80 C 260,180 180,480 80,780 C -20,1080 180,1380 380,1650 C 580,1920 220,2250 140,2500 C 60,2700 480,2820 950,2750 C 1250,2700 1480,2750 1600,2780"
            stroke="#ff2a3b"
            strokeWidth="56"
            strokeLinecap="round"
            className="blur-lg opacity-40"
          />
          {/* Main Solid Sharp Crimson Ribbon */}
          <path
            ref={ribbonPathRef}
            d="M -40,80 C 260,180 180,480 80,780 C -20,1080 180,1380 380,1650 C 580,1920 220,2250 140,2500 C 60,2700 480,2820 950,2750 C 1250,2700 1480,2750 1600,2780"
            stroke="#ff2a3b"
            strokeWidth="42"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-8 sm:pb-12 border-b border-white/10 mb-8 sm:mb-12">
          <div className="flex items-center gap-2.5 sm:gap-3 font-mono-code text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-[0.2em] sm:tracking-[0.25em]">
            <span className="w-2 h-2 rounded-full bg-[#ff2a3b] animate-pulse" />
            <span>Archive & Deployments</span>
          </div>
          <div className="font-mono-code text-[11px] sm:text-xs text-neutral-300 uppercase tracking-[0.2em] px-2.5 sm:px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 backdrop-blur-xs">
            Projects
          </div>
        </div>

        {/* Two-Column Interactive Layout: Left Project Titles & Right Sticky Device Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Project Titles List with margin line numbers */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-8 relative">
            {PROJECTS.map((project, idx) => {
              const isCurrent = activeIndex === idx;
              // Reference video line numbers: (29), (31), (32), (33), (35), (36), (39), (40), (41)...
              const indexMarker = 28 + idx * 2 + (idx > 3 ? 1 : 0);

              return (
                <div
                  key={project.id}
                  ref={(el) => { itemRefs.current[idx] = el; }}
                  onClick={() => {
                    sound.playClick();
                    setActiveIndex(idx);
                    setSelectedProject(project);
                  }}
                  onMouseEnter={() => {
                    sound.playHover();
                    setActiveIndex(idx);
                    onHoverStart?.('VIEW', 'project');
                  }}
                  onMouseLeave={onHoverEnd}
                  className={`group relative py-3.5 sm:py-5 px-3.5 sm:px-6 rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'text-white translate-x-1 sm:translate-x-2 bg-white/5 sm:bg-transparent'
                      : 'text-neutral-600 hover:text-neutral-400'
                  }`}
                >
                  <div className="flex items-baseline gap-3 sm:gap-6 min-w-0 pr-2">
                    {/* Left Margin Index Marker (Video 00:00 - 00:08) */}
                    <span
                      className={`font-mono-code text-[11px] sm:text-xs shrink-0 transition-colors duration-300 ${
                        isCurrent ? 'text-neutral-400' : 'text-neutral-700'
                      }`}
                    >
                      ({indexMarker})
                    </span>

                    <h3
                      className={`font-sans-display text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight transition-all duration-300 truncate sm:whitespace-normal ${
                        isCurrent
                          ? 'text-white opacity-100 scale-[1.01]'
                          : 'text-neutral-500 opacity-50 group-hover:opacity-85 group-hover:text-neutral-300'
                      }`}
                    >
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <ArrowUpRight
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                        isCurrent
                          ? 'text-[#ff2a3b] opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-3 group-hover:opacity-40 text-white'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Laptop Device Mockup Preview (Video 00:00 - 00:08) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div
              ref={mockupContainerRef}
              className="relative w-full rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-neutral-950/85 border border-neutral-800 shadow-2xl backdrop-blur-xl transition-all duration-500"
            >
              {/* Top Bar inside mockup card (e.g. 01 2025 / PREVIEW) */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-white/10 font-mono-code text-[11px] sm:text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-300 font-semibold">{activeProject.number} {activeProject.year}</span>
                  <span className="text-neutral-700">/</span>
                  <span className="text-neutral-400 font-medium truncate max-w-[140px] sm:max-w-none">{activeProject.category}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400 uppercase tracking-widest text-[9px] sm:text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a3b] animate-pulse" />
                  <span>PREVIEW</span>
                </div>
              </div>

              {/* Realistic Laptop Hardware Frame */}
              <div
                onClick={() => setSelectedProject(activeProject)}
                onMouseEnter={() => onHoverStart?.('OPEN', 'project')}
                onMouseLeave={onHoverEnd}
                className="group relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-neutral-700 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer"
              >
                {/* Laptop Camera dot */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-800 border border-neutral-700 z-20" />

                {/* Screenshot */}
                <img
                  key={activeProject.id}
                  src={activeProject.image}
                  alt={activeProject.title}
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="500"
                  className="w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 animate-in fade-in hardware-accel"
                  referrerPolicy="no-referrer"
                />

                {/* Ambient screen overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Bottom Screen Label */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-end justify-between z-10">
                  <div>
                    <span className="font-mono-code text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-wider block">
                      {activeProject.client}
                    </span>
                    <h4 className="font-sans-display text-base sm:text-xl font-bold text-white tracking-tight">
                      {activeProject.title}
                    </h4>
                  </div>

                  <span className="px-2.5 sm:px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-mono-code text-[10px] sm:text-[11px] flex items-center gap-1.5 group-hover:bg-[#ff2a3b] transition-colors">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Project Description & Tags below laptop */}
              <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                <p className="font-body text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {activeProject.description}
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                  {activeProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono-code text-[10px] sm:text-[11px] text-neutral-400 bg-neutral-900 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-neutral-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {activeProject.link && (
                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono-code text-neutral-300 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      <span>Visit Live Website</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#ff2a3b]" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal Detail View via Portal */}
      {selectedProject &&
        createPortal(
          <div
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-2xl overflow-y-auto overscroll-contain flex justify-center items-start p-3.5 sm:p-6 md:p-10 pt-16 sm:pt-20 pb-16 animate-in fade-in duration-200"
            onClick={() => setSelectedProject(null)}
          >
            {/* Screen-Fixed Top-Right Close Button (Always visible on any device/scroll position) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                setSelectedProject(null);
              }}
              aria-label="Close project modal"
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[1000000] flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-neutral-900/95 border border-white/25 hover:border-[#ff2a3b] hover:bg-[#ff2a3b] text-white shadow-[0_8px_30px_rgba(0,0,0,0.9)] transition-all duration-200 active:scale-95 cursor-pointer group"
            >
              <span className="font-mono-code text-[11px] sm:text-xs font-semibold tracking-widest uppercase hidden xs:inline">
                Close
              </span>
              <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Modal Dialog Card */}
            <div
              data-lenis-prevent="true"
              className="relative w-full max-w-4xl bg-[#0e0e11] border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.95)] my-4 sm:my-8 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono-code text-[10px] sm:text-xs text-[#ff2a3b] uppercase tracking-wider mb-2 pr-12 sm:pr-0">
                <span>{selectedProject.number}</span>
                <span>/</span>
                <span>{selectedProject.category}</span>
                <span>/</span>
                <span>{selectedProject.year}</span>
              </div>

              <h2 className="font-sans-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 pr-10 sm:pr-0 leading-tight">
                {selectedProject.title}
              </h2>
              <p className="font-body text-xs sm:text-base text-white/70 mb-5 sm:mb-6 leading-relaxed">
                {selectedProject.subtitle}
              </p>

              {/* Main Featured Showcase Image */}
              <div className="w-full aspect-[16/9] max-h-[38vh] sm:max-h-[48vh] rounded-xl sm:rounded-2xl overflow-hidden mb-5 sm:mb-7 border border-white/15 bg-black">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Description & Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 py-3 sm:py-4 border-t border-white/10">
                <div className="md:col-span-2 space-y-3 sm:space-y-4">
                  <h4 className="font-mono-code text-[10px] sm:text-xs text-white/40 uppercase tracking-wider">
                    Concept & Engineering
                  </h4>
                  <p className="text-white/85 font-body text-xs sm:text-sm md:text-base leading-relaxed">
                    {selectedProject.description}
                  </p>
                  <div className="pt-2 sm:pt-3 flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedProject.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono-code text-[10px] sm:text-xs text-white/90 bg-white/10 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/15"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 font-mono-code text-[11px] sm:text-xs border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                  <div>
                    <span className="text-white/40 uppercase block mb-0.5 sm:mb-1">Role</span>
                    <span className="text-white font-medium">{selectedProject.role}</span>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase block mb-0.5 sm:mb-1">Client / Firm</span>
                    <span className="text-white font-medium">{selectedProject.client}</span>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase block mb-0.5 sm:mb-1">Status</span>
                    <span className="text-[#ff2a3b] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Production Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Action CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-5 mt-4 border-t border-white/10">
                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#ff2a3b] hover:bg-[#e01428] active:scale-95 text-white font-mono-code text-[11px] sm:text-xs uppercase tracking-wider transition-all"
                  >
                    <span>Launch Live Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};
