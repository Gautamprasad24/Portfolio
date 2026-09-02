import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SKILL_ACCORDIONS } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { Plus, Minus, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SkillsAccordionSectionProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
  onContactClick?: () => void;
}

const SKILL_LINE_MARKERS = [71, 72, 74, 75, 76, 79, 80];

const DETAILED_CATEGORIES = [
  {
    id: "frontend",
    title: "Frontend",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind", "Bootstrap", "Electron", "Redux Toolkit"]
  },
  {
    id: "animation",
    title: "Animation & 3D",
    skills: ["Three.js", "GSAP", "ScrollTrigger", "Framer Motion", "Canvas 2D / WebGL", "Lenis Smooth Scroll"]
  },
  {
    id: "backend",
    title: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs", "GraphQL", "WebSockets", "JWT Authentication", "Middleware"]
  },
  {
    id: "databases",
    title: "Databases",
    skills: ["MongoDB", "Mongoose ODM", "MySQL", "PostgreSQL", "Redis", "Database Indexing"]
  },
  {
    id: "devops",
    title: "DevOps & Tools",
    skills: ["Git & GitHub", "Docker", "Postman", "Vercel", "AWS EC2/S3", "Linux Shell", "Vite"]
  },
  {
    id: "system",
    title: "System & Security",
    skills: ["OAuth 2.0", "CORS Policy", "Data Encryption", "CCAvenue Gateway", "Shiprocket Automation"]
  },
  {
    id: "design",
    title: "Design",
    skills: ["Figma", "Responsive UI/UX", "Micro-Interactions", "Typography Pairing", "Design Systems"]
  }
];

