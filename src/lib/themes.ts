import React from 'react';

export type ThemeId = 'neutral' | 'summer' | 'winter';

export interface ThemeConfig {
  id: ThemeId;
  nameKa: string;
  nameEn: string;
  subtitle: string;
  emoji: string;
  badge: string;
  description: string;
  confettiColors: string[];
  
  // Background & Ambient Lighting
  mainBgClass: string;
  glowOrbs: Array<{
    className: string;
    style?: React.CSSProperties;
  }>;
  
  // Containers & Glassmorphism
  containerBg: string;
  containerBorder: string;
  containerShadow: string;
  headerBg: string;
  headerBorder: string;
  footerBg: string;
  footerBorder: string;

  // Accents & Buttons
  primaryGradient: string;
  primaryShadow: string;
  secondaryGradient: string;
  stepperGradient: string;
  accentText: string;
  accentBorder: string;
  accentBgLight: string;
  
  // Active Word Card & Gameplay
  cardGradient: string;
  cardBorder: string;
  timerBgNormal: string;
  timerTextNormal: string;
  timerBorderNormal: string;
  countdownGradient: string;
  
  // Category Pill Active
  categoryActiveBg: string;
  categoryActiveBorder: string;
  categoryActiveText: string;
  categoryActiveShadow: string;
  
  // Theme Button in Header
  themeBtnBg: string;
  themeBtnBorder: string;
  themeBtnText: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  neutral: {
    id: 'neutral',
    nameKa: 'ნეიტრალური',
    nameEn: 'Cyber Neon',
    subtitle: 'კლასიკური ნეონი',
    emoji: '⚡',
    badge: 'Classic',
    description: 'მუქი კოსმოსური სტილი ნეონის იისფერი და ვარდისფერი ნათებებით',
    confettiColors: ['#a855f7', '#ec4899', '#3b82f6', '#eab308', '#10b981', '#6366f1'],

    mainBgClass: 'bg-slate-950 text-slate-100',
    glowOrbs: [
      { className: 'absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl' },
      { className: 'absolute top-1/2 -right-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl' },
      { className: 'absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl' },
    ],

    containerBg: 'bg-slate-900/85',
    containerBorder: 'border-slate-800',
    containerShadow: 'shadow-2xl shadow-purple-950/50',
    headerBg: 'bg-slate-900/90',
    headerBorder: 'border-slate-800/80',
    footerBg: 'bg-slate-950/80',
    footerBorder: 'border-slate-800/80',

    primaryGradient: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95',
    primaryShadow: 'shadow-xl shadow-purple-900/40',
    secondaryGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95',
    stepperGradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    accentText: 'text-purple-400',
    accentBorder: 'border-purple-500',
    accentBgLight: 'bg-purple-600/20',

    cardGradient: 'bg-gradient-to-b from-slate-800/95 via-slate-800/90 to-slate-900/95',
    cardBorder: 'border-slate-700/80',
    timerBgNormal: 'bg-slate-900',
    timerTextNormal: 'text-purple-300',
    timerBorderNormal: 'border-slate-800',
    countdownGradient: 'bg-gradient-to-tr from-purple-600 to-pink-600',

    categoryActiveBg: 'bg-purple-600/25',
    categoryActiveBorder: 'border-purple-500',
    categoryActiveText: 'text-purple-200',
    categoryActiveShadow: 'shadow-md shadow-purple-950/50',

    themeBtnBg: 'bg-purple-950/50 hover:bg-purple-900/60',
    themeBtnBorder: 'border-purple-500/40',
    themeBtnText: 'text-purple-300',
  },

