import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface CursorProps {
  cursorText?: string;
  cursorVariant?: 'default' | 'hover' | 'project' | 'view' | 'drag';
}

export const Cursor: React.FC<CursorProps> = ({ cursorText = '', cursorVariant = 'default' }) => {
  // Raw mouse position lives in motion values, not React state, so mousemove
  // updates the DOM directly via the animation frame loop instead of causing
  // a full React re-render on every event (this was firing constantly,
  // including while scrolling, and was a major source of jank).
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { damping: 28, stiffness: 350, mass: 0.4 });
  const springY = useSpring(mouseY, { damping: 28, stiffness: 350, mass: 0.4 });

  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible((prev) => (prev ? prev : true));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (isTouch || !isVisible) return null;

  const isProject = cursorVariant === 'project' || cursorVariant === 'view';
  const isHover = cursorVariant === 'hover';
  const isDrag = cursorVariant === 'drag';

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      style={{ x: springX, y: springY }}
      animate={{
        width: isProject ? 80 : isDrag ? 64 : isHover ? 44 : 10,
        height: isProject ? 80 : isDrag ? 64 : isHover ? 44 : 10,
      }}
      transition={{
        type: 'spring',
        damping: 28,
        stiffness: 350,
        mass: 0.4
      }}
    >
      <div
        className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${
          isProject
            ? 'bg-[#ff2a3b] text-white font-mono-code text-[11px] uppercase tracking-wider font-semibold shadow-[0_0_25px_rgba(255,42,59,0.6)]'
            : isDrag
            ? 'bg-white text-black font-mono-code text-[10px] uppercase font-bold tracking-widest'
            : isHover
            ? 'bg-white/20 backdrop-blur-xs border border-white/40 scale-110'
            : 'bg-[#ff2a3b] shadow-[0_0_12px_rgba(255,42,59,0.8)]'
        }`}
      >
        {isProject && (cursorText || 'VIEW')}
        {isDrag && (cursorText || 'DRAG')}
      </div>
    </motion.div>
  );
};
