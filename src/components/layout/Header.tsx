import React from 'react';
import LogoSvg from '@/lib/logoSvg';
import { ThemeId, ThemeConfig } from '@/lib/themes';
import { GameState } from '@/types/game';
import { Volume2, VolumeX, Pause, Play, HelpCircle, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentTheme: ThemeId;
  activeTheme: ThemeConfig;
  soundEnabled: boolean;
  gameState: GameState;
  onOpenThemeModal: () => void;
  onToggleSound: () => void;
  onOpenRulesModal: () => void;
  onTogglePause: () => void;
  onOpenConfirmRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  activeTheme,
  soundEnabled,
  gameState,
  onOpenThemeModal,
  onToggleSound,
  onOpenRulesModal,
  onTogglePause,
  onOpenConfirmRestart,
}) => {
  return (
    <header
      className={`px-4 py-2.5 sm:px-6 sm:py-3.5 ${activeTheme.headerBg} border-b ${activeTheme.headerBorder} flex items-center justify-between shrink-0`}
    >
      <LogoSvg className="h-9 sm:h-10" theme={currentTheme} />

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Theme Switcher Button */}
        <button
          onClick={onOpenThemeModal}
          aria-label="Change Theme"
          title={`თემა: ${activeTheme.nameKa} (${activeTheme.nameEn})`}
          className={`p-1.5 sm:p-2 px-2.5 sm:px-3 rounded-xl border flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${activeTheme.themeBtnBg} ${activeTheme.themeBtnBorder} ${activeTheme.themeBtnText}`}
        >
          <span className="text-base sm:text-lg leading-none">{activeTheme.emoji}</span>
          <span className="hidden xs:inline text-xs font-black tracking-tight">{activeTheme.nameKa}</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          aria-label="Toggle Sound"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors active:scale-95"
        >
          {soundEnabled ? (
            <Volume2 className="h-5 w-5 text-amber-400" />
          ) : (
            <VolumeX className="h-5 w-5 text-slate-500" />
          )}
        </button>

        {/* Rules Button */}
        <button
          onClick={onOpenRulesModal}
          aria-label="Game Rules"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors active:scale-95"
        >
          <HelpCircle className={`h-5 w-5 ${activeTheme.accentText}`} />
        </button>

        {/* In-Game Action Buttons */}
        {(gameState === 'playing' || gameState === 'paused') && (
          <>
            <button
              onClick={onTogglePause}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors active:scale-95"
              aria-label="Pause / Play"
            >
              {gameState === 'paused' ? (
                <Play className="h-5 w-5 text-emerald-400 fill-emerald-400" />
              ) : (
                <Pause className="h-5 w-5 text-amber-400 fill-amber-400" />
              )}
            </button>

            <button
              onClick={onOpenConfirmRestart}
              className="p-2 sm:p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
              aria-label="Restart Match"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
