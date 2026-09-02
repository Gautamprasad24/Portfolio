import React, { useEffect, useRef } from 'react';
import { HERO_DATA } from '../data/portfolioData';
import { sound } from '../utils/audio';

interface SignatureFooterProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
}

export const SignatureFooter: React.FC<SignatureFooterProps> = ({
  onHoverStart,
  onHoverEnd,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Red Point-Cloud Hands Reaching Canvas (Video 00:00 - 00:06)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = !document.hidden;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        cancelAnimationFrame(animationFrameId);
        render();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 500;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for interactive red matrix distortion
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Create high-density point matrix outlining two hands reaching towards each other
    interface HandPoint {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      isTip?: boolean;
    }

    const points: HandPoint[] = [];
    const isMobile = window.innerWidth < 768;

    // Left hand points (reaching from left edge to center)
    const generateHand = (isLeft: boolean) => {
      const startX = isLeft ? width * 0.05 : width * 0.95;
      const targetX = isLeft ? width * 0.46 : width * 0.54;
      const centerY = height * 0.48;

      const segments = isMobile ? 60 : 100;
      for (let i = 0; i < segments; i++) {
        const t = i / segments; // 0 (wrist) to 1 (fingertip)
        const xPos = startX + (targetX - startX) * t;

        // Hand silhouette width profile (wrist -> palm -> fingers -> index fingertip)
        let profile = Math.sin(t * Math.PI) * (height * 0.22);
        if (t > 0.75) {
          // Narrowing index finger
          profile = (1 - t) * (height * 0.35);
        }

        // Density points per cross-section
        const count = isMobile ? Math.floor(Math.random() * 3 + 2) : Math.floor(Math.random() * 4 + 3);
        for (let k = 0; k < count; k++) {
          const offsetFactor = (Math.random() - 0.5) * 2;
          const yPos = centerY + offsetFactor * profile + (Math.sin(t * 4) * 15);
          
          points.push({
            x: xPos + (Math.random() - 0.5) * 8,
            y: yPos + (Math.random() - 0.5) * 8,
            baseX: xPos,
            baseY: yPos,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            radius: t > 0.85 ? 1.4 : Math.random() * 1.2 + 0.8,
            alpha: Math.random() * 0.6 + 0.4,
            isTip: t > 0.88,
          });
        }
      }
    };

    generateHand(true);  // Left Hand
    generateHand(false); // Right Hand

    // Extra floating matrix sparks
    const sparkCount = isMobile ? 15 : 30;
    for (let s = 0; s < sparkCount; s++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.8,
        baseX: Math.random() * width,
        baseY: Math.random() * height * 0.8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.1 + 0.5,
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    let time = 0;
    const render = () => {
      if (!isVisible) return;
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connective threads between near points
      ctx.lineWidth = 0.5;
      const maxDistSq = isMobile ? 1000 : 1600;
      for (let i = 0; i < points.length; i += (isMobile ? 3 : 2)) {
        const p1 = points[i];
        for (let j = i + 1; j < Math.min(i + (isMobile ? 5 : 8), points.length); j++) {
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 42, 59, ${0.25 * (1 - dist / 40)})`;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw red particle dots with glow
      points.forEach((p) => {
        // Idle gentle breathing wave
        const wave = Math.sin(time + p.baseX * 0.01) * 2;
        p.baseY += p.vy;
        if (Math.abs(p.baseY - p.y) > 6) p.vy *= -1;

        let targetX = p.baseX;
        let targetY = p.baseY + wave;

        // Interactive mouse repellent
        const mdx = targetX - mouseX;
        const mdy = targetY - mouseY;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 120) {
          const force = (120 - mDist) / 120;
          targetX += (mdx / mDist) * force * 35;
          targetY += (mdy / mDist) * force * 35;
        }

        p.x += (targetX - p.x) * 0.1;
        p.y += (targetY - p.y) * 0.1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isTip ? '#ff2a3b' : `rgba(255, 42, 59, ${p.alpha})`;
        ctx.shadowColor = '#ff2a3b';
        ctx.shadowBlur = p.isTip ? 12 : 5;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <footer className="relative w-full min-h-[70vh] sm:min-h-[85vh] flex flex-col justify-between pt-12 sm:pt-16 pb-8 sm:pb-10 px-4 sm:px-12 md:px-20 bg-black overflow-hidden select-none border-t border-white/5">
      {/* Background Red Particle Hands (Video 00:00 - 00:06) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto opacity-85 z-0"
      />

      {/* Top 3-Column Navigation Grid (Video 00:00 - 00:06) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pb-8 text-xs font-mono-code">
        {/* Col 1: Email & Copyright */}
        <div className="space-y-1">
          <a
            href={`mailto:${HERO_DATA.email}`}
            onMouseEnter={() => {
              sound.playHover();
              onHoverStart?.('EMAIL', 'hover');
            }}
            onMouseLeave={onHoverEnd}
            className="text-white hover:text-[#ff2a3b] transition-colors block text-xs sm:text-sm"
          >
            {HERO_DATA.email}
          </a>
          <p className="text-neutral-400">© 2026</p>
        </div>

        {/* Col 2: Socials Stack (GITHUB, LINKEDIN, BEHANCE) */}
        <div className="flex flex-col gap-1.5 sm:items-center text-neutral-300">
          <a
            href={HERO_DATA.socials[1].url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => {
              sound.playHover();
              onHoverStart?.('GITHUB', 'hover');
            }}
            onMouseLeave={onHoverEnd}
            className="hover:text-white transition-colors"
          >
            GITHUB
          </a>
          <a
            href={HERO_DATA.socials[0].url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => {
              sound.playHover();
              onHoverStart?.('LINKEDIN', 'hover');
            }}
            onMouseLeave={onHoverEnd}
            className="hover:text-white transition-colors"
          >
            LINKEDIN
          </a>
          {/* <a
            href="https://behance.net"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => {
              sound.playHover();
              onHoverStart?.('BEHANCE', 'hover');
            }}
            onMouseLeave={onHoverEnd}
            className="hover:text-white transition-colors text-neutral-400 hover:text-white"
          >
            BEHANCE
          </a> */}
        </div>

        {/* Col 3: Section Jump Stack (WORK, INFO, CONTACT) */}
        <div className="flex flex-col gap-1.5 sm:items-end text-neutral-300">
          <a
            href="#works"
            onClick={() => sound.playClick()}
            onMouseEnter={() => {
              sound.playHover();
              onHoverStart?.('WORK', 'hover');
            }}
            onMouseLeave={onHoverEnd}
            className="hover:text-white transition-colors"
          >
            WORK
          </a>
          <a
            href="#about"
            onClick={() => sound.playClick()}
            onMouseEnter={() => {
              sound.playHover();
              onHoverStart?.('INFO', 'hover');
            }}
            onMouseLeave={onHoverEnd}
            className="hover:text-white transition-colors"
          >
            INFO
          </a>
          <a
            href="#contact"
            onClick={() => sound.playClick()}
            onMouseEnter={() => {
              sound.playHover();
              onHoverStart?.('CONTACT', 'hover');
            }}
            onMouseLeave={onHoverEnd}
            className="hover:text-white transition-colors"
          >
            CONTACT
          </a>
        </div>
      </div>

      {/* Bottom Typography: "Gautam Prasad." */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-12 sm:pt-20 pb-2 sm:pb-4">
        <div
          onMouseEnter={() => onHoverStart?.('GAUTAM PRASAD', 'hover')}
          onMouseLeave={onHoverEnd}
          className="w-full flex flex-wrap items-baseline justify-center gap-x-3 sm:gap-x-6 md:gap-x-8"
        >
          {/* Left Name: Gautam */}
          <h1 className="font-sans-display text-[clamp(2.5rem,8.5vw,10.5rem)] font-black leading-none text-[#f0f0f0] tracking-tight cursor-default select-none whitespace-nowrap">
            Gautam
          </h1>

          {/* Right Name: Prasad. */}
          <h1 className="font-serif-display italic font-normal text-[clamp(2.5rem,8.5vw,10.5rem)] leading-none text-white tracking-tight cursor-default select-none whitespace-nowrap">
            Prasad<span className="text-[#ff2a3b]">.</span>
          </h1>
        </div>
      </div>
    </footer>
  );
};
