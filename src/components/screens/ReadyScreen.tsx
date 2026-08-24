import React from 'react';
import { Team, TeamColor } from '@/types/game';
import { PartyChallenge } from '@/lib/challenges';
import { playButtonTapSound } from '@/lib/sounds';
import { Swords, Sparkles, Play } from 'lucide-react';

interface ReadyScreenProps {
  isTieBreaker: boolean;
  roundNumber: number;
  currentTeamIndex: number;
  currentTeam: Team;
  teamTheme: TeamColor;
  winningScore: number;
  partyModeEnabled: boolean;
  currentChallenge: PartyChallenge | null;
  sortedTeams: Team[];
  soundEnabled: boolean;
  onStartCountdown: () => void;
}

export const ReadyScreen: React.FC<ReadyScreenProps> = ({
  isTieBreaker,
  roundNumber,
  currentTeamIndex,
  currentTeam,
  teamTheme,
  winningScore,
  partyModeEnabled,
  currentChallenge,
  sortedTeams,
  soundEnabled,
  onStartCountdown,
}) => {
  return (
    <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between text-center space-y-3 overflow-y-auto max-h-full">
      {/* Top Banner */}
      <div className="space-y-0.5 shrink-0">
        {isTieBreaker ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black animate-pulse">
            <Swords className="h-3.5 w-3.5" /> ტაი-ბრეიკი (გადამწყვეტი რაუნდი)
          </div>
        ) : (
          <div className="text-[11px] font-bold text-purple-400 uppercase tracking-widest">
            რაუნდი #{roundNumber}
          </div>
        )}
        <h2 className="text-xs font-medium text-slate-400">მოემზადოს გუნდი</h2>
      </div>

      {/* Active Team Hero Card (Compact & Modern) */}
      <div className="py-3 px-4 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/95 border border-slate-700/60 shadow-lg space-y-2.5 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-left">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${teamTheme.bg} flex items-center justify-center text-xl font-black text-white shadow-md shadow-purple-950/50 shrink-0`}
            >
              {currentTeamIndex + 1}
            </div>
            <div className="truncate">
              <h3 className="text-xl sm:text-2xl font-black text-white truncate max-w-[190px] sm:max-w-[280px]">
                {currentTeam.name}
              </h3>
              <p className="text-xs text-slate-400 font-semibold">
                მიმდინარე ქულა: <span className="text-amber-400 font-bold">{currentTeam.score}</span> / {winningScore}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {Math.round((currentTeam.score / winningScore) * 100)}%
            </span>
          </div>
        </div>

        {/* Progress bar to winning score */}
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${teamTheme.bg} transition-all duration-500`}
            style={{
              width: `${Math.min(100, Math.max(5, (currentTeam.score / winningScore) * 100))}%`,
            }}
          />
        </div>
      </div>

      {/* Party Challenge Spotlight Card (If active) */}
      {partyModeEnabled && currentChallenge && (
        <div className="bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-purple-950/70 p-3 rounded-2xl border border-purple-500/40 shadow-md text-left space-y-1.5 shrink-0 animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Party გამოწვევა (+2 ბონუსი)
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${currentChallenge.badgeColor}`}>
              {currentChallenge.categoryName}
            </span>
          </div>
          <div className="flex items-start gap-2.5 pt-0.5">
            <span className="text-2xl sm:text-3xl shrink-0">{currentChallenge.emoji}</span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">{currentChallenge.title}</h4>
              <p className="text-[11px] sm:text-xs font-medium text-slate-200 leading-snug">
                {currentChallenge.instruction}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mini Standings */}
      <div className="bg-slate-950/50 p-2.5 rounded-2xl border border-slate-800/60 space-y-1.5 shrink-0">
        <div className="text-[11px] font-bold text-slate-400 text-left">მიმდინარე ცხრილი:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {sortedTeams.map((t, idx) => (
            <div
              key={t.id}
              className={`flex items-center justify-between p-1.5 px-2.5 rounded-xl text-[11px] font-semibold border ${
                t.id === currentTeam.id
                  ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span className="truncate max-w-[85px]">
                {idx + 1}. {t.name}
              </span>
              <span className="font-bold text-slate-200">{t.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ready Start Button */}
      <button
        onClick={() => {
          playButtonTapSound(soundEnabled);
          onStartCountdown();
        }}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-black text-lg sm:text-xl shadow-xl shadow-emerald-950/60 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 shrink-0"
      >
        <Play className="h-5 w-5 fill-white" /> რაუნდის დაწყება
      </button>
    </div>
  );
};
