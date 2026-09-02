import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '../utils/audio';
import developerImg from '../assets/images/developer.webp';

gsap.registerPlugin(ScrollTrigger);

interface StatuePortalSectionProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
}

export const StatuePortalSection: React.FC<StatuePortalSectionProps> = ({
  onHoverStart,
  onHoverEnd
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const indexMarkerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax and scale on scroll
      gsap.fromTo(
        imageWrapperRef.current,
        {
          scale: 0.92,
          y: 40,
          opacity: 0.8,
        },
        {
          scale: 1,
          y: -40,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'bottom 15%',
            scrub: 1,
          }
        }
      );

      // Text reveal on scroll
      gsap.fromTo(
        textRef.current,
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 sm:px-12 md:px-20 overflow-hidden"
    >
      {/* Side Index Marker (17) */}
      <div
        ref={indexMarkerRef}
        className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 text-neutral-600 font-mono-code text-xs tracking-widest"
      >
        <span>(17)</span>
        <div className="w-[1px] h-16 bg-neutral-800" />
      </div>

      {/* Floating Section Tag */}
      <div className="absolute right-6 sm:right-12 top-12 flex items-center gap-2 font-mono-code text-xs text-neutral-500 uppercase tracking-[0.2em]">
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
        <span>01 / Perspective</span>
      </div>

      {/* 3D Neoclassical / Deconstructed Marble Sculpture Card */}
      <div
        ref={imageWrapperRef}
        onMouseEnter={() => {
          sound.playHover();
          onHoverStart?.('3D ART', 'view');
        }}
        onMouseLeave={onHoverEnd}
        className="relative w-full max-w-5xl aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-neutral-950 group cursor-default"
      >
        <img
          src={developerImg}
          alt="Classical sculpture with high-contrast dramatic shadows"
          className="w-full h-full object-cover grayscale brightness-90 contrast-150 transition-transform duration-1000 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-[#0a0a0a]/80 pointer-events-none" />

        {/* Corner Precision Markers */}
        <span className="absolute top-5 left-5 font-mono-code text-white/30 text-xs select-none">+</span>
        <span className="absolute top-5 right-5 font-mono-code text-white/30 text-xs select-none">+</span>
        <span className="absolute bottom-5 left-5 font-mono-code text-white/30 text-xs select-none">+</span>
        <span className="absolute bottom-5 right-5 font-mono-code text-white/30 text-xs select-none">+</span>

        {/* Center Floating Editorial Statement */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <h2
            ref={textRef}
            className="font-serif-display italic text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-[#f0f0f0] font-normal drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] tracking-tight"
          >
            Basically, I make websites.
          </h2>
          <p className="font-mono-code text-xs sm:text-sm text-neutral-400 mt-4 tracking-[0.2em] uppercase font-light">
            Transforming concepts into living interactive worlds
          </p>
        </div>
      </div>
    </section>
  );
};
