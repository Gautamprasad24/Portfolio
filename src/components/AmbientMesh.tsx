import React, { useEffect, useRef } from 'react';

interface AmbientMeshProps {
  intensity?: number;
}

export const AmbientMesh: React.FC<AmbientMeshProps> = ({ intensity = 1.0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.3, targetX: 0.5, targetY: 0.3 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    // Downscale internal canvas resolution by factor of 2 for 4x performance gain with soft ambient blur
    const scale = window.innerWidth < 768 ? 0.35 : 0.5;
    let width = (canvas.width = Math.floor(window.innerWidth * scale));
    let height = (canvas.height = Math.floor(window.innerHeight * scale));

    const handleResize = () => {
      if (!canvas) return;
      const s = window.innerWidth < 768 ? 0.35 : 0.5;
      width = canvas.width = Math.floor(window.innerWidth * s);
      height = canvas.height = Math.floor(window.innerHeight * s);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = e.clientY / window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Aurora blob simulation (scaled to lower resolution canvas)
    let time = 0;
    const blobs = [
      { x: 0.4, y: 0.25, radius: 450 * scale, color: 'rgba(255, 30, 50, 0.42)', vx: 0.0008, vy: 0.0006 },
      { x: 0.65, y: 0.35, radius: 400 * scale, color: 'rgba(220, 10, 40, 0.32)', vx: -0.0007, vy: 0.0009 },
      { x: 0.5, y: 0.5, radius: 520 * scale, color: 'rgba(180, 0, 30, 0.25)', vx: 0.0005, vy: -0.0007 },
      { x: 0.3, y: 0.45, radius: 320 * scale, color: 'rgba(255, 70, 70, 0.18)', vx: -0.0006, vy: 0.0005 },
    ];

    let isDocumentVisible = true;
    const handleVisibility = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Respect reduced-motion preference and cap this decorative background
    // to ~30fps. It doesn't need 60fps smoothness, and halving its frame
    // rate frees up meaningful main-thread time during scrolling.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frameInterval = 1000 / 30;
    let lastFrameTime = 0;

    const render = (now: number) => {
      if (!isDocumentVisible || prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (now - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = now;

      time += 0.01;
      
      // Smooth lerp mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, width, height);

      // Render glowing soft orbs
      blobs.forEach((blob, i) => {
        const dynamicX = (blob.x + Math.sin(time + i * 1.5) * 0.06 + (mouseRef.current.x - 0.5) * 0.12) * width;
        const dynamicY = (blob.y + Math.cos(time + i * 1.2) * 0.06 + (mouseRef.current.y - 0.5) * 0.12) * height;
        const dynamicRadius = blob.radius * (1 + Math.sin(time * 0.8 + i) * 0.08) * intensity;

        const grad = ctx.createRadialGradient(
          dynamicX,
          dynamicY,
          5,
          dynamicX,
          dynamicY,
          dynamicRadius
        );

        grad.addColorStop(0, blob.color);
        grad.addColorStop(0.5, blob.color.replace(/[\d.]+\)$/, '0.12)'));
        grad.addColorStop(1, 'rgba(8, 8, 10, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(dynamicX, dynamicY, dynamicRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full opacity-90 transition-opacity duration-1000" />
      {/* Noise filter */}
      <div className="absolute inset-0 bg-noise opacity-50 mix-blend-overlay pointer-events-none" />
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,8,10,0.75)_100%)] pointer-events-none" />
    </div>
  );
};
