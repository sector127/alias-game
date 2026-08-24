import React from 'react';
import { GameState, ControlMode, Team, TeamColor } from '@/types/game';
import { ThemeConfig } from '@/lib/themes';
import { PartyChallenge } from '@/lib/challenges';
import { WordCard } from '@/components/game/WordCard';
import { useCardSwipe } from '@/hooks/useCardSwipe';
import { playButtonTapSound } from '@/lib/sounds';
import {
  Clock,
  Flame,
  Pause,
  Smartphone,
  XCircle,
  CheckCircle2,
  MoveHorizontal,
} from 'lucide-react';

interface PlayingScreenProps {
  gameState: GameState;
  currentTeamIndex: number;
  currentTeam: Team;
  teamTheme: TeamColor;
  timeLeft: number;
  partyModeEnabled: boolean;
  currentChallenge: PartyChallenge | null;
  currentStreak: number;
  currentWord: string;
  turnWordsCount: number;
  controlMode: ControlMode;
  soundEnabled: boolean;
  activeTheme: ThemeConfig;
  onCorrect: () => void;
  onSkip: () => void;
  onTogglePause: () => void;
  onToggleControlMode: () => void;
}

export const PlayingScreen: React.FC<PlayingScreenProps> = ({
  gameState,
  currentTeamIndex,
  currentTeam,
  teamTheme,
  timeLeft,
  partyModeEnabled,
  currentChallenge,
  currentStreak,
  currentWord,
  turnWordsCount,
  controlMode,
  soundEnabled,
  activeTheme,
  onCorrect,
  onSkip,
  onTogglePause,
  onToggleControlMode,
}) => {
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUpOrCancel,
    rightProgress,
    leftProgress,
    cardTransform,
    cardTransition,
    cardOpacity,
    cardBoxShadow,
    cardBorderColor,
  } = useCardSwipe({
    onCorrect,
    onSkip,
    disabled: gameState !== 'playing' || controlMode === 'buttons',
  });

  return (
    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
      {/* Top Bar: Team info + Timer + Round score */}
      <div className="flex items-center justify-between bg-slate-950/60 p-3 sm:p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-xl ${teamTheme.badge} flex items-center justify-center text-sm font-black`}>
            {currentTeamIndex + 1}
          </span>
          <div>
            <div className="text-sm font-bold text-white truncate max-w-[130px] sm:max-w-[180px]">
              {currentTeam.name}
            </div>
            <div className="text-[11px] text-slate-400">სულ: {currentTeam.score} ქულა</div>
          </div>
        </div>

        {/* Timer Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-lg transition-all ${
            timeLeft <= 10
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse scale-105'
              : `${activeTheme.timerBgNormal} ${activeTheme.timerTextNormal} border ${activeTheme.timerBorderNormal}`
          }`}
        >
          <Clock className={`h-5 w-5 ${timeLeft <= 10 ? 'text-rose-400 animate-spin' : activeTheme.accentText}`} />
          <span>{timeLeft}</span>
        </div>

        {/* Round Live Score Counter */}
        <div className="text-right">
          <div className="text-xs font-semibold text-slate-400">რაუნდის ქულა</div>
          <div
            className={`text-lg font-black ${
              currentTeam.roundScore > 0
                ? 'text-emerald-400'
                : currentTeam.roundScore < 0
                ? 'text-rose-400'
                : 'text-slate-300'
            }`}
          >
            {currentTeam.roundScore > 0 ? `+${currentTeam.roundScore}` : currentTeam.roundScore}
          </div>
        </div>
      </div>

      {/* Party Challenge Floating Reminder Badge */}
      {partyModeEnabled && currentChallenge && gameState === 'playing' && (
        <div className="mx-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-950/90 via-slate-900/95 to-purple-950/90 border border-purple-500/50 shadow-lg text-xs font-black text-purple-200 animate-in fade-in max-w-full truncate">
          <span className="text-base shrink-0">{currentChallenge.emoji}</span>
          <span className="truncate">{currentChallenge.instruction}</span>
        </div>
      )}

      {/* Streak Counter Badge */}
      {currentStreak >= 3 && (
        <div className="mx-auto inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black animate-bounce">
          <Flame className="h-3.5 w-3.5 fill-amber-400" /> {currentStreak} სწორი ზედიზედ!
        </div>
      )}

      {/* Main Word Card Area with 3D Tinder Swipe Physics */}
      <div className="flex-1 flex flex-col items-center justify-center my-1 sm:my-3 relative select-none w-full">
        {gameState === 'paused' ? (
          <div className="text-center space-y-3 py-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Pause className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black text-white">თამაში დაპაუზებულია</h3>
            <button
              onClick={() => {
                playButtonTapSound(soundEnabled);
                onTogglePause();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors active:scale-95 shadow-lg shadow-emerald-950/50"
            >
              გაგრძელება
            </button>
          </div>
        ) : (
          <WordCard
            currentWord={currentWord}
            activeTheme={activeTheme}
            controlMode={controlMode}
            turnWordsCount={turnWordsCount}
            cardTransform={cardTransform}
            cardTransition={cardTransition}
            cardOpacity={cardOpacity}
            cardBoxShadow={cardBoxShadow}
            cardBorderColor={cardBorderColor}
            rightProgress={rightProgress}
            leftProgress={leftProgress}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUpOrCancel}
            onPointerCancel={handlePointerUpOrCancel}
          />
        )}
      </div>

      {/* In-Game Control Mode Pill & Desktop Hints */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
        {/* Quick toggle mode button */}
        <button
          onClick={() => {
            playButtonTapSound(soundEnabled);
            onToggleControlMode();
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-white transition-colors active:scale-95"
        >
          <Smartphone className="h-3.5 w-3.5 text-purple-400" />
          <span>
            მართვა:{' '}
            <strong className="text-purple-300 font-bold">
              {controlMode === 'both' ? 'ორივე' : controlMode === 'swipe' ? 'სვაიპი' : 'ღილაკები'}
            </strong>
          </span>
        </button>

        {/* Desktop Hints */}
        <div className="hidden sm:flex items-center gap-2 text-slate-500 font-medium">
          <span>Space: გამოტოვება</span>
          <span>•</span>
          <span>Enter: სწორი</span>
        </div>
      </div>

      {/* Action Buttons: Skip & Correct (Visible when controlMode is 'both' or 'buttons') */}
      {controlMode !== 'swipe' ? (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
          {/* Skip Button */}
          <button
            onClick={onSkip}
            disabled={gameState === 'paused'}
            className="py-4 sm:py-5 rounded-2xl bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-950/50 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <XCircle className="h-5 w-5" />
            <span>გამოტოვება</span>
          </button>

          {/* Correct Button */}
          <button
            onClick={onCorrect}
            disabled={gameState === 'paused'}
            className="py-4 sm:py-5 rounded-2xl bg-gradient-to-b from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base sm:text-lg shadow-lg shadow-emerald-950/50 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>სწორი (+1)</span>
          </button>
        </div>
      ) : (
        /* Swipe Only Gesture Guide Bar */
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs font-bold text-slate-400 animate-in fade-in">
          <div className="flex items-center gap-1.5 text-rose-400">
            <XCircle className="h-4 w-4" />
            <span>👈 გამოტოვება</span>
          </div>
          <div className="flex items-center gap-1 text-purple-400/80 text-[11px]">
            <MoveHorizontal className="h-3.5 w-3.5" />
            <span>გაასრიალეთ</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span>სწორი 👉</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );
};
