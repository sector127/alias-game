import { TeamColor } from '@/types/game';

// Team color palettes for multi-team setup
export const TEAM_COLORS: TeamColor[] = [
  {
    bg: 'from-purple-600 to-indigo-600',
    border: 'border-purple-400',
    light: 'bg-purple-500/10 text-purple-600 dark:text-purple-300',
    badge: 'bg-purple-600 text-white',
    accent: 'text-purple-600',
  },
  {
    bg: 'from-rose-500 to-pink-600',
    border: 'border-rose-400',
    light: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
    badge: 'bg-rose-600 text-white',
    accent: 'text-rose-600',
  },
  {
    bg: 'from-amber-500 to-orange-600',
    border: 'border-amber-400',
    light: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
    badge: 'bg-amber-600 text-white',
    accent: 'text-amber-600',
  },
  {
    bg: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-400',
    light: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    badge: 'bg-emerald-600 text-white',
    accent: 'text-emerald-600',
  },
  {
    bg: 'from-cyan-500 to-blue-600',
    border: 'border-cyan-400',
    light: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
    badge: 'bg-cyan-600 text-white',
    accent: 'text-cyan-600',
  },
  {
    bg: 'from-fuchsia-500 to-violet-600',
    border: 'border-fuchsia-400',
    light: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300',
    badge: 'bg-fuchsia-600 text-white',
    accent: 'text-fuchsia-600',
  },
];

export const DEFAULT_TEAM_NAMES = [
  'არჩევანი',
  'არადანი',
  'ფენიქსი',
  'მგლები',
  'ალმასები',
  'ჩემპიონები',
];

export const ROUND_TIME_OPTIONS = [30, 45, 60, 90];
export const WINNING_SCORE_OPTIONS = [20, 30, 50, 75];

export const CONTROL_MODE_OPTIONS = [
  { id: 'both' as const, label: '📱 ორივე' },
  { id: 'swipe' as const, label: '👆 სვაიპი' },
  { id: 'buttons' as const, label: '🔘 ღილაკი' },
];
