import React, { useMemo } from 'react';
import { ThemeId } from '@/lib/themes';

interface ThemeAmbientOverlayProps {
  theme: ThemeId;
}

/* ============================================================================
   DETAILED SVG SNOWFLAKE CRYSTAL PATHS FOR WINTER
   ============================================================================ */

/** Intricate 6-arm Stellar Dendrite Ice Crystal */
const DendriteCrystal: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 6 Main Spoke Branches */}
    <g stroke="white" strokeWidth="1.75" strokeLinecap="round">
      <line x1="24" y1="3" x2="24" y2="45" />
      <line x1="5.8" y1="13.5" x2="42.2" y2="34.5" />
      <line x1="5.8" y1="34.5" x2="42.2" y2="13.5" />
      
      {/* Upper/Lower Sub-Branches */}
      <path d="M24 10 L19 6 M24 10 L29 6 M24 17 L18 13 M24 17 L30 13" />
      <path d="M24 38 L19 42 M24 38 L29 42 M24 31 L18 35 M24 31 L30 35" />
      
      {/* Diagonal Sub-Branches (Top-Left to Bottom-Right) */}
      <path d="M12 17 L7 14 M12 17 L13 22 M18 20.5 L14 16.5 M18 20.5 L18.5 26" />
      <path d="M36 31 L41 34 M36 31 L35 26 M30 27.5 L34 31.5 M30 27.5 L29.5 22" />
      
      {/* Diagonal Sub-Branches (Bottom-Left to Top-Right) */}
      <path d="M12 31 L7 34 M12 31 L13 26 M18 27.5 L14 31.5 M18 27.5 L18.5 22" />
      <path d="M36 17 L41 14 M36 17 L35 22 M30 20.5 L34 16.5 M30 20.5 L29.5 26" />
    </g>
    {/* Center Hexagonal Diamond */}
    <polygon
      points="24,19.5 27.9,21.75 27.9,26.25 24,28.5 20.1,26.25 20.1,21.75"
      fill="rgba(255, 255, 255, 0.4)"
      stroke="white"
      strokeWidth="1.2"
    />
  </svg>
);

/** Hexagonal Star Ice Plate */
const StarCrystal: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g stroke="white" strokeWidth="1.5" strokeLinecap="round">
      <line x1="16" y1="2" x2="16" y2="30" />
      <line x1="3.9" y1="9" x2="28.1" y2="23" />
      <line x1="3.9" y1="23" x2="28.1" y2="9" />
      <polygon
        points="16,8 22.9,12 22.9,20 16,24 9.1,20 9.1,12"
        fill="rgba(190, 242, 255, 0.3)"
        stroke="white"
        strokeWidth="1"
      />
    </g>
  </svg>
);

/** 6-Point Needle Ice Star */
const NeedleCrystal: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g stroke="white" strokeWidth="1.4" strokeLinecap="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <line x1="2.5" y1="6.5" x2="21.5" y2="17.5" />
      <line x1="2.5" y1="17.5" x2="21.5" y2="6.5" />
      <circle cx="12" cy="12" r="2.2" fill="white" />
    </g>
  </svg>
);

/* ============================================================================
   MAIN COMPONENT: THEME AMBIENT OVERLAY
   ============================================================================ */
