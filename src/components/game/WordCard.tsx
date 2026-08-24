import React from 'react';
import { ThemeConfig } from '@/lib/themes';
import { ControlMode } from '@/types/game';
import { CheckCircle2, XCircle } from 'lucide-react';

interface WordCardProps {
  currentWord: string;
  activeTheme: ThemeConfig;
  controlMode: ControlMode;
  turnWordsCount: number;
  cardTransform: string;
  cardTransition: string;
  cardOpacity: number;
  cardBoxShadow: string;
  cardBorderColor: string;
  rightProgress: number;
  leftProgress: number;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerCancel?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export const WordCard: React.FC<WordCardProps> = ({
  currentWord,
  activeTheme,
  controlMode,
  turnWordsCount,
  cardTransform,
  cardTransition,
  cardOpacity,
  cardBoxShadow,
  cardBorderColor,
  rightProgress,
  leftProgress,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}) => {
  return (
    <div className="relative w-full max-w-md flex items-center justify-center h-48 sm:h-56">
      {/* Background Deck Card (Physical 3D Stack depth) */}
      <div className="absolute inset-0 bg-slate-900/70 border border-slate-800/80 rounded-3xl transform scale-95 translate-y-2 opacity-50 pointer-events-none shadow-xl" />

      {/* Active Swipeable Card */}
      <div
        onPointerDown={controlMode !== 'buttons' ? onPointerDown : undefined}
        onPointerMove={controlMode !== 'buttons' ? onPointerMove : undefined}
        onPointerUp={controlMode !== 'buttons' ? onPointerUp : undefined}
        onPointerCancel={controlMode !== 'buttons' ? onPointerCancel : undefined}
        style={{
          transform: cardTransform,
          transition: cardTransition,
          opacity: cardOpacity,
          touchAction: controlMode !== 'buttons' ? 'none' : 'auto',
          boxShadow: cardBoxShadow,
          borderColor: cardBorderColor,
        }}
        className={`absolute inset-0 ${activeTheme.cardGradient} border-2 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center select-none ${
          controlMode !== 'buttons' ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        {/* Top Right Stamp (Correct / +1) */}
        <div
          className="absolute top-3.5 right-3.5 rounded-xl border-2 border-emerald-400 bg-emerald-500/30 backdrop-blur-md px-2.5 py-1 text-emerald-300 font-black text-xs sm:text-sm uppercase tracking-wider rotate-12 flex items-center gap-1 shadow-lg pointer-events-none transition-opacity"
          style={{ opacity: rightProgress }}
        >
          <CheckCircle2 className="h-4 w-4" /> სწორი (+1)
        </div>

        {/* Top Left Stamp (Skip) */}
        <div
          className="absolute top-3.5 left-3.5 rounded-xl border-2 border-rose-400 bg-rose-500/30 backdrop-blur-md px-2.5 py-1 text-rose-300 font-black text-xs sm:text-sm uppercase tracking-wider -rotate-12 flex items-center gap-1 shadow-lg pointer-events-none transition-opacity"
          style={{ opacity: leftProgress }}
        >
          <XCircle className="h-4 w-4" /> გამოტოვება
        </div>

        {/* Main Word */}
        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md break-words max-w-full leading-tight">
          {currentWord}
        </span>

        {/* Bottom word count + swipe cue */}
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 font-semibold">
          <span>სიტყვა #{turnWordsCount + 1}</span>
          {controlMode !== 'buttons' && (
            <>
              <span>•</span>
              <span className="text-[11px] text-purple-400/80 font-bold">👈 სვაიპი 👉</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
