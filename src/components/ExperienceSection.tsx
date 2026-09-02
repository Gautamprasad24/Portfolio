import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceSectionProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
}

const AWARDS_DATA = [
  {
    platform: "GSAP",
    domain: "gautamprasad.dev",
    honor: "Site of the week",
    date: "17 05 2026",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop"
  },
  {
    platform: "Awwwards",
    domain: "gautamprasad.dev",
    honor: "Honorable Mention",
    date: "26 05 2026",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop"
  },
  {
    platform: "YouTube",
    domain: "youtube.com/@gautam",
    honor: "Featured on CodeGrid",
    date: "25 06 2026",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop"
  },
  {
    platform: "Mumbai University",
    domain: "mu.ac.in",
    honor: "B.Sc. Information Technology (8.3 CGPA)",
    date: "01 07 2025",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop"
  },
  {
    platform: "R5 Advertising",
    domain: "r5advertising.com",
    honor: "Full-Stack MERN Developer",
    date: "10 06 2025",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"
  },
  {
    platform: "Web Techneeq",
    domain: "webtechneeq.com",
    honor: "Web Development Intern",
    date: "15 01 2024",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop"
  },
  {
    platform: "Pride Computers",
    domain: "pridecomputers.in",
    honor: "Diploma in Advanced Software",
    date: "12 04 2023",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop"
  }
];

const AWARDS_LINE_MARKERS = [83, 84, 86, 88];

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  onHoverStart,
  onHoverEnd
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onUpdate: (self) => {
          // Direct DOM update (not React state) so scrolling this section
          // doesn't force a re-render every scroll frame.
          const idx = Math.min(
            AWARDS_LINE_MARKERS.length - 1,
            Math.floor(self.progress * AWARDS_LINE_MARKERS.length)
          );
          if (markerRef.current) {
            markerRef.current.textContent = `(${AWARDS_LINE_MARKERS[idx]})`;
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.top = `${self.progress * 80}%`;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-36 px-3 sm:px-12 md:px-20 border-t border-white/10 bg-[#0a0a0a] select-none"
    >
      {/* Left Margin Dynamic Line Number (Video 00:07 - 00:11) */}
      <div className="absolute left-3 sm:left-12 top-24 sm:top-36 z-30 font-mono-code text-xs sm:text-sm text-neutral-500">
        <span ref={markerRef} className="text-white font-bold tracking-wider text-sm sm:text-lg">
          (83)
        </span>
      </div>

      {/* Right Margin Vertical Scroll Track & Contact Label (Video 00:07 - 00:11) */}
      <div className="absolute right-3 sm:right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4 sm:gap-6">
        <div className="w-[1.5px] h-28 sm:h-40 bg-neutral-800 rounded-full relative overflow-hidden">
          <div
            ref={progressBarRef}
            className="absolute left-0 w-full h-8 bg-white/90 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ top: '0%' }}
          />
        </div>
        <span className="font-mono-code text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-[0.2em] sm:tracking-[0.25em] [writing-mode:vertical-rl] rotate-180">
          Awards
        </span>
      </div>

      <div className="max-w-7xl mx-auto pl-6 sm:pl-16 pr-6 sm:pr-16 relative">
        {/* Section Header */}
        <div className="pb-6 sm:pb-8">
          <h2 className="font-sans-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#f0f0f0]">
            Awards & Experience
          </h2>
        </div>

        {/* High-Contrast Interactive Table (Video 00:07 - 00:11) */}
        <div className="relative border-t border-white/15 divide-y divide-white/15">
          {AWARDS_DATA.map((item, idx) => {
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => {
                  sound.playHover();
                  setHoveredIdx(idx);
                  onHoverStart?.('VIEW', 'hover');
                }}
                onMouseLeave={() => {
                  setHoveredIdx(null);
                  onHoverEnd?.();
                }}
                className={`relative py-4 sm:py-6 px-3 sm:px-6 transition-colors duration-200 cursor-pointer flex flex-col md:grid md:grid-cols-12 gap-1.5 sm:gap-4 items-start md:items-center ${
                  isHovered
                    ? 'bg-white text-black font-semibold rounded-lg shadow-xl'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {/* Col 1: Platform / Org */}
                <div className="md:col-span-3 font-sans-display text-sm sm:text-lg font-medium">
                  {item.platform}
                </div>

                {/* Col 2: Domain */}
                <div className={`md:col-span-3 font-mono-code text-[11px] sm:text-sm ${
                  isHovered ? 'text-black/70' : 'text-neutral-400'
                }`}>
                  {item.domain}
                </div>

                {/* Col 3: Honor / Role */}
                <div className={`md:col-span-4 font-sans-display text-xs sm:text-base ${
                  isHovered ? 'text-black font-semibold' : 'text-neutral-200'
                }`}>
                  {item.honor}
                </div>

                {/* Col 4: Date */}
                <div className={`md:col-span-2 md:text-right font-mono-code text-[11px] sm:text-sm ${
                  isHovered ? 'text-black/80' : 'text-neutral-400'
                }`}>
                  {item.date}
                </div>
              </div>
            );
          })}

          {/* Floating Miniature 3D Laptop Preview on Hover (Desktop only for touch safety) */}
          {hoveredIdx !== null && (
            <div
              className="hidden sm:block absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none transition-all duration-300 animate-in fade-in zoom-in-90"
              style={{
                top: `${(hoveredIdx + 0.5) * (100 / AWARDS_DATA.length)}%`,
              }}
            >
              <div className="w-44 sm:w-56 aspect-[16/10] rounded-xl overflow-hidden bg-neutral-950 p-1 border border-black/20 shadow-[0_25px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={AWARDS_DATA[hoveredIdx].image}
                    alt="Preview"
                    loading="lazy"
                    decoding="async"
                    width="220"
                    height="140"
                    className="w-full h-full object-cover hardware-accel"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-red-900/40 mix-blend-color" />
                  <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                    <span className="font-serif-display italic text-white text-xs sm:text-sm font-normal drop-shadow-md">
                      Gautam Prasad.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