  summer: {
    id: 'summer',
    nameKa: 'ზაფხული',
    nameEn: 'Summer Vibes',
    subtitle: 'მზიანი სანაპირო & ტროპიკები',
    emoji: '☀️',
    badge: 'Summer',
    description: 'თბილი მზის ჩასვლა, ოქროსფერი ქვიშა და ზღვის ტროპიკული ენერგია',
    confettiColors: ['#f59e0b', '#f97316', '#fb7185', '#06b6d4', '#10b981', '#fde047'],

    mainBgClass: 'bg-[#0b1329] text-amber-50',
    glowOrbs: [
      { className: 'absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-amber-500/25 rounded-full blur-3xl' },
      { className: 'absolute top-1/3 -right-32 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl' },
      { className: 'absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] bg-teal-500/20 rounded-full blur-3xl' },
    ],

    containerBg: 'bg-slate-900/60 backdrop-blur-2xl',
    containerBorder: 'border-amber-400/35 shadow-[0_20px_60px_rgba(245,158,11,0.18)] ring-1 ring-amber-400/20',
    containerShadow: 'shadow-2xl shadow-orange-950/40',
    headerBg: 'bg-slate-900/65 backdrop-blur-md',
    headerBorder: 'border-amber-500/20',
    footerBg: 'bg-slate-950/70 backdrop-blur-md',
    footerBorder: 'border-amber-500/20',

    primaryGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95',
    primaryShadow: 'shadow-xl shadow-orange-900/40',
    secondaryGradient: 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:opacity-95',
    stepperGradient: 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500',
    accentText: 'text-amber-400',
    accentBorder: 'border-amber-500',
    accentBgLight: 'bg-amber-500/20',

    cardGradient: 'bg-gradient-to-b from-slate-900/75 via-amber-950/35 to-slate-900/80 backdrop-blur-xl',
    cardBorder: 'border-amber-500/40',
    timerBgNormal: 'bg-amber-950/50 backdrop-blur-sm',
    timerTextNormal: 'text-amber-300',
    timerBorderNormal: 'border-amber-500/30',
    countdownGradient: 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500',

    categoryActiveBg: 'bg-amber-500/25 backdrop-blur-sm',
    categoryActiveBorder: 'border-amber-400',
    categoryActiveText: 'text-amber-200',
    categoryActiveShadow: 'shadow-md shadow-amber-950/50',

    themeBtnBg: 'bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-sm',
    themeBtnBorder: 'border-amber-500/40',
    themeBtnText: 'text-amber-300',
  },

  winter: {
    id: 'winter',
    nameKa: 'ზამთარი',
    nameEn: 'Ski Resort',
    subtitle: 'ალპური თოვლი & მწვერვალები',
    emoji: '❄️',
    badge: 'Winter',
    description: 'ალპური სათხილამურო კურორტი, მყინვარები და მფრინავი ფანტელები',
    confettiColors: ['#38bdf8', '#22d3ee', '#818cf8', '#e0f2fe', '#67e8f9', '#a5f3fc'],

    mainBgClass: 'bg-[#07111e] text-cyan-50',
    glowOrbs: [
      { className: 'absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-cyan-500/20 rounded-full blur-3xl' },
      { className: 'absolute top-1/2 -right-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl' },
      { className: 'absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] bg-indigo-500/20 rounded-full blur-3xl' },
    ],

    containerBg: 'bg-slate-950/60 backdrop-blur-2xl',
    containerBorder: 'border-cyan-400/35 shadow-[0_20px_60px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/20',
    containerShadow: 'shadow-2xl shadow-cyan-950/40',
    headerBg: 'bg-slate-900/65 backdrop-blur-md',
    headerBorder: 'border-cyan-500/20',
    footerBg: 'bg-slate-950/70 backdrop-blur-md',
    footerBorder: 'border-cyan-500/20',

    primaryGradient: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:opacity-95',
    primaryShadow: 'shadow-xl shadow-cyan-900/40',
    secondaryGradient: 'bg-gradient-to-r from-emerald-400 to-cyan-600 hover:opacity-95',
    stepperGradient: 'bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500',
    accentText: 'text-cyan-400',
    accentBorder: 'border-cyan-500',
    accentBgLight: 'bg-cyan-500/20',

    cardGradient: 'bg-gradient-to-b from-slate-950/75 via-cyan-950/35 to-slate-950/80 backdrop-blur-xl',
    cardBorder: 'border-cyan-500/40',
    timerBgNormal: 'bg-cyan-950/50 backdrop-blur-sm',
    timerTextNormal: 'text-cyan-300',
    timerBorderNormal: 'border-cyan-500/30',
    countdownGradient: 'bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600',

    categoryActiveBg: 'bg-cyan-500/25 backdrop-blur-sm',
    categoryActiveBorder: 'border-cyan-400',
    categoryActiveText: 'text-cyan-200',
    categoryActiveShadow: 'shadow-md shadow-cyan-950/50',

    themeBtnBg: 'bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur-sm',
    themeBtnBorder: 'border-cyan-500/40',
    themeBtnText: 'text-cyan-300',
  },
};
