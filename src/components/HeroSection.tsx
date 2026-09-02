import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO_DATA } from '../data/portfolioData';
import { sound } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
  onExploreClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onHoverStart,
  onHoverEnd,
  onExploreClick
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftTextRef = useRef<HTMLDivElement | null>(null);
  const rightTextRef = useRef<HTMLDivElement | null>(null);
  const taglineRef = useRef<HTMLDivElement | null>(null);
  const bottomBarRef = useRef<HTMLDivElement | null>(null);
  const portalBoxRef = useRef<HTMLDivElement | null>(null);
  const portalTextRef = useRef<HTMLDivElement | null>(null);
  const portalImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinned master scroll animation matching Video 2 sequence (00:00 -> 00:04)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=160%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      // 1. Tagline & bottom bar fade out quickly
      tl.to([taglineRef.current, bottomBarRef.current], {
        opacity: 0,
        y: -25,
        duration: 0.25,
        ease: 'power2.inOut'
      }, 0);

      // 2. Left name ("Gautam") slides left, right name ("Prasad.") slides right to screen edges
      tl.to(leftTextRef.current, {
        xPercent: -45,
        opacity: 0.2,
        scale: 0.92,
        duration: 1,
        ease: 'power2.inOut'
      }, 0.05);

      tl.to(rightTextRef.current, {
        xPercent: 45,
        opacity: 0.2,
        scale: 0.92,
        duration: 1,
        ease: 'power2.inOut'
      }, 0.05);

      // 3. Center sculpture preview box emerges and scales up from small center rectangle to wide cinematic frame
      tl.fromTo(portalBoxRef.current, {
        scale: 0.2,
        opacity: 0,
        borderRadius: '32px',
        width: '240px',
        height: '140px',
      }, {
        scale: 1,
        opacity: 1,
        borderRadius: '16px',
        width: 'min(92vw, 1180px)',
        height: 'min(72vh, 620px)',
        duration: 1,
        ease: 'power2.out'
      }, 0.05);

      // 4. Image subtle zoom within the frame
      tl.fromTo(portalImageRef.current, {
        scale: 1.25,
      }, {
        scale: 1.05,
        duration: 1,
        ease: 'power1.out'
      }, 0.05);

      // 5. "Basically, I make websites" text fades in smoothly inside the expanded frame
      tl.fromTo(portalTextRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.92,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, 0.55);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#0a0a0a] select-none z-20 flex flex-col justify-between"
    >
      {/* Top Left Tagline / Statement (Video 00:00) */}
      <div
        ref={taglineRef}
        className="relative z-30 pt-20 sm:pt-28 px-4 sm:px-12 md:px-16 max-w-xs sm:max-w-md pointer-events-auto"
      >
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-semibold text-neutral-500 block mb-1 sm:mb-2 font-mono-code">
          Introduction / Statement
        </span>
        <p className="font-body text-[11px] sm:text-sm text-neutral-300 font-normal leading-relaxed">
          {HERO_DATA.tagline}
        </p>
      </div>

      {/* Center Stage: Split Typography & Centered Zooming Portal Card */}
      <div
        ref={containerRef}
        className="relative z-20 w-full max-w-full overflow-hidden flex-1 flex items-center justify-center gap-1.5 sm:gap-4 md:gap-6 px-2 sm:px-8"
      >
        {/* Left Name: "GAUTAM" */}
        <div
          ref={leftTextRef}
          onMouseEnter={() => {
            sound.playHover();
            onHoverStart?.('DEV', 'hover');
          }}
          onMouseLeave={onHoverEnd}
          className="relative z-20 shrink-0 cursor-default"
        >
          <h1 className="font-sans-display font-black text-[clamp(1.6rem,5.2vw,6.5rem)] leading-none text-[#f0f0f0] tracking-tighter uppercase transition-colors duration-300">
            {HERO_DATA.nameSans}
          </h1>
        </div>

        {/* Center Expanding Sculpture Portal Box (Video 00:01 -> 00:04) */}
        <div
          ref={portalBoxRef}
          onMouseEnter={() => {
            sound.playHover();
            onHoverStart?.('3D ART', 'view');
          }}
          onMouseLeave={onHoverEnd}
          className="absolute z-10 overflow-hidden border border-white/20 bg-neutral-950 shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex items-center justify-center cursor-pointer group"
          style={{
            width: 'clamp(140px, 25vw, 240px)',
            height: 'clamp(90px, 16vw, 140px)',
          }}
        >
          {/* Sculpture Image */}
          <img
            ref={portalImageRef}
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1800&auto=format&fit=crop"
            alt="Neoclassical sculpture with high-contrast chiaroscuro lighting"
            decoding="async"
            width="1800"
            height="1100"
            className="w-full h-full object-cover grayscale brightness-90 contrast-140 transition-transform duration-700 group-hover:scale-110 hardware-accel"
            referrerPolicy="no-referrer"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/75 pointer-events-none" />

          {/* Corner Precision Crosshair Markers */}
          <span className="absolute top-3 sm:top-6 left-3 sm:left-6 font-mono-code text-white/40 text-[10px] sm:text-sm select-none pointer-events-none">+</span>
          <span className="absolute top-3 sm:top-6 right-3 sm:right-6 font-mono-code text-white/40 text-[10px] sm:text-sm select-none pointer-events-none">+</span>
          <span className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 font-mono-code text-white/40 text-[10px] sm:text-sm select-none pointer-events-none">+</span>
          <span className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 font-mono-code text-white/40 text-[10px] sm:text-sm select-none pointer-events-none">+</span>

          {/* Center Floating Statement: "Basically, I make websites" (Video 00:03 - 00:04) */}
          <div
            ref={portalTextRef}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-10 text-center pointer-events-none"
          >
            <span className="font-mono-code text-[9px] sm:text-xs text-neutral-400 uppercase tracking-[0.25em] mb-1 sm:mb-4">
              Digital Craftsmanship
            </span>
            <h2 className="font-serif-display italic text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-[#f0f0f0] font-normal drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] tracking-tight leading-tight">
              Basically, I make websites.
            </h2>
            <p className="font-mono-code text-[9px] sm:text-xs text-neutral-400 mt-2 sm:mt-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase">
              (17) — Crafted with code, motion, and precision
            </p>
          </div>
        </div>

        {/* Right Name: "Prasad." */}
        <div
          ref={rightTextRef}
          onMouseEnter={() => {
            sound.playHover();
            onHoverStart?.('ENGINEER', 'hover');
          }}
          onMouseLeave={onHoverEnd}
          className="relative z-20 shrink-0 cursor-default"
        >
          <h1 className="font-serif-display italic font-normal text-[clamp(1.6rem,5.2vw,6.5rem)] leading-none text-[#f0f0f0] tracking-tight transition-colors duration-300">
            {HERO_DATA.nameSerif}
          </h1>
        </div>
      </div>

      {/* Hero Bottom Bar Indicator (Video 00:00) */}
      <div
        ref={bottomBarRef}
        className="relative z-30 flex items-center justify-between pb-6 sm:pb-8 px-4 sm:px-12 md:px-16 border-t border-white/10"
      >
        <div className="flex items-center gap-2 sm:gap-3 font-mono-code text-[11px] sm:text-xs text-neutral-400">
          <span className="text-[#ff2a3b] font-bold">→ {HERO_DATA.version}</span>
          <span className="text-neutral-600 hidden sm:inline">/</span>
          <span className="hidden sm:inline text-neutral-500">Scroll to explore</span>
        </div>

        <div className="hidden xs:flex items-center gap-3 sm:gap-8 font-mono-code text-[11px] sm:text-xs text-neutral-400">
          <a
            href={HERO_DATA.socials[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LINKEDIN
          </a>
          <span className="text-neutral-700">/</span>
          <a
            href={HERO_DATA.socials[1].url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GITHUB
          </a>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onExploreClick?.();
          }}
          onMouseEnter={() => {
            sound.playHover();
            onHoverStart?.('EXPLORE', 'hover');
          }}
          onMouseLeave={onHoverEnd}
          className="group flex items-center gap-1.5 sm:gap-2 font-mono-code text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <span>Selected Works</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-white">→</span>
        </button>
      </div>
    </section>
  );
};

