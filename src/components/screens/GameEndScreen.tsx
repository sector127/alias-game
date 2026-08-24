import React from 'react';
import ReactConfetti from 'react-confetti';
import { Team } from '@/types/game';
import { ThemeConfig } from '@/lib/themes';
import { playButtonTapSound } from '@/lib/sounds';
import { Trophy, RefreshCw, Users } from 'lucide-react';

interface GameEndScreenProps {
  windowSize: { width: number; height: number };
  activeTheme: ThemeConfig;
  sortedTeams: Team[];
  totalMatchCorrect: number;
  roundNumber: number;
  winningScore: number;
  soundEnabled: boolean;
  onRematch: () => void;
  onResetToSetup: () => void;
}

export const GameEndScreen: React.FC<GameEndScreenProps> = ({
  windowSize,
  activeTheme,
  sortedTeams,
  totalMatchCorrect,
  roundNumber,
  winningScore,
  soundEnabled,
  onRematch,
  onResetToSetup,
}) => {
  return (
    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-6 text-center overflow-y-auto max-h-[calc(88vh-80px)]">
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={350}
        gravity={0.15}
        colors={activeTheme.confettiColors}
      />

      {/* Trophy & Winner Badge */}
      <div className="space-y-3 pt-2">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-2xl shadow-amber-500/40 animate-bounce">
          <Trophy className="h-10 w-10 text-slate-950" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
            🎉 გამარჯვებული გუნდი!
          </span>
          <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
            {sortedTeams[0].name}
          </h2>
          <p className="text-lg font-extrabold text-slate-200">
            საბოლოო ქულა: <span className="text-amber-400">{sortedTeams[0].score}</span>
          </p>
        </div>
      </div>

      {/* Full Podium / Leaderboard */}
      <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
        <div className="text-xs font-bold text-slate-400 text-left">საბოლოო შედეგები:</div>
        <div className="space-y-2">
          {sortedTeams.map((team, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={team.id}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  isFirst
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950'
                        : idx === 1
                        ? 'bg-slate-400 text-slate-950'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-bold text-sm truncate max-w-[150px]">{team.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-400 font-semibold">✓ {team.totalCorrect}</span>
                  <span className="text-rose-400 font-semibold">✕ {team.totalSkipped}</span>
                  <span className="font-black text-sm text-white">{team.score} ქულა</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match Stats Box */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 text-center">
        <div>
          <div className="text-[10px] text-slate-400">სულ გამოცნობილი</div>
          <div className="text-base font-black text-emerald-400">{totalMatchCorrect}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">რაუნდები</div>
          <div className={`text-base font-black ${activeTheme.accentText}`}>{roundNumber}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">მიზანი</div>
          <div className="text-base font-black text-amber-400">{winningScore} ქულა</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => {
            playButtonTapSound(soundEnabled);
            onRematch();
          }}
          className={`py-4 rounded-2xl ${activeTheme.secondaryGradient} text-white font-black text-base shadow-xl shadow-emerald-950/60 active:scale-[0.99] transition-all flex items-center justify-center gap-2`}
        >
          <RefreshCw className="h-5 w-5" /> რევანში (იგივე გუნდები)
        </button>

        <button
          onClick={() => {
            playButtonTapSound(soundEnabled);
            onResetToSetup();
          }}
          className="py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-base border border-slate-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Users className="h-5 w-5" /> ახალი თამაში
        </button>
      </div>
    </div>
  );
};
