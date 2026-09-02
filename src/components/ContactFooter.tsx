import React, { useState, useEffect } from 'react';
import { HERO_DATA } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { Copy, Check, ArrowUp, ArrowUpRight, Clock, Globe } from 'lucide-react';

interface ContactFooterProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
  onScrollToTop?: () => void;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({
  onHoverStart,
  onHoverEnd,
  onScrollToTop
}) => {
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState('');

  // Calculate real-time Vannes / Paris (CET/CEST) time
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setLocalTime(new Intl.DateTimeFormat('en-GB', options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(HERO_DATA.email);
    sound.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer id="contact" className="relative w-full pt-28 pb-16 px-6 sm:px-12 md:px-16 border-t border-white/10 bg-[#070707] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Contact Header */}
        <div className="flex items-center gap-2 font-mono-code text-xs text-neutral-500 uppercase tracking-[0.25em] mb-6">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>Collaboration & Inquiry</span>
        </div>

        {/* Massive Headline */}
        <div className="pb-16 border-b border-white/10">
          <h2 className="font-sans-display text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-[#f0f0f0] leading-none">
            Let's create <br className="hidden sm:inline" />
            <span className="font-serif-display italic font-normal text-white">something</span> memorable.
          </h2>

          {/* Magnetic Email Copy Bar */}
          <div className="pt-12 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              onClick={handleCopyEmail}
              onMouseEnter={() => {
                sound.playHover();
                onHoverStart?.('COPY', 'hover');
              }}
              onMouseLeave={onHoverEnd}
              className="group flex items-center justify-between sm:justify-start gap-6 px-8 py-5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 text-white transition-all duration-300 cursor-pointer shadow-lg"
            >
              <div className="text-left">
                <span className="font-mono-code text-[11px] text-neutral-500 uppercase tracking-[0.2em] block">
                  Direct Channel
                </span>
                <span className="font-sans-display text-xl sm:text-2xl font-semibold tracking-tight text-[#f0f0f0] group-hover:text-white transition-colors">
                  {HERO_DATA.email}
                </span>
              </div>
              <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-white group-hover:text-black transition-colors text-neutral-300">
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </div>
            </button>

            {copied && (
              <span className="font-mono-code text-xs text-neutral-300 animate-in fade-in">
                ✓ Email copied to clipboard!
              </span>
            )}
          </div>
        </div>

        {/* Live Info, Time, & Socials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-white/10 text-xs font-mono-code">
          {/* Location & Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-500 uppercase tracking-[0.2em]">
              <Globe className="w-3.5 h-3.5" />
              <span>Location</span>
            </div>
            <p className="text-[#f0f0f0] text-sm font-sans-display font-medium">
              {HERO_DATA.location}
            </p>
            <div className="flex items-center gap-2 text-neutral-400 pt-1">
              <Clock className="w-3.5 h-3.5 text-white" />
              <span>{localTime || '14:20:00'} CET (Local Time)</span>
            </div>
          </div>

          {/* Status & Availability */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-500 uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Current Status</span>
            </div>
            <p className="text-[#f0f0f0] text-sm font-sans-display font-medium">
              Available for Q3/Q4
            </p>
            <p className="text-neutral-400">
              Open to bespoke creative engineering and select agency collaborations.
            </p>
          </div>

          {/* Socials Column */}
          <div className="space-y-2">
            <span className="text-neutral-500 uppercase tracking-[0.2em] block">Network</span>
            <div className="flex flex-col gap-2">
              {HERO_DATA.socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => {
                    sound.playHover();
                    onHoverStart?.();
                  }}
                  onMouseLeave={onHoverEnd}
                  className="hover:text-white text-neutral-400 transition-colors flex items-center justify-between group"
                >
                  <span className="tracking-wider">{s.name}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Back to top */}
          <div className="flex flex-col justify-between items-start md:items-end">
            <span className="text-neutral-500 uppercase tracking-[0.2em]">Navigation</span>
            <button
              onClick={() => {
                sound.playClick();
                onScrollToTop?.();
              }}
              onMouseEnter={() => {
                sound.playHover();
                onHoverStart?.('TOP', 'hover');
              }}
              onMouseLeave={onHoverEnd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all cursor-pointer mt-4 md:mt-0"
            >
              <span className="uppercase tracking-widest text-[11px]">Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Copyright & Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-code text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Luke Baffait. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Built with GSAP & Bold Typography</span>
            <span className="text-white">●</span>
            <span>Version 3.0</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
