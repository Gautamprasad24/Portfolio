import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { ytMusic } from '../utils/ytAudio';
import { HERO_DATA } from '../data/portfolioData';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activeSection,
  onHoverStart,
  onHoverEnd
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted() && ytMusic.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Subscribe to YouTube state changes
    const unsub = ytMusic.subscribe((active) => {
      setIsMuted(!active);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsub();
    };
  }, []);

  const handleAudioToggle = async () => {
    // Toggle both YouTube track and Web Audio synthesizer
    const [ytUnmuted, synthUnmuted] = await Promise.all([
      ytMusic.toggleMusic(),
      sound.toggleMute(),
    ]);
    const active = ytUnmuted || synthUnmuted;
    setIsMuted(!active);
  };

  const navLinks = [
    { label: 'WORK', id: 'works' },
    { label: 'INFO', id: 'about' },
    { label: 'LAB', id: 'lab' },
    { label: 'CONTACT', id: 'contact' },
  ];

  return (
    <>
      {/* Floating Bottom / Header Navigation Bar */}
      <header
        className={`fixed z-50 transition-all duration-500 ease-out left-0 right-0 px-4 sm:px-8 md:px-12 ${
          scrolled
            ? 'top-3 md:top-5 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 py-3'
            : 'top-4 md:top-8 py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Identity Branding */}
          <button
            id="nav-logo-btn"
            onClick={() => {
              sound.playClick();
              onNavigate('hero');
            }}
            onMouseEnter={() => {
              sound.playHover();
              onHoverStart?.();
            }}
            onMouseLeave={onHoverEnd}
            className="group flex flex-col text-left transition-all cursor-pointer select-none"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-neutral-500 mb-0.5">
              Identity
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-serif-display italic text-[#f0f0f0] tracking-tight group-hover:text-white transition-colors">
                G. Prasad
              </span>
              <span className="text-[10px] font-mono-code text-neutral-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded">
                {HERO_DATA.version}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-xs uppercase tracking-[0.2em] font-medium text-neutral-400">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => {
                  sound.playClick();
                  onNavigate(link.id);
                }}
                onMouseEnter={() => {
                  sound.playHover();
                  onHoverStart?.();
                }}
                onMouseLeave={onHoverEnd}
                className={`transition-all duration-300 cursor-pointer pb-1 relative ${
                  activeSection === link.id
                    ? 'text-white border-b border-white/40'
                    : 'hover:text-white border-b border-transparent hover:border-white/20'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Nav + Sound */}
          <div className="flex items-center gap-3">
            {/* Desktop Center Socials link tag */}
            <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono-code text-neutral-500 uppercase tracking-widest">
              <a
                href={HERO_DATA.socials[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-300 transition-colors"
              >
                LinkedIn
              </a>
              <span className="text-neutral-700">/</span>
              <a
                href={HERO_DATA.socials[1].url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-300 transition-colors"
              >
                Github
              </a>
            </div>

            {/* Ambient Soundtrack Toggle */}
            <button
              id="audio-toggle-btn"
              onClick={handleAudioToggle}
              onMouseEnter={() => {
                sound.playHover();
                onHoverStart?.();
              }}
              onMouseLeave={onHoverEnd}
              title={isMuted ? "Play Ambient Soundtrack" : "Mute Soundtrack"}
              aria-label={isMuted ? "Turn Ambient Soundtrack ON" : "Mute Soundtrack"}
              className={`px-3 py-1.5 rounded-full border text-xs font-mono-code flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
                isMuted
                  ? 'bg-neutral-900/80 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-[#ff2a3b]/15 border-[#ff2a3b]/50 text-white shadow-[0_0_15px_rgba(255,42,59,0.3)]'
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                    Sound: Off
                  </span>
                </>
              ) : (
                <>
                  {/* Animated Equalizer Wave Bars */}
                  <div className="flex items-center gap-[2.5px] h-3.5 py-0.5">
                    <span className="w-[2.5px] h-full bg-[#ff2a3b] rounded-full animate-[bounce_0.8s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0ms' }} />
                    <span className="w-[2.5px] h-full bg-[#ff2a3b] rounded-full animate-[bounce_0.6s_infinite_ease-in-out_alternate]" style={{ animationDelay: '150ms' }} />
                    <span className="w-[2.5px] h-full bg-[#ff2a3b] rounded-full animate-[bounce_0.9s_infinite_ease-in-out_alternate]" style={{ animationDelay: '300ms' }} />
                    <span className="w-[2.5px] h-full bg-[#ff2a3b] rounded-full animate-[bounce_0.7s_infinite_ease-in-out_alternate]" style={{ animationDelay: '450ms' }} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-white font-semibold">
                    Sound: ON
                  </span>
                </>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#09090b]/95 backdrop-blur-xl flex flex-col justify-between p-8 pt-24 md:hidden animate-in fade-in duration-300">
          <div className="flex flex-col gap-6">
            <span className="font-mono-code text-xs text-white/40 uppercase tracking-widest">Navigation</span>
            {navLinks.map((link, idx) => (
              <button
                key={link.id}
                onClick={() => {
                  sound.playClick();
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className="text-left font-sans-display text-4xl font-bold tracking-tight text-white/90 hover:text-[#ff2a3b] transition-colors flex items-center justify-between py-2 border-b border-white/10"
              >
                <span>{link.label}</span>
                <span className="font-mono-code text-sm text-white/40">0{idx + 1}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-6">
            <span className="font-mono-code text-xs text-white/40 uppercase tracking-widest">Connect</span>
            <div className="flex flex-wrap gap-4 font-mono-code text-xs text-white/80">
              {HERO_DATA.socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#ff2a3b]"
                >
                  {s.name} <ArrowUpRight className="w-3 h-3" />
                </a>
              ))}
            </div>
            
            {/* Mobile Sound toggle */}
            <div className="pt-2">
              <button
                onClick={handleAudioToggle}
                className={`w-full py-3 px-4 rounded-xl border flex items-center justify-between font-mono-code text-xs transition-all ${
                  isMuted
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    : 'bg-[#ff2a3b]/15 border-[#ff2a3b]/50 text-white'
                }`}
              >
                <span>AMBIENT SOUNDTRACK</span>
                <span className="font-bold text-[#ff2a3b]">{isMuted ? 'OFF' : 'PLAYING'}</span>
              </button>
            </div>
            <p className="font-mono-code text-[11px] text-white/40 pt-4">
              Mumbai, India — Full-Stack Developer & MERN Architect
            </p>
          </div>
        </div>
      )}
    </>
  );
};
