import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MANIFESTO_TEXT, HERO_DATA } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import gautamPortrait from '../assets/images/gautam.webp';

gsap.registerPlugin(ScrollTrigger);

interface AboutManifestoSectionProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
  onContactClick?: () => void;
}

export const AboutManifestoSection: React.FC<AboutManifestoSectionProps> = ({
  onHoverStart,
  onHoverEnd,
  onContactClick
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const portraitCardRef = useRef<HTMLDivElement | null>(null);

  const headlineWords = MANIFESTO_TEXT.headline.split(' ');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Kinetic word-by-word scroll illumination for headline
      if (wordsRef.current.length > 0) {
        gsap.fromTo(
          wordsRef.current,
          {
            opacity: 0.15,
            color: '#71717a',
            y: 8,
          },
          {
            opacity: 1,
            color: '#f4f4f5',
            y: 0,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 75%',
              end: 'bottom 40%',
              scrub: 0.8,
            }
          }
        );
      }

      // 2. Parallax and soft entrance for the portrait card
      gsap.fromTo(
        portraitCardRef.current,
        {
          y: 80,
          scale: 0.94,
          opacity: 0.7,
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: portraitCardRef.current,
            start: 'top 85%',
            end: 'center center',
            scrub: 1,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [headlineWords.length]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen py-20 sm:py-32 px-4 sm:px-12 md:px-16 overflow-hidden border-t border-white/5"
    >
      {/* Top Header & Floating About Tag */}
      <div className="max-w-7xl mx-auto flex items-center justify-between pb-8 sm:pb-12 border-b border-white/10 mb-8 sm:mb-12">
        <div className="flex items-center gap-2.5 sm:gap-3 font-mono-code text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-[0.2em] sm:tracking-[0.25em]">
          <span className="text-white">●</span>
          <span>Manifesto & Identity</span>
        </div>
        <div className="font-mono-code text-[11px] sm:text-xs text-neutral-300 uppercase tracking-[0.2em] px-2.5 sm:px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-xs">
          About
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Index numbers and Manifesto text */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          {/* Index marker list */}
          <div className="flex items-center gap-4 sm:gap-6 font-mono-code text-xs text-neutral-600 mb-4 sm:mb-6">
            <span>(19)</span>
            <span>(22)</span>
            <span>(25)</span>
            <span>(28)</span>
          </div>

          {/* Kinetic Illuminating Main Statement */}
          <h2
            ref={headlineRef}
            className="font-sans-display text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.35] text-neutral-400 mb-8 sm:mb-10 tracking-tight"
          >
            {headlineWords.map((word, idx) => {
              const isEmotion = word.toLowerCase().includes('emotion');
              return (
                <span
                  key={idx}
                  ref={(el) => { wordsRef.current[idx] = el; }}
                  className={`inline-block mr-[0.25em] transition-colors duration-200 ${
                    isEmotion ? 'font-serif-display italic text-[#f0f0f0] text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal' : ''
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </h2>

          {/* Bio Description Box */}
          <div className="space-y-4 sm:space-y-6 max-w-xl text-neutral-300 font-body text-xs sm:text-base leading-relaxed border-l border-white/20 pl-4 sm:pl-6 my-2 sm:my-4">
            <p>
              {MANIFESTO_TEXT.bio}
            </p>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              {MANIFESTO_TEXT.subtext}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-10 mt-6 sm:mt-8 border-t border-white/10">
            {MANIFESTO_TEXT.stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-sans-display text-xl sm:text-3xl font-bold text-[#f0f0f0] tracking-tight">
                  {stat.value}
                </span>
                <span className="font-mono-code text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-widest mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Contact action link */}
          <div className="pt-8 sm:pt-10">
            <button
              onClick={() => {
                sound.playClick();
                onContactClick?.();
              }}
              onMouseEnter={() => {
                sound.playHover();
                onHoverStart?.('GET IN TOUCH', 'hover');
              }}
              onMouseLeave={onHoverEnd}
              className="group inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-lg cursor-pointer"
            >
              <span>Initiate Collaboration</span>
              <ArrowUpRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-black" />
            </button>
          </div>
        </div>

        {/* Right Column: Mood Lighting Portrait Card (as shown in video 00:12 - 00:15) */}
        <div className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none">
          <div
            ref={portraitCardRef}
            onMouseEnter={() => {
              sound.playHover();
              onHoverStart?.('CREATOR', 'view');
            }}
            onMouseLeave={onHoverEnd}
            className="relative w-full aspect-[4/5] rounded-3xl lg:rounded-l-[48px] lg:rounded-r-2xl overflow-hidden border border-white/15 bg-zinc-950 shadow-2xl group cursor-default"
          >
            {/* Dramatic red mood portrait image of Gautam Prasad */}
            <img
              src={gautamPortrait}
              alt="Gautam Prasad - Full-Stack Developer portrait"
              loading="lazy"
              decoding="async"
              width="800"
              height="1000"
              className="w-full h-full object-cover object-top brightness-100 contrast-105 transition-transform duration-700 ease-out group-hover:scale-105 hardware-accel"
              referrerPolicy="no-referrer"
            />

            {/* Glowing Red Vignette Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-red-600/30 via-transparent to-black/60 mix-blend-screen pointer-events-none" />

            {/* Floating Top Tag */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 font-mono-code text-[10px] sm:text-xs text-white/90 bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/20">
              About
            </div>

            {/* Floating → V3.0 Badge matching the video */}
            <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="font-sans-display text-xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                  → {HERO_DATA.version}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#ff2a3b] animate-ping" />
              </div>
              <div className="font-mono-code text-[10px] sm:text-[11px] text-white/70 bg-black/50 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#ff2a3b]" />
                <span>{HERO_DATA.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
