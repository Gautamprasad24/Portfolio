import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { HERO_DATA } from '../data/portfolioData';

interface IntroLoaderProps {
  onComplete: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textLukeRef = useRef<HTMLSpanElement | null>(null);
  const textBaffaitRef = useRef<HTMLSpanElement | null>(null);
  const redCurtainRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const handleSkip = () => {
    if (timelineRef.current) {
      timelineRef.current.progress(1);
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        }
      });
      timelineRef.current = tl;

      // 1. Initial black screen with staggered typography reveal
      tl.set([textLukeRef.current, textBaffaitRef.current], {
        yPercent: 100,
        opacity: 0,
        rotateX: -20,
      })
      .set(redCurtainRef.current, {
        scaleY: 0,
        transformOrigin: 'top center'
      })
      // Animate text rising up quickly & smoothly
      .to(textLukeRef.current, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.45,
        ease: 'power3.out'
      }, 0.05)
      .to(textBaffaitRef.current, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.5,
        ease: 'power3.out'
      }, 0.1)
      // Brief pause
      .to({}, { duration: 0.15 })
      // 2. Red curtain wipes across the screen
      .to(redCurtainRef.current, {
        scaleY: 1,
        duration: 0.38,
        ease: 'power4.inOut'
      })
      // Change transform origin to bottom so it reveals upwards
      .set(redCurtainRef.current, {
        transformOrigin: 'bottom center'
      })
      // 3. Red curtain folds away
      .to(redCurtainRef.current, {
        scaleY: 0,
        duration: 0.4,
        ease: 'power4.inOut'
      })
      // Fade out the loader container overlay
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out',
        pointerEvents: 'none'
      }, '-=0.2');

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      onClick={handleSkip}
      className="fixed inset-0 z-[100] bg-[#09090b] flex items-center justify-center overflow-hidden select-none cursor-pointer"
      title="Click or tap to skip"
    >
      {/* Red curtain wipe overlay */}
      <div
        ref={redCurtainRef}
        className="absolute inset-0 bg-[#e01428] z-20"
      />

      {/* Intro Typography */}
      <div className="relative z-10 flex flex-wrap items-baseline justify-center gap-2 sm:gap-4 md:gap-6 px-4 text-center">
        <div className="overflow-hidden">
          <span
            ref={textLukeRef}
            className="inline-block font-sans-display font-black text-3xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-tight"
          >
            {HERO_DATA.nameSans}
          </span>
        </div>
        <div className="overflow-hidden">
          <span
            ref={textBaffaitRef}
            className="inline-block font-serif-display italic text-3xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-normal"
          >
            {HERO_DATA.nameSerif}
          </span>
        </div>
      </div>

      {/* Skip indicator */}
      <div className="absolute bottom-6 font-mono-code text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest pointer-events-none">
        Tap to enter
      </div>
    </div>
  );
};
