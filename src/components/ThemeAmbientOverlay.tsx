import React, { useMemo } from 'react';
import { ThemeId } from '@/lib/themes';

interface ThemeAmbientOverlayProps {
  theme: ThemeId;
}

/* ============================================================================
   DETAILED SVG SNOWFLAKE CRYSTAL PATHS
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
   SCENIC BACKGROUND 1: CARIBBEAN BEACH WITH PALMS & SUNSET
   ============================================================================ */
const CaribbeanBeachScenery: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Tropical Sunset Atmosphere Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#091124] via-[#1a173b] to-[#2c1328]" />

      {/* 2. Radiant Setting Sun with Ambient Halo & Rays */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-b from-amber-300/35 via-orange-500/25 to-rose-600/0 blur-3xl pointer-events-none" />
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-32 sm:w-44 h-32 sm:h-44 rounded-full bg-gradient-to-tr from-yellow-100 via-amber-300 to-orange-400 opacity-80 shadow-[0_0_80px_rgba(251,191,36,0.8)]" />

      {/* 3. Tropical Birds / Seagulls soaring */}
      <svg className="absolute top-[14%] right-[22%] w-24 h-12 text-amber-200/50" viewBox="0 0 100 50" fill="none">
        <path d="M10 25 Q20 15 30 25 Q40 15 50 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M55 18 Q62 10 70 18 Q78 10 85 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M75 28 Q80 22 85 28 Q90 22 95 28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      {/* 4. Distant Caribbean Islands & Mountain Silhouettes */}
      <svg
        className="absolute bottom-[24%] inset-x-0 w-full h-36 opacity-75"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0 160 Q180 80 340 140 Q480 90 620 155 Q780 70 940 135 Q1080 100 1200 150 L1200 200 L0 200 Z"
          fill="#1c1f3d"
        />
        <path
          d="M0 175 Q150 120 380 165 Q600 110 820 170 Q1040 130 1200 175 L1200 200 L0 200 Z"
          fill="#16294a"
        />
      </svg>

      {/* 5. Caribbean Turquoise Ocean with Animated Waves */}
      <div className="absolute bottom-0 inset-x-0 h-[28%] overflow-hidden">
        {/* Deep ocean base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e4b68] via-[#0d6174] to-[#0f766e] opacity-85" />
        
        {/* Ocean Wave Layers */}
        <svg
          className="absolute -top-6 inset-x-0 w-[120%] -left-[10%] h-20 text-cyan-400/30 animate-ocean-wave"
          viewBox="0 0 1400 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 Q175 15 350 40 T700 40 T1050 40 T1400 40 L1400 100 L0 100 Z"
            fill="currentColor"
          />
        </svg>
        <svg
          className="absolute top-2 inset-x-0 w-[120%] -left-[5%] h-20 text-teal-300/25 animate-ocean-wave"
          style={{ animationDuration: '6s', animationDirection: 'reverse' }}
          viewBox="0 0 1400 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 45 Q175 25 350 45 T700 45 T1050 45 T1400 45 L1400 100 L0 100 Z"
            fill="currentColor"
          />
        </svg>

        {/* Golden Sand Beach Shore */}
        <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#c28339] via-[#d97706]/70 to-transparent" />
      </div>

      {/* 6. Left Tropical Palm Tree (Detailed Silhouette with Fronds & Coconuts) */}
      <div className="absolute bottom-0 -left-6 sm:left-0 w-64 sm:w-80 h-[480px] sm:h-[560px] animate-palm-left pointer-events-none opacity-90">
        <svg viewBox="0 0 300 500" className="w-full h-full" fill="none">
          {/* Curved Palm Trunk */}
          <path
            d="M50 500 Q70 340 130 180 Q150 130 180 90"
            stroke="#451a03"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M50 500 Q70 340 130 180 Q150 130 180 90"
            stroke="#78350f"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Trunk Texture Rings */}
          {[160, 220, 280, 340, 400, 460].map((y, i) => (
            <line
              key={i}
              x1={40 + i * 18}
              y1={y}
              x2={65 + i * 18}
              y2={y - 8}
              stroke="#291204"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ))}

          {/* Coconuts Cluster */}
          <circle cx="172" cy="98" r="9" fill="#291204" />
          <circle cx="186" cy="95" r="9.5" fill="#451a03" />
          <circle cx="178" cy="108" r="8.5" fill="#361505" />

          {/* Detailed Palm Fronds */}
          {/* Top-left sweeping frond */}
          <path
            d="M180 90 Q120 40 30 50 Q100 80 180 90"
            fill="#15803d"
            stroke="#166534"
            strokeWidth="2"
          />
          {/* Top-right arched frond */}
          <path
            d="M180 90 Q220 30 290 60 Q230 85 180 90"
            fill="#16a34a"
            stroke="#15803d"
            strokeWidth="2"
          />
          {/* Left drooping frond */}
          <path
            d="M180 90 Q90 90 20 150 Q100 140 180 90"
            fill="#166534"
            stroke="#14532d"
            strokeWidth="2"
          />
          {/* Right drooping frond */}
          <path
            d="M180 90 Q250 100 300 170 Q240 140 180 90"
            fill="#22c55e"
            stroke="#16a34a"
            strokeWidth="2"
          />
          {/* Center high crown frond */}
          <path
            d="M180 90 Q170 10 140 0 Q170 40 180 90"
            fill="#4ade80"
            stroke="#22c55e"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* 7. Right Tropical Palm Tree (Framing top-right) */}
      <div className="absolute top-0 -right-8 sm:right-0 w-60 sm:w-72 h-[420px] sm:h-[480px] animate-palm-right pointer-events-none opacity-85">
        <svg viewBox="0 0 300 400" className="w-full h-full" fill="none">
          {/* Palm Trunk coming from top right */}
          <path
            d="M320 -20 Q240 60 190 140"
            stroke="#451a03"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M320 -20 Q240 60 190 140"
            stroke="#78350f"
            strokeWidth="15"
            strokeLinecap="round"
          />

          {/* Coconuts */}
          <circle cx="196" cy="146" r="8" fill="#291204" />
          <circle cx="184" cy="142" r="8.5" fill="#451a03" />

          {/* Fronds cascading down */}
          <path
            d="M190 140 Q110 120 40 170 Q120 180 190 140"
            fill="#16a34a"
            stroke="#15803d"
            strokeWidth="2"
          />
          <path
            d="M190 140 Q130 190 60 270 Q140 230 190 140"
            fill="#15803d"
            stroke="#166534"
            strokeWidth="2"
          />
          <path
            d="M190 140 Q220 220 190 310 Q210 230 190 140"
            fill="#14532d"
            stroke="#052e16"
            strokeWidth="2"
          />
          <path
            d="M190 140 Q90 80 30 70 Q110 110 190 140"
            fill="#4ade80"
            stroke="#22c55e"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