export const SkillsAccordionSection: React.FC<SkillsAccordionSectionProps> = ({
  onHoverStart,
  onHoverEnd,
  onContactClick,
}) => {
  const [openSection, setOpenSection] = useState<string>("frontend");
  const [activeMarker, setActiveMarker] = useState<number>(71);
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onUpdate: (self) => {
          const idx = Math.min(
            SKILL_LINE_MARKERS.length - 1,
            Math.floor(self.progress * SKILL_LINE_MARKERS.length)
          );
          setActiveMarker(SKILL_LINE_MARKERS[idx]);
          if (progressBarRef.current) {
            progressBarRef.current.style.top = `${self.progress * 80}%`;
          }
        },
      });

      // Smooth scroll-driven left-to-right translation of the red arrow
      if (arrowRef.current) {
        const isMobile = window.innerWidth < 768;
        gsap.fromTo(
          arrowRef.current,
          { x: 0 },
          {
            x: isMobile ? 65 : 120,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              end: "bottom 25%",
              scrub: 0.8,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleSection = (id: string) => {
    sound.playClick();
    setOpenSection(prev => (prev === id ? "" : id));
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-36 px-3 sm:px-12 md:px-20 border-t border-white/10 bg-[#0a0a0a] select-none"
    >
      {/* Left Margin Dynamic Line Number (Video 00:00 - 00:06) */}
      <div className="absolute left-3 sm:left-12 top-24 sm:top-32 z-30 font-mono-code text-xs sm:text-sm text-neutral-500">
        <span className="text-white font-bold tracking-wider text-sm sm:text-lg">
          ({activeMarker})
        </span>
      </div>

      {/* Right Margin Vertical Scroll Track & Skills Label (Video 00:00 - 00:06) */}
      <div className="absolute right-3 sm:right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4 sm:gap-6">
        <div className="w-[1.5px] h-28 sm:h-40 bg-neutral-800 rounded-full relative overflow-hidden">
          <div
            ref={progressBarRef}
            className="absolute left-0 w-full h-8 bg-white/90 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ top: '0%' }}
          />
        </div>
        <span className="font-mono-code text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-[0.2em] sm:tracking-[0.25em] [writing-mode:vertical-rl] rotate-180">
          Skills
        </span>
      </div>

      <div className="max-w-7xl mx-auto pl-6 sm:pl-16 pr-6 sm:pr-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Education / Specialization / Passion UL and Scroll-driven Red Arrow */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8 sm:space-y-10">
            <div>
              <span className="font-mono-code text-[11px] sm:text-xs text-neutral-400 uppercase tracking-[0.25em] block mb-4 sm:mb-6">
                Skills & Stack
              </span>

              {/* 3-Item Structured List matching project font with refined sizing */}
              <ul className="space-y-4 sm:space-y-5 font-sans-display text-sm sm:text-base md:text-lg text-neutral-200 font-medium">
                <li className="flex items-start gap-3 sm:gap-3.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff2a3b] shrink-0 mt-2 sm:mt-2.5 shadow-[0_0_8px_rgba(255,42,59,0.7)]" />
                  <span className="leading-snug">Computer Science & IT Graduate in Mumbai</span>
                </li>
                <li className="flex items-start gap-3 sm:gap-3.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff2a3b] shrink-0 mt-2 sm:mt-2.5 shadow-[0_0_8px_rgba(255,42,59,0.7)]" />
                  <span className="leading-snug">Specialized in MERN and Next.js</span>
                </li>
                <li className="flex items-start gap-3 sm:gap-3.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff2a3b] shrink-0 mt-2 sm:mt-2.5 shadow-[0_0_8px_rgba(255,42,59,0.7)]" />
                  <span className="leading-snug">Passionate about web development and architecture.</span>
                </li>
              </ul>
            </div>

            {/* Contact Button & Directional Red Arrow Moving Left-to-Right on Scroll */}
            <div className="space-y-5 sm:space-y-6 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onContactClick?.();
                }}
                onMouseEnter={() => {
                  sound.playHover();
                  onHoverStart?.('CONTACT', 'hover');
                }}
                onMouseLeave={onHoverEnd}
                className="font-mono-code text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-white hover:text-[#ff2a3b] transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>CONTACT ME +</span>
              </button>

              {/* Arrow button container (no red background, red arrow icon, scroll-driven translation) */}
              <div className="relative py-1 w-full max-w-sm">
                <div
                  ref={arrowRef}
                  onClick={() => {
                    sound.playClick();
                    onContactClick?.();
                  }}
                  onMouseEnter={() => {
                    sound.playHover();
                    onHoverStart?.('LET\'S TALK', 'hover');
                  }}
                  onMouseLeave={onHoverEnd}
                  className="w-24 sm:w-36 h-12 sm:h-16 rounded-2xl border border-white/20 hover:border-[#ff2a3b]/60 bg-transparent hover:bg-white/5 flex items-center justify-center cursor-pointer transition-colors duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] will-change-transform group"
                >
                  <ArrowRight className="w-8 sm:w-12 h-8 sm:h-12 text-[#ff2a3b] stroke-[2.5] transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion with Expanded List (Video 00:00 - 00:06) */}
          <div className="lg:col-span-6 space-y-2">
            <div className="divide-y divide-white/10 border-y border-white/10">
              {DETAILED_CATEGORIES.map((item) => {
                const isOpen = openSection === item.id;
                return (
                  <div key={item.id} className="py-4 sm:py-6 transition-all duration-300">
                    <button
                      onClick={() => toggleSection(item.id)}
                      onMouseEnter={() => {
                        sound.playHover();
                        onHoverStart?.(item.title, 'hover');
                      }}
                      onMouseLeave={onHoverEnd}
                      className="w-full flex items-center justify-between text-left group cursor-pointer"
                    >
                      <span className={`font-sans-display text-xl sm:text-3xl font-semibold transition-colors duration-300 ${
                        isOpen ? 'text-white' : 'text-neutral-300 group-hover:text-white'
                      }`}>
                        {item.title}
                      </span>
                      <div className="text-neutral-400 group-hover:text-white transition-colors">
                        {isOpen ? (
                          <Minus className="w-5 h-5 text-white" />
                        ) : (
                          <Plus className="w-5 h-5 text-neutral-400 group-hover:text-white" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="pt-3 pb-2 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300 pl-2">
                        {item.skills.map((skill, sIdx) => (
                          <div
                            key={sIdx}
                            className="font-sans-display text-xs sm:text-base text-neutral-400 hover:text-white transition-colors cursor-default"
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
