import React, { useState } from 'react';
import { HERO_DATA } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { ArrowUpRight, Copy, Check, Mail } from 'lucide-react';
import gautamPortrait from '../assets/images/gautam.webp';

interface ContactCurtainSectionProps {
  onHoverStart?: (text?: string, variant?: 'default' | 'hover' | 'project' | 'view' | 'drag') => void;
  onHoverEnd?: () => void;
}

export const ContactCurtainSection: React.FC<ContactCurtainSectionProps> = ({
  onHoverStart,
  onHoverEnd,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText(HERO_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="contact"
      className="relative w-full pt-12 pb-0 bg-black"
    >
      {/* High-Contrast Full-Width Curved White Surface (Video 00:00 - 00:01) */}
      <div className="w-full rounded-t-[32px] sm:rounded-t-[60px] rounded-b-[32px] sm:rounded-b-[60px] bg-[#f4f4f4] text-[#0a0a0a] pt-12 sm:pt-24 pb-16 sm:pb-28 px-5 sm:px-12 md:px-16 lg:px-20 shadow-2xl relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          
          {/* Left Column: Giant "Contact" & Social Links (Video 00:00 - 00:01) */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full min-h-[300px] sm:min-h-[460px]">
            <div>
              <h2 className="font-sans-display text-[clamp(3.2rem,11vw,8.5rem)] font-black tracking-tight text-black leading-none">
                Contact
              </h2>
            </div>

            {/* Bottom Left Links: GitHub & LinkedIn (Video 00:00 - 00:01) */}
            <div className="pt-8 sm:pt-20 space-y-4">
              <div className="flex flex-col gap-2.5 sm:gap-3 font-sans-display text-xl sm:text-3xl font-semibold text-black">
                <a
                  href={HERO_DATA.socials[1].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => {
                    sound.playHover();
                    onHoverStart?.('GITHUB', 'hover');
                  }}
                  onMouseLeave={onHoverEnd}
                  className="hover:text-[#ff2a3b] transition-colors inline-flex items-center gap-2 group w-fit cursor-pointer"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
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
                  className="hover:text-[#ff2a3b] transition-colors inline-flex items-center gap-2 group w-fit cursor-pointer"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </a>
              </div>

              {/* Direct Mail Line */}
              <div className="pt-3">
                <button
                  onClick={handleCopyEmail}
                  onMouseEnter={() => {
                    sound.playHover();
                    onHoverStart?.('COPY EMAIL', 'hover');
                  }}
                  onMouseLeave={onHoverEnd}
                  className="font-mono-code text-xs sm:text-sm text-neutral-600 hover:text-black transition-colors flex items-center gap-2 cursor-pointer group break-all text-left"
                >
                  <Mail className="w-4 h-4 text-[#ff2a3b] shrink-0" />
                  <span>{HERO_DATA.email}</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 ml-1 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 ml-1 transition-opacity shrink-0" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Paragraph & 3D Red Sculpture Card (Video 00:00 - 00:01) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row items-center sm:items-end justify-center lg:justify-end gap-6 sm:gap-10">
            {/* Editorial Serif Note (Video 00:00 - 00:01) */}
            <div className="max-w-[320px] text-left sm:text-right md:text-left space-y-3 sm:space-y-4">
              <p className="font-serif-display italic text-sm sm:text-lg text-black/85 leading-snug">
                Looking for a full-time role as a Software Engineer or Full-Stack MERN Developer. Eager to join an innovative team and contribute to ambitious projects.
              </p>
              <p className="font-serif-display italic text-xs sm:text-base text-black/60 leading-snug">
                I'm available for high-impact production engineering worldwide, on ambitious web architectures and international collaborations.
              </p>
            </div>

            {/* 3D Red Classical Sculpture Card with 4 Corner Crosshairs (Video 00:00 - 00:01) */}
            <div
              onMouseEnter={() => {
                sound.playHover();
                onHoverStart?.('COLLABORATE', 'hover');
              }}
              onMouseLeave={onHoverEnd}
              className="relative w-48 sm:w-72 md:w-80 aspect-[4/5] rounded-none bg-[#960010] shadow-2xl overflow-hidden cursor-pointer group select-none shrink-0"
            >
              {/* Gautam Prasad Portrait Artwork with dramatic crimson lighting and 4 corner crosshairs */}
              <div className="relative w-full h-full bg-[#140003] overflow-hidden flex items-center justify-center">
                <img
                  src={gautamPortrait}
                  alt="Gautam Prasad - Software Developer"
                  loading="lazy"
                  decoding="async"
                  width="320"
                  height="400"
                  className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700 brightness-95 contrast-110 hardware-accel"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#80000a] via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-red-950/20 mix-blend-color" />
              </div>

              {/* 4 Precision Crosshair "+" Markers (Video 00:00 - 00:01) */}
              <div className="absolute top-3 left-3 font-mono-code text-sm font-light text-white/90 select-none pointer-events-none drop-shadow">
                +
              </div>
              <div className="absolute top-3 right-3 font-mono-code text-sm font-light text-white/90 select-none pointer-events-none drop-shadow">
                +
              </div>
              <div className="absolute bottom-3 left-3 font-mono-code text-sm font-light text-white/90 select-none pointer-events-none drop-shadow">
                +
              </div>
              <div className="absolute bottom-3 right-3 font-mono-code text-sm font-light text-white/90 select-none pointer-events-none drop-shadow">
                +
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