/* ============================================================================
   SCENIC BACKGROUND 2: ALPS SKI RESORT WITH SNOWY PEAKS & CHALET
   ============================================================================ */
const AlpsSkiResortScenery: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Alpine Twilight Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#08152c] to-[#0d274c]" />

      {/* 2. Twinkling Stars */}
      <div className="absolute inset-x-0 top-0 h-[40%] opacity-70">
        {[
          { top: '6%', left: '12%', size: '2px' },
          { top: '10%', left: '28%', size: '3px' },
          { top: '4%', left: '46%', size: '2px' },
          { top: '12%', left: '68%', size: '3px' },
          { top: '7%', left: '84%', size: '2.5px' },
          { top: '18%', left: '18%', size: '2px' },
          { top: '22%', left: '88%', size: '2px' },
          { top: '15%', left: '52%', size: '3.5px' },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-100 shadow-[0_0_6px_#fff] animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDuration: `${2.5 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      {/* 3. Luminous Aurora Borealis Wave */}
      <div className="absolute top-[4%] inset-x-0 h-44 bg-gradient-to-r from-teal-500/0 via-emerald-400/20 to-cyan-400/0 blur-3xl animate-aurora pointer-events-none" />
      <div className="absolute top-[8%] inset-x-0 h-32 bg-gradient-to-r from-indigo-500/0 via-cyan-400/20 to-emerald-400/0 blur-2xl animate-aurora pointer-events-none" style={{ animationDelay: '3s' }} />

      {/* 4. Distant Alps Majestic Jagged Peaks Massif */}
      <svg
        className="absolute bottom-[28%] inset-x-0 w-full h-64 opacity-80"
        viewBox="0 0 1200 350"
        preserveAspectRatio="none"
      >
        {/* Background towering peaks */}
        <polygon
          points="0,350 140,120 280,350 420,90 580,350 760,70 940,350 1100,110 1200,350"
          fill="#111c38"
        />
        {/* Snow-caps on distant peaks */}
        <polygon points="140,120 120,160 160,160" fill="#e0f2fe" opacity="0.85" />
        <polygon points="420,90 380,150 460,150" fill="#e0f2fe" opacity="0.85" />
        <polygon points="760,70 710,140 810,140" fill="#f0f9ff" opacity="0.9" />
        <polygon points="1100,110 1060,170 1140,170" fill="#e0f2fe" opacity="0.85" />
      </svg>

      {/* 5. Midground Alps Mountain Ridges with Ski Slopes */}
      <svg
        className="absolute bottom-[10%] inset-x-0 w-full h-72 opacity-90"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        {/* Rocky & Snowy slopes */}
        <path
          d="M0 400 L0 180 L220 80 L440 260 L680 60 L920 240 L1150 110 L1200 160 L1200 400 Z"
          fill="#1e293b"
        />
        {/* Snowfield covers */}
        <path
          d="M220 80 L180 140 L260 140 Z M680 60 L610 150 L750 150 Z M1150 110 L1100 170 L1190 170 Z"
          fill="#f8fafc"
          opacity="0.95"
        />
        {/* Ski Slopes / Piste Tracks carving down */}
        <path
          d="M680 120 Q620 220 540 280 Q480 330 400 400"
          stroke="#e2e8f0"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M220 110 Q280 200 360 290 Q400 340 440 400"
          stroke="#cbd5e1"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>

      {/* 6. Ski Lift Cable & Moving Red Gondola Cabin */}
      <div className="absolute top-[28%] sm:top-[24%] inset-x-0 h-32 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1000 120" preserveAspectRatio="none">
          {/* Cable line spanning peaks */}
          <line x1="50" y1="20" x2="950" y2="100" stroke="#94a3b8" strokeWidth="2.5" opacity="0.6" />
          {/* Pylon / Tower */}
          <line x1="500" y1="58" x2="500" y2="120" stroke="#475569" strokeWidth="3" opacity="0.8" />
          <line x1="485" y1="58" x2="515" y2="58" stroke="#475569" strokeWidth="3" opacity="0.8" />
        </svg>

        {/* Animated Ski Gondola Cabin */}
        <div className="absolute top-[32px] left-[32%] sm:left-[40%] animate-gondola">
          <svg width="36" height="42" viewBox="0 0 36 42" fill="none">
            {/* Hanger arm to cable */}
            <line x1="18" y1="0" x2="18" y2="14" stroke="#94a3b8" strokeWidth="2" />
            {/* Gondola Cabin (Charming Alpine Red) */}
            <rect x="4" y="14" width="28" height="24" rx="6" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
            {/* Illuminated Windows with Skiers glow */}
            <rect x="7" y="18" width="10" height="9" rx="2" fill="#fef08a" opacity="0.9" />
            <rect x="19" y="18" width="10" height="9" rx="2" fill="#fef08a" opacity="0.9" />
            {/* Ski Rack on bottom */}
            <line x1="8" y1="38" x2="28" y2="38" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 7. Alpine Pine Forest & Cozy Ski Chalet */}
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none">
        {/* Snow Base */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#09152a] via-[#0f2347] to-transparent" />

        {/* Pine Trees Silhouette along lower slopes */}
        <svg className="absolute bottom-6 left-2 sm:left-8 w-44 h-32 text-[#0b1b36]" viewBox="0 0 180 120">
          <polygon points="30,120 15,70 45,70" fill="currentColor" />
          <polygon points="30,75 18,35 42,35" fill="currentColor" />
          <polygon points="30,40 22,10 38,10" fill="currentColor" />
          {/* Snow on tree */}
          <polygon points="30,40 20,40 30,10 40,40" fill="#f8fafc" opacity="0.9" />

          <polygon points="80,120 60,60 100,60" fill="currentColor" />
          <polygon points="80,65 65,25 95,25" fill="currentColor" />
          <polygon points="80,30 70,0 90,0" fill="currentColor" />
          <polygon points="80,30 68,30 80,0 92,30" fill="#f8fafc" opacity="0.9" />
        </svg>

        {/* Cozy Alpine Ski Lodge / Chalet (Right side) */}
        <div className="absolute bottom-4 right-4 sm:right-12 w-32 h-28">
          <svg viewBox="0 0 120 100" className="w-full h-full" fill="none">
            {/* Wooden Chalet Body */}
            <rect x="25" y="45" width="70" height="45" fill="#451a03" stroke="#291204" strokeWidth="2" />
            {/* Snow-Covered Steep Alpine Roof */}
            <polygon points="60,10 10,48 110,48" fill="#1e293b" />
            <polygon points="60,6 6,48 114,48" fill="#f8fafc" />
            {/* Chimney & Smoke */}
            <rect x="75" y="16" width="10" height="20" fill="#78350f" />
            <circle cx="80" cy="10" r="4" fill="#cbd5e1" className="animate-smoke" />
            <circle cx="83" cy="4" r="6" fill="#94a3b8" className="animate-smoke" style={{ animationDelay: '1.2s' }} />
            {/* Warm Glowing Windows */}
            <rect x="35" y="55" width="14" height="14" rx="2" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" className="shadow-[0_0_12px_#fbbf24]" />
            <rect x="70" y="55" width="14" height="14" rx="2" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" className="shadow-[0_0_12px_#fbbf24]" />
            {/* Door */}
            <rect x="52" y="65" width="14" height="25" fill="#291204" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   MAIN COMPONENT: THEME AMBIENT OVERLAY
   ============================================================================ */
export const ThemeAmbientOverlay: React.FC<ThemeAmbientOverlayProps> = ({ theme }) => {
  // Generate multi-tiered detailed snowflakes for winter ski resort
  const snowflakes = useMemo(() => {
    // 1. Foreground detailed dendrite & star crystals (Large & animated)
    const foregroundFlakes = Array.from({ length: 14 }).map((_, i) => ({
      id: `fg-${i}`,
      type: (i % 3 === 0 ? 'dendrite' : i % 3 === 1 ? 'star' : 'needle') as 'dendrite' | 'star' | 'needle' | 'soft',
      left: `${(i * 7.14 + (i % 4) * 3) % 96 + 2}%`,
      size: 20 + (i % 4) * 5, // 20px - 35px
      duration: `${7.5 + (i % 5) * 1.5}s`,
      delay: `${(i % 7) * 0.9}s`,
      opacity: 0.85 + (i % 3) * 0.05,
      animationClass: i % 2 === 0 ? 'animate-snowflake-dendrite' : 'animate-snowflake-twirl',
    }));

    // 2. Midground crisp geometric snowflakes
    const midgroundFlakes = Array.from({ length: 22 }).map((_, i) => ({
      id: `mg-${i}`,
      type: (i % 2 === 0 ? 'star' : 'needle') as 'dendrite' | 'star' | 'needle' | 'soft',
      left: `${(i * 4.54 + (i % 5) * 2) % 98 + 1}%`,
      size: 12 + (i % 3) * 3, // 12px - 18px
      duration: `${6 + (i % 6) * 1.2}s`,
      delay: `${(i % 9) * 0.6}s`,
      opacity: 0.65 + (i % 4) * 0.1,
      animationClass: 'animate-snowfall',
    }));

    // 3. Background soft micro snow particles
    const backgroundFlakes = Array.from({ length: 28 }).map((_, i) => ({
      id: `bg-${i}`,
      type: 'soft' as 'dendrite' | 'star' | 'needle' | 'soft',
      left: `${(i * 3.57 + (i % 7) * 1.5) % 98 + 1}%`,
      size: 4 + (i % 4) * 2, // 4px - 10px
      duration: `${5 + (i % 5) * 1.1}s`,
      delay: `${(i % 11) * 0.4}s`,
      opacity: 0.35 + (i % 3) * 0.15,
      animationClass: 'animate-snowfall',
    }));

    return [...foregroundFlakes, ...midgroundFlakes, ...backgroundFlakes];
  }, []);

  // Generate warm tropical sun sparkles for summer
  const sparkles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.16 + (i % 7) * 3) % 94 + 3}%`,
      top: `${(i * 6.5 + (i % 5) * 11) % 88 + 6}%`,
      size: Math.max(4, (i % 4) * 3 + 4),
      duration: `${3.2 + (i % 5) * 1.1}s`,
      delay: `${(i % 8) * 0.5}s`,
      opacity: 0.35 + (i % 4) * 0.18,
    }));
  }, []);

  /* --------------------------------------------------------------------------
     WINTER SKI RESORT
     -------------------------------------------------------------------------- */
  if (theme === 'winter') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
        {/* Scenic Alps Ski Resort Backdrop */}
        <AlpsSkiResortScenery />

        {/* Multi-layered Detailed Falling Snowflakes */}
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
                <DendriteCrystal size={flake.size} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
              )}
              {flake.type === 'star' && (
                <StarCrystal size={flake.size} className="drop-shadow-[0_0_6px_rgba(186,230,253,0.85)]" />
              )}
              {flake.type === 'needle' && (
                <NeedleCrystal size={flake.size} className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              )}
              {flake.type === 'soft' && (
                <div
                  className="rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
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
     SUMMER VIBES
     -------------------------------------------------------------------------- */
  if (theme === 'summer') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
        {/* Scenic Caribbean Beach Backdrop with Palms & Waves */}
        <CaribbeanBeachScenery />

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
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.95), 0 0 20px rgba(245, 158, 11, 0.5)',
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
      {/* Gentle Cyber Grid Ambient Pulses */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-purple-600/15 blur-3xl animate-pulse"
        style={{ animationDuration: '6s' }}
      />
    </div>
  );
};

export default ThemeAmbientOverlay;