export const ThemeAmbientOverlay: React.FC<ThemeAmbientOverlayProps> = ({ theme }) => {
  // Generate multi-tiered detailed snowflakes for winter ski resort
  const snowflakes = useMemo(() => {
    // 1. Foreground detailed dendrite & star crystals (Large & animated)
    const foregroundFlakes = Array.from({ length: 16 }).map((_, i) => ({
      id: `fg-${i}`,
      type: (i % 3 === 0 ? 'dendrite' : i % 3 === 1 ? 'star' : 'needle') as 'dendrite' | 'star' | 'needle' | 'soft',
      left: `${(i * 6.25 + (i % 4) * 3) % 96 + 2}%`,
      size: 20 + (i % 4) * 5, // 20px - 35px
      duration: `${7.5 + (i % 5) * 1.5}s`,
      delay: `${(i % 7) * 0.9}s`,
      opacity: 0.9 + (i % 3) * 0.05,
      animationClass: i % 2 === 0 ? 'animate-snowflake-dendrite' : 'animate-snowflake-twirl',
    }));

    // 2. Midground crisp geometric snowflakes
    const midgroundFlakes = Array.from({ length: 24 }).map((_, i) => ({
      id: `mg-${i}`,
      type: (i % 2 === 0 ? 'star' : 'needle') as 'dendrite' | 'star' | 'needle' | 'soft',
      left: `${(i * 4.16 + (i % 5) * 2) % 98 + 1}%`,
      size: 12 + (i % 3) * 3, // 12px - 18px
      duration: `${6 + (i % 6) * 1.2}s`,
      delay: `${(i % 9) * 0.6}s`,
      opacity: 0.75 + (i % 4) * 0.1,
      animationClass: 'animate-snowfall',
    }));

    // 3. Background soft micro snow particles
    const backgroundFlakes = Array.from({ length: 30 }).map((_, i) => ({
      id: `bg-${i}`,
      type: 'soft' as 'dendrite' | 'star' | 'needle' | 'soft',
      left: `${(i * 3.33 + (i % 7) * 1.5) % 98 + 1}%`,
      size: 4 + (i % 4) * 2, // 4px - 10px
      duration: `${5 + (i % 5) * 1.1}s`,
      delay: `${(i % 11) * 0.4}s`,
      opacity: 0.45 + (i % 3) * 0.15,
      animationClass: 'animate-snowfall',
    }));

    return [...foregroundFlakes, ...midgroundFlakes, ...backgroundFlakes];
  }, []);

  // Generate warm tropical sun sparkles for summer
  const sparkles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.57 + (i % 7) * 3) % 94 + 3}%`,
      top: `${(i * 6.2 + (i % 5) * 11) % 88 + 6}%`,
      size: Math.max(4, (i % 4) * 3 + 4),
      duration: `${3.2 + (i % 5) * 1.1}s`,
      delay: `${(i % 8) * 0.5}s`,
      opacity: 0.4 + (i % 4) * 0.18,
    }));
  }, []);

  /* --------------------------------------------------------------------------
     WINTER SKI RESORT (winter.jpg + Detailed Snowflakes)
     -------------------------------------------------------------------------- */
  if (theme === 'winter') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
        {/* Winter Ski Resort Photographic Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('/assets/winter.jpg')" }}
        />

        {/* Ambient Darkening & Frosty Blue Atmosphere Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-[#08152c]/40 to-[#030712]/80" />
        <div className="absolute inset-0 bg-cyan-950/20 backdrop-brightness-90" />

        {/* Multi-layered Detailed Falling Crystal Snowflakes */}
        {snowflakes.map((flake) => {
          return (
            <div
              key={flake.id}
              className={`absolute ${flake.animationClass}`}
              style={{
                left: flake.left,
                top: '-30px',
                opacity: flake.opacity,
                animationDuration: flake.duration,
                animationDelay: flake.delay,
              }}
            >
              {flake.type === 'dendrite' && (
                <DendriteCrystal size={flake.size} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
              )}
              {flake.type === 'star' && (
                <StarCrystal size={flake.size} className="drop-shadow-[0_0_6px_rgba(186,230,253,0.9)]" />
              )}
              {flake.type === 'needle' && (
                <NeedleCrystal size={flake.size} className="drop-shadow-[0_0_5px_rgba(255,255,255,0.85)]" />
              )}
              {flake.type === 'soft' && (
                <div
                  className="rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.85)]"
                  style={{ width: flake.size, height: flake.size }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  /* --------------------------------------------------------------------------
     SUMMER VIBES (summer.jpg + Golden Sparkles)
     -------------------------------------------------------------------------- */
  if (theme === 'summer') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
        {/* Summer Caribbean Beach Photographic Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('/assets/summer.jpg')" }}
        />

        {/* Ambient Warm Sunset Atmosphere & Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#091124]/50 via-[#1a173b]/30 to-[#091124]/75" />
        <div className="absolute inset-0 bg-amber-950/15 backdrop-brightness-95" />

        {/* Warm Golden Floating Sparkles & Light Shimmer */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-white animate-summer-sparkle"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              width: sparkle.size,
              height: sparkle.size,
              opacity: sparkle.opacity,
              animationDuration: sparkle.duration,
              animationDelay: sparkle.delay,
              boxShadow: '0 0 12px rgba(251, 191, 36, 0.95), 0 0 24px rgba(245, 158, 11, 0.6)',
            }}
          />
        ))}
      </div>
    );
  }

  /* --------------------------------------------------------------------------
     NEUTRAL THEME (CYBER NEON)
     -------------------------------------------------------------------------- */
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {/* Cyber Grid Ambient Nebula Pulses */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-purple-600/15 blur-3xl animate-pulse"
        style={{ animationDuration: '6s' }}
      />
    </div>
  );
};

export default ThemeAmbientOverlay;
