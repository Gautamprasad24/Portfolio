import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '../types';
import { PROJECTS } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { ArrowUpRight, X, ExternalLink, Github, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface WorksSectionProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
}

export const WorksSection: React.FC<WorksSectionProps> = ({
  onHoverStart,
  onHoverEnd
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });

  const sectionRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const categories = ['all', '3D & Creative Development', 'Design & Development', 'Audio-Visual & Creative Code'];

  const filteredProjects = activeCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCategory);

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
      gsap.fromTo(
        '.project-row',
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setPreviewPos({
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <section
      id="works"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen py-28 px-6 sm:px-12 md:px-16 border-t border-white/5 overflow-hidden"
    >
      {/* Floating Hover Image Preview Tracker */}
      {hoveredProject && (
        <div
          className="fixed pointer-events-none z-30 w-72 h-44 rounded-xl overflow-hidden shadow-2xl border border-white/20 hidden md:block transition-transform duration-100 ease-out"
          style={{
            left: `${previewPos.x + 24}px`,
            top: `${previewPos.y - 80}px`,
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          <img
            src={hoveredProject.image}
            alt={hoveredProject.title}
            className="w-full h-full object-cover brightness-95 contrast-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
            <span className="font-mono-code text-[11px] text-white/90">
              {hoveredProject.subtitle}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header with Category Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono-code text-xs text-neutral-500 uppercase tracking-[0.25em] mb-2">
              <span className="text-white">●</span>
              <span>Selected Archive</span>
            </div>
            <h2 className="font-sans-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f0f0f0]">
              Featured Works
            </h2>
          </div>

          {/* Categories Pill Nav */}
          <div className="flex flex-wrap gap-2 font-mono-code text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setActiveCategory(cat);
                }}
                onMouseEnter={() => {
                  sound.playHover();
                  onHoverStart?.();
                }}
                onMouseLeave={onHoverEnd}
                className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-black font-semibold border-white shadow-sm'
                    : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                }`}
              >
                {cat === 'all' ? 'All Archive' : cat.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Project Interactive Rows */}
        <div ref={listRef} className="divide-y divide-white/10">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                sound.playClick();
                setSelectedProject(project);
              }}
              onMouseEnter={() => {
                sound.playHover();
                setHoveredProject(project);
                onHoverStart?.('OPEN', 'project');
              }}
              onMouseLeave={() => {
                setHoveredProject(null);
                onHoverEnd?.();
              }}
              className="project-row group relative py-10 sm:py-14 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:bg-white/[0.02] -mx-4 px-4 rounded-xl cursor-pointer"
            >
              {/* Left index & Title */}
              <div className="flex items-start md:items-baseline gap-6 sm:gap-10">
                <span className="font-mono-code text-sm text-neutral-500 group-hover:text-white transition-colors pt-1 md:pt-0">
                  {project.number}
                </span>

                <div>
                  <h3 className="font-sans-display text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#f0f0f0] group-hover:text-white transition-colors duration-300 flex items-center gap-3">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-5 h-5 sm:w-8 sm:h-8 opacity-0 -translate-x-3 translate-y-3 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-white" />
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-neutral-400 mt-2 font-light">
                    {project.subtitle}
                  </p>
                </div>
              </div>

              {/* Right tags & year */}
              <div className="flex items-center gap-6 sm:gap-10 md:justify-end">
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono-code text-[11px] text-neutral-400 bg-neutral-900/60 px-2.5 py-1 rounded-full border border-neutral-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="font-mono-code text-xs text-neutral-500 min-w-10 text-right">
                  {project.year}
                </span>
              </div>
            </div>
          ))}
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
                    Concept & Architecture
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
                    <span className="text-white/40 uppercase block mb-0.5 sm:mb-1">Client</span>
                    <span className="text-white font-medium">{selectedProject.client}</span>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase block mb-0.5 sm:mb-1">Status</span>
                    <span className="text-[#ff2a3b] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Published & Live
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
                    <span>Launch Live Experience</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-mono-code text-[11px] sm:text-xs uppercase tracking-wider transition-all"
                  >
                    <span>GitHub Repository</span>
                    <Github className="w-3.5 h-3.5" />
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
