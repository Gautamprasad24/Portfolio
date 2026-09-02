import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { IntroLoader } from './components/IntroLoader';
import { AmbientMesh } from './components/AmbientMesh';
import { Cursor } from './components/Cursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutManifestoSection } from './components/AboutManifestoSection';
import { RibbonProjectsSection } from './components/RibbonProjectsSection';
import { FloatingGallerySection } from './components/FloatingGallerySection';
import { SkillsAccordionSection } from './components/SkillsAccordionSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactCurtainSection } from './components/ContactCurtainSection';
import { SignatureFooter } from './components/SignatureFooter';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'project' | 'view' | 'drag'>('default');

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll and GSAP integration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  // Update active section on scroll
  useEffect(() => {
    const sections = ['hero', 'about', 'works', 'gallery', 'skills', 'experience', 'lab', 'contact'];
    
    const handleScroll = () => {
      const scrollY = window.scrollY + 300;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'hero') {
      lenisRef.current?.scrollTo(0, { duration: 1.4 });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      lenisRef.current?.scrollTo(el, { offset: -40, duration: 1.4 });
    }
  };

  const handleHoverStart = (text: string = '', variant: 'default' | 'hover' | 'project' | 'view' | 'drag' = 'hover') => {
    setCursorText(text);
    setCursorVariant(variant);
  };

  const handleHoverEnd = () => {
    setCursorText('');
    setCursorVariant('default');
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f0f0f0] overflow-x-hidden font-body selection:bg-white selection:text-black">
      {/* Intro Loader Animation (Video 00:00 - 00:01) */}
      {!loaderComplete && (
        <IntroLoader onComplete={() => setLoaderComplete(true)} />
      )}

      {/* Custom Interactive Magnetic Cursor */}
      <Cursor cursorText={cursorText} cursorVariant={cursorVariant} />

      {/* Atmospheric Ambient Aurora Fluid Mesh */}
      <AmbientMesh intensity={1.1} />

      {/* Navigation Header */}
      <Navbar
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onHoverStart={() => handleHoverStart('', 'hover')}
        onHoverEnd={handleHoverEnd}
      />

      {/* Main Content Experience */}
      <main className="relative z-10">
        {/* 1. Hero Section with Split Kinetic Typography and Pinned Statue Portal Expansion (Video 00:00 - 00:04) */}
        <HeroSection
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onExploreClick={() => handleNavigate('works')}
        />

        {/* 2. About & Manifesto Section with Kinetic Word-by-Word Scroll Reveal & Red Portrait (Video 00:04 - 00:07) */}
        <AboutManifestoSection
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onContactClick={() => handleNavigate('contact')}
        />

        {/* 4. Sinuous Red Ribbon & Dynamic Laptop Device Showcase for Gautam's Projects (Video 00:08 - 00:13) */}
        <RibbonProjectsSection
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
        />

        {/* 5. Floating Mosaic Gallery Orbiting "Each project is a chance to learn..." (Video 00:14 - 00:22) */}
        <FloatingGallerySection
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
        />

        {/* 6. Skills Accordion with Red Arrow Action (Video 00:23 - 00:27) */}
        <SkillsAccordionSection
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onContactClick={() => handleNavigate('contact')}
        />

        {/* 7. Awards & Misc Table (Video 00:07 - 00:11) */}
        <ExperienceSection
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
        />

        {/* 8. High-Contrast White Sheet Contact Inquiry (Video 00:12 - 00:14) */}
        <ContactCurtainSection
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
        />

        {/* 9. Signature Outro with Red Particle Constellation Hands & Gautam Prasad Typography (Video 00:15 - 00:17) */}
        <SignatureFooter
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
        />
      </main>
    </div>
  );
}
