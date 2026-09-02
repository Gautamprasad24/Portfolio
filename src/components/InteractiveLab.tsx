import React, { useRef, useEffect, useState } from 'react';
import { sound } from '../utils/audio';
import { Sparkles, RefreshCw, Wand2 } from 'lucide-react';

interface InteractiveLabProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({
  onHoverStart,
  onHoverEnd
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activePreset, setActivePreset] = useState<'particles' | 'typography' | 'attractor'>('particles');
  const [interactionCount, setInteractionCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);
    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 450;
    };

    window.addEventListener('resize', handleResize);

    const mouse = {
      x: width / 2,
      y: height / 2,
      isDown: false,
      radius: 120
    };

    // Particle nodes for physics
    const numParticles = 65;
    const particles: Array<{
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      label?: string;
    }> = [];

    const labels = ['GSAP', 'GLSL', 'REACT', 'MOTION', 'V3.0', 'MATH', 'LENIS', 'LIGHT', 'EASE', 'EMOTION'];

    for (let i = 0; i < numParticles; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 4 + 2,
        color: i % 4 === 0 ? '#ff2a3b' : i % 3 === 0 ? '#ff7043' : '#ffffff',
        label: i < labels.length ? labels[i] : undefined
      });
    }

    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onPointerDown = () => {
      mouse.isDown = true;
      sound.playClick();
      setInteractionCount(c => c + 1);
    };

    const onPointerUp = () => {
      mouse.isDown = false;
    };

    canvas.addEventListener('mousemove', onPointerMove);
    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.fillStyle = 'rgba(10, 10, 14, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Grid background dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      const step = 40;
      for (let x = step; x < width; x += step) {
        for (let y = step; y < height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.strokeStyle = `rgba(255, 42, 59, ${0.2 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & render particles
      particles.forEach((p) => {
        // Physics with mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          const push = mouse.isDown ? -8 : 4;
          p.vx -= Math.cos(angle) * force * push;
          p.vy -= Math.sin(angle) * force * push;
        }

        // Float movement
        p.x += p.vx;
        p.y += p.vy;

        // Friction & damping
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Natural soft drift
        p.x += Math.sin(time + p.baseX) * 0.3;
        p.y += Math.cos(time + p.baseY) * 0.3;

        // Boundary bounce
        if (p.x < 10) { p.x = 10; p.vx *= -1; }
        if (p.x > width - 10) { p.x = width - 10; p.vx *= -1; }
        if (p.y < 10) { p.y = 10; p.vy *= -1; }
        if (p.y > height - 10) { p.y = height - 10; p.vy *= -1; }

        // Render Particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // If label exists, render kinetic tag
        if (p.label) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillText(p.label, p.x + 8, p.y + 4);
        }
      });

      // Mouse attractor ring
      ctx.strokeStyle = mouse.isDown ? '#ff2a3b' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.isDown ? 30 : 60, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onPointerMove);
      canvas.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activePreset]);

  return (
    <section id="lab" className="relative w-full py-24 px-6 sm:px-12 md:px-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div>
            <div className="flex items-center gap-2 font-mono-code text-xs text-neutral-500 uppercase tracking-[0.25em] mb-2">
              <span className="text-white">●</span>
              <span>Experimental Canvas</span>
            </div>
            <h2 className="font-sans-display text-4xl sm:text-6xl font-bold tracking-tight text-[#f0f0f0]">
              Kinetic Lab
            </h2>
          </div>
          <div className="flex items-center gap-3 font-mono-code text-xs text-neutral-400">
            <span>Interactions: {interactionCount}</span>
            <span className="text-neutral-700">/</span>
            <span>Click & Drag canvas nodes</span>
          </div>
        </div>

        {/* Interactive Sandbox Container */}
        <div
          onMouseEnter={() => onHoverStart?.('DRAG', 'drag')}
          onMouseLeave={onHoverEnd}
          className="relative w-full h-[480px] rounded-3xl border border-neutral-800 bg-[#09090c] overflow-hidden shadow-2xl group"
        >
          <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

          {/* Floating Canvas UI Overlay */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 font-mono-code text-[11px] text-neutral-300 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Real-Time Physics Engine</span>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setActivePreset(p => p === 'particles' ? 'attractor' : 'particles');
                }}
                className="font-mono-code text-xs text-neutral-300 bg-neutral-900/80 hover:bg-neutral-800 px-3.5 py-1.5 rounded-full border border-neutral-800 backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Nodes</span>
              </button>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-wider">
              [X: Physics Forces / Y: Kinetic Damping]
            </span>
            <span className="font-mono-code text-[11px] text-neutral-400">
              60 FPS GPU Accelerated
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
