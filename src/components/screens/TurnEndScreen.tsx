import React from 'react';
import { Team, PlayedWord } from '@/types/game';
import { PartyChallenge } from '@/lib/challenges';
import { playButtonTapSound } from '@/lib/sounds';
import { Check, X, ChevronRight } from 'lucide-react';

interface TurnEndScreenProps {
  currentTeam: Team;
  winningScore: number;
  partyModeEnabled: boolean;
  currentChallenge: PartyChallenge | null;
  challengeCompleted: boolean;
  onToggleChallengeCompleted: () => void;
  currentTurnWords: PlayedWord[];
  skipPenalty: boolean;
  onToggleTurnWordStatus: (wordId: string) => void;
  soundEnabled: boolean;
  onConfirmTurnEnd: () => void;
}

export const TurnEndScreen: React.FC<TurnEndScreenProps> = ({
  currentTeam,
  winningScore,
  partyModeEnabled,
  currentChallenge,
  challengeCompleted,
  onToggleChallengeCompleted,
  currentTurnWords,
  skipPenalty,
  onToggleTurnWordStatus,
  soundEnabled,
  onConfirmTurnEnd,
}) => {
  return (
    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4 overflow-y-auto max-h-[calc(88vh-80px)]">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
          რაუნდი დასრულდა
        </span>
        <h2 className="text-2xl font-black text-white">{currentTeam.name} - შედეგები</h2>
        <p className="text-xs text-slate-400">
          შეამოწმეთ სიტყვები. შეცდომის შემთხვევაში დააკლიკეთ სტატუსის შესაცვლელად.
        </p>
      </div>

      {/* Score Summary Box */}
      <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
        <div className="text-center border-r border-slate-800/80 pr-2">
          <div className="text-xs font-semibold text-slate-400">ამ რაუნდის ქულა</div>
          <div
            className={`text-2xl font-black ${
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
        <div className="text-center pl-2">
          <div className="text-xs font-semibold text-slate-400">სულ ქულა</div>
          <div className="text-2xl font-black text-amber-400">
            {currentTeam.score} / {winningScore}
          </div>
        </div>
      </div>

      {/* Party Challenge Evaluation Box */}
      {partyModeEnabled && currentChallenge && (
        <div
          onClick={onToggleChallengeCompleted}
          className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all flex items-center justify-between gap-3 ${
            challengeCompleted
              ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/50'
              : 'bg-slate-950/40 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl shrink-0">{currentChallenge.emoji}</span>
            <div className="text-left min-w-0">
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <span>დავალება: {currentChallenge.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${currentChallenge.badgeColor}`}>
                  {currentChallenge.categoryName}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 truncate">
                {currentChallenge.instruction}
              </div>
              <div className="text-[11px] font-bold text-purple-300 mt-0.5">
                {challengeCompleted ? '✓ შესრულებულია (+2 ბონუს ქულა)' : '✕ არ შესრულებულა (0 ბონუსი)'}
              </div>
            </div>
          </div>
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-black border shrink-0 transition-all ${
              challengeCompleted
                ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {challengeCompleted ? 'ჩათვლილია' : 'გაუქმება'}
          </div>
        </div>
      )}

      {/* Played Words Interactive Review List */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span>სიტყვა ({currentTurnWords.length})</span>
          <span>სტატუსი (დააკლიკეთ შესაცვლელად)</span>
        </div>

        {currentTurnWords.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            ამ რაუნდში სიტყვა არ იქნა გამოცნობილი.
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {currentTurnWords.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onToggleTurnWordStatus(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all active:scale-[0.99] ${
                  item.isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/40 hover:bg-emerald-900/40'
                    : 'bg-rose-950/30 border-rose-500/40 hover:bg-rose-900/40'
                }`}
              >
                <span className="font-bold text-sm text-slate-200">
                  {idx + 1}. {item.word}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                      item.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {item.isCorrect ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> სწორი (+1)
                      </>
                    ) : (
                      <>
                        <X className="h-3.5 w-3.5" /> Skip ({skipPenalty ? '-1' : '0'})
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm & Next Team Button */}
      <button
        onClick={() => {
          playButtonTapSound(soundEnabled);
          onConfirmTurnEnd();
        }}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-black text-lg shadow-xl shadow-purple-900/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
      >
        <span>შემდეგი გუნდი</span>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};
