import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

interface FloatingGallerySectionProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
}

interface MockupItem {
  id: string;
  title: string;
  image: string;
  deviceType: string;
  targetX: number;
  targetY: number;
  rotateZ: number;
  scale: number;
}

// 8 Distinct 3D Hardware Mockups matching the reference video
const MOCKUP_ITEMS: MockupItem[] = [
  {
    id: "m1",
    title: "VidyaTrade E-Commerce",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
    deviceType: "laptop-pedestal",
    targetX: -460,
    targetY: -280,
    rotateZ: -5,
    scale: 0.78,
  },
  {
    id: "m2",
    title: "N Gandhi Group",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    deviceType: "laptop-chair",
    targetX: 0,
    targetY: -320,
    rotateZ: 2,
    scale: 0.8,
  },
  {
    id: "m3",
    title: "Real-time Stock Heatmap",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    deviceType: "laptop-rock",
    targetX: 460,
    targetY: -270,
    rotateZ: 5,
    scale: 0.78,
  },
  {
    id: "m4",
    title: "NAEPL Engineering",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    deviceType: "studio-display",
    targetX: 560,
    targetY: 10,
    rotateZ: 4,
    scale: 0.82,
  },
  {
    id: "m5",
    title: "RW Sawant Developer",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    deviceType: "laptop-wood",
    targetX: 450,
    targetY: 290,
    rotateZ: -4,
    scale: 0.8,
  },
  {
    id: "m6",
    title: "CyberDiag Web App",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    deviceType: "laptop-blue",
    targetX: 0,
    targetY: 330,
    rotateZ: -3,
    scale: 0.82,
  },
  {
    id: "m7",
    title: "Tadoba Jungle Safari",
    image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=800&auto=format&fit=crop",
    deviceType: "tablet-easel",
    targetX: -450,
    targetY: 280,
    rotateZ: 6,
    scale: 0.78,
  },
  {
    id: "m8",
    title: "NAMTPL Marine Portal",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    deviceType: "studio-monitor",
    targetX: -560,
    targetY: -10,
    rotateZ: -5,
    scale: 0.82,
  },
];

const LINE_MARKERS = [43, 44, 46, 47, 50, 53, 55, 57, 60, 62, 65, 67];

// Marquee card component for mobile view
const MobileMarqueeCard: React.FC<{
  item: MockupItem;
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
}> = ({ item, onHoverStart, onHoverEnd }) => (
  <div
    onClick={() => {
      sound.playClick();
      onHoverStart?.(item.title, 'view');
    }}
    onMouseEnter={() => {
      sound.playHover();
      onHoverStart?.(item.title, 'view');
    }}
    onMouseLeave={onHoverEnd}
    className="shrink-0 w-[180px] xs:w-[210px] mx-2 group cursor-pointer"
  >
    <div className="relative rounded-xl overflow-hidden bg-neutral-950/90 p-1.5 border border-white/15 shadow-[0_10px_25px_rgba(0,0,0,0.85)] transition-all duration-300 group-hover:border-[#ff2a3b] group-hover:shadow-[0_12px_30px_rgba(255,42,59,0.35)] group-active:scale-95">
      <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-black">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          width="320"
          height="200"
          className="w-full h-full object-cover object-top brightness-95 contrast-110 transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-white z-10">
          <span className="font-sans-display font-semibold text-[10px] truncate drop-shadow">
            {item.title}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a3b] shrink-0 ml-1.5" />
        </div>
      </div>
    </div>
  </div>
);

export const FloatingGallerySection: React.FC<FloatingGallerySectionProps> = ({
  onHoverStart,
  onHoverEnd,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const desktopContainerRef = useRef<HTMLDivElement | null>(null);
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLSpanElement | null>(null);

  // Split cards for 2-row mobile marquee
  const topMarqueeItems = MOCKUP_ITEMS.slice(0, 4);
  const bottomMarqueeItems = MOCKUP_ITEMS.slice(4, 8);

  useEffect(() => {
    // Only initialize GSAP pinned scroll timeline on desktop devices (width >= 768)
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    const ctx = gsap.context(() => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      const scaleX = Math.min(1.15, Math.max(0.65, screenW / 1280));
      const scaleY = Math.min(1.1, Math.max(0.65, screenH / 850));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Update via direct DOM refs instead of React state so the pinned
            // scroll animation doesn't trigger a React re-render on every
            // scroll frame (this was a major source of scroll jank).
            const markerIdx = Math.min(
              LINE_MARKERS.length - 1,
              Math.floor(self.progress * LINE_MARKERS.length)
            );
            if (markerRef.current) {
              markerRef.current.textContent = `(${LINE_MARKERS[markerIdx]})`;
            }

            if (progressBarRef.current) {
              progressBarRef.current.style.top = `${self.progress * 80}%`;
            }
          },
        },
      });

      // 1. Text enters and settles in center
      tl.fromTo(
        quoteRef.current,
        {
          opacity: 0,
          scale: 0.88,
          y: 45,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.28,
          ease: 'power2.out',
        },
        0.08
      );

      // Text fades out towards the end of gallery scroll (72% - 95%)
      tl.to(
        quoteRef.current,
        {
          opacity: 0.1,
          scale: 0.95,
          y: -45,
          duration: 0.25,
          ease: 'power2.in',
        },
        0.72
      );

      // 2. Animate all 8 device mockups in orbital ring
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const item = MOCKUP_ITEMS[index];
        if (!item) return;

        const stagger = index * 0.018;
        const targetX = item.targetX * scaleX;
        const targetY = item.targetY * scaleY;
        const cardScale = item.scale * Math.min(1.05, Math.max(0.75, screenW / 1200));

        const startY = 700 * scaleY;
        const endY = -700 * scaleY;

        gsap.set(card, {
          x: targetX * 0.6,
          y: startY,
          rotationZ: item.rotateZ * 1.3,
          scale: cardScale * 0.7,
          opacity: 0,
        });

        tl.to(
          card,
          {
            x: targetX,
            y: targetY,
            rotationZ: item.rotateZ,
            scale: cardScale,
            opacity: 1,
            duration: 0.32,
            ease: 'power2.out',
          },
          stagger
        );

        tl.to(
          card,
          {
            x: targetX * 1.25,
            y: endY,
            rotationZ: -item.rotateZ * 1.2,
            scale: cardScale * 0.8,
            opacity: 0,
            duration: 0.28,
            ease: 'power1.in',
          },
          0.70 + stagger
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#0a0a0a] select-none border-t border-white/10 z-20"
    >
      {/* ------------------------------------------------------------- */}
      {/* MOBILE VIEW (< md): Continuous Infinite Dual-Marquee Showcase */}
      {/* ------------------------------------------------------------- */}
      <div className="flex md:hidden flex-col justify-between py-12 min-h-[92vh] w-full relative">
        {/* Mobile Top Header Indicator */}
        <div className="w-full px-6 flex items-center justify-between mb-4">
          <span className="font-mono-code text-xs text-neutral-400">
            <span className="text-white font-bold tracking-wider">(43)</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a3b] animate-pulse" />
            <span className="font-mono-code text-[10px] text-neutral-400 tracking-[0.2em] uppercase">
              Projects Showcase
            </span>
          </div>
        </div>

        {/* Top Marquee (Cards 1 to 4 scrolling smoothly to the left) */}
        <div className="relative w-full overflow-hidden py-3">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="animate-marquee-left flex items-center">
            {/* Repeat 3 times to ensure infinite smooth seamless looping without gap */}
            {[...topMarqueeItems, ...topMarqueeItems, ...topMarqueeItems].map((item, idx) => (
              <MobileMarqueeCard
                key={`mob-top-${item.id}-${idx}`}
                item={item}
                onHoverStart={onHoverStart}
                onHoverEnd={onHoverEnd}
              />
            ))}
          </div>
        </div>

        {/* Center Typography Statement on Mobile */}
        <div className="my-6 px-6 text-center select-none">
          <h2 className="font-sans-display text-[clamp(1.75rem,7.5vw,2.5rem)] font-bold tracking-tight text-[#f0f0f0] leading-[1.15] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            Each project is a chance
          </h2>
          <div className="my-2 flex flex-wrap items-baseline justify-center gap-x-2">
            <span className="font-sans-display text-[clamp(1.75rem,7.5vw,2.5rem)] font-bold tracking-tight text-[#f0f0f0]">
              to
            </span>
            <span className="font-serif-display italic text-[clamp(1.75rem,7.5vw,2.5rem)] font-normal text-neutral-100">
              learn,
            </span>
            <span className="font-serif-display italic text-[clamp(1.75rem,7.5vw,2.5rem)] font-normal text-[#ff4d5a] drop-shadow-[0_4px_20px_rgba(255,42,59,0.4)]">
              experiment
            </span>
            <span className="font-sans-display text-[clamp(1.75rem,7.5vw,2.5rem)] font-bold tracking-tight text-[#f0f0f0]">
              and
            </span>
          </div>
          <h2 className="font-sans-display text-[clamp(1.75rem,7.5vw,2.5rem)] font-bold tracking-tight text-[#f0f0f0] leading-[1.15]">
            push my limits.
          </h2>
        </div>

        {/* Bottom Marquee (Cards 5 to 8 scrolling smoothly to the right) */}
        <div className="relative w-full overflow-hidden py-3">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="animate-marquee-right flex items-center">
            {/* Repeat 3 times to ensure infinite smooth seamless looping without gap */}
            {[...bottomMarqueeItems, ...bottomMarqueeItems, ...bottomMarqueeItems].map((item, idx) => (
              <MobileMarqueeCard
                key={`mob-btm-${item.id}-${idx}`}
                item={item}
                onHoverStart={onHoverStart}
                onHoverEnd={onHoverEnd}
              />
            ))}
          </div>
        </div>

        {/* Mobile Swipe / Tap hint */}
        <div className="w-full text-center mt-2">
          <span className="font-mono-code text-[9px] text-neutral-400 uppercase tracking-widest">
            ← Tap cards to view project details →
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP VIEW (>= md): Pinned 3D GSAP Orbital Gallery Stage    */}
      {/* ------------------------------------------------------------- */}
      <div
        ref={desktopContainerRef}
        className="hidden md:flex relative w-full h-screen items-center justify-center"
      >
        {/* Left Sidebar Fixed Index Number Tracker */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 z-30 font-mono-code text-sm text-neutral-400">
          <span ref={markerRef} className="text-white font-bold tracking-wider text-lg">
            (43)
          </span>
        </div>

        {/* Right Sidebar Vertical Scroll Track & Label */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-6">
          <div className="w-[1.5px] h-40 bg-neutral-800 rounded-full relative overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute left-0 w-full h-8 bg-white/90 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{ top: '0%' }}
            />
          </div>
          <span className="font-mono-code text-[11px] text-neutral-400 uppercase tracking-[0.25em] [writing-mode:vertical-rl] rotate-180">
            Gallery
          </span>
        </div>

        {/* Orbit Stage: Central Quote & Floating Cutout Renders */}
        <div className="relative w-full max-w-7xl h-full flex items-center justify-center px-16">
          {/* Floating Device Elements */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            {MOCKUP_ITEMS.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                onMouseEnter={() => {
                  sound.playHover();
                  onHoverStart?.(item.title, 'view');
                }}
                onMouseLeave={onHoverEnd}
                className="absolute pointer-events-auto cursor-pointer group will-change-transform hover:z-30"
                style={{
                  width: 'clamp(130px, 20vw, 235px)',
                }}
              >
                <div className="relative rounded-2xl overflow-hidden bg-neutral-950/90 p-2 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-[#ff2a3b] group-hover:shadow-[0_25px_60px_rgba(255,42,59,0.35)]">
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="250"
                      className="w-full h-full object-cover object-top brightness-95 contrast-110 transition-transform duration-500 group-hover:scale-105 hardware-accel"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white z-10">
                      <span className="font-sans-display font-semibold text-xs truncate drop-shadow">
                        {item.title}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a3b] shrink-0 ml-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Center Typography Statement */}
          <div
            ref={quoteRef}
            className="relative z-20 max-w-4xl text-center px-6 pointer-events-none select-none drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]"
          >
            <h2 className="font-sans-display text-[clamp(2rem,5.2vw,5.5rem)] font-bold tracking-tight text-[#f0f0f0] leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              Each project is a chance
            </h2>
            <div className="my-3 flex flex-wrap items-baseline justify-center gap-x-4">
              <span className="font-sans-display text-[clamp(2rem,5.2vw,5.5rem)] font-bold tracking-tight text-[#f0f0f0] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                to
              </span>
              <span className="font-serif-display italic text-[clamp(2rem,5.2vw,5.5rem)] font-normal text-neutral-100 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                learn,
              </span>
              <span className="font-serif-display italic text-[clamp(2rem,5.2vw,5.5rem)] font-normal text-[#ff4d5a] drop-shadow-[0_4px_24px_rgba(255,42,59,0.4)]">
                experiment
              </span>
              <span className="font-sans-display text-[clamp(2rem,5.2vw,5.5rem)] font-bold tracking-tight text-[#f0f0f0] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                and
              </span>
            </div>
            <h2 className="font-sans-display text-[clamp(2rem,5.2vw,5.5rem)] font-bold tracking-tight text-[#f0f0f0] leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              push my limits.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};
