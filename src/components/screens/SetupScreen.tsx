import React from 'react';
import { Team, ControlMode } from '@/types/game';
import { ThemeConfig } from '@/lib/themes';
import { CATEGORIES } from '@/lib/words';
import {
  TEAM_COLORS,
  ROUND_TIME_OPTIONS,
  WINNING_SCORE_OPTIONS,
  CONTROL_MODE_OPTIONS,
} from '@/constants/game';
import {
  playButtonTapSound,
  playPillSelectSound,
  playToggleSound,
} from '@/lib/sounds';
import {
  Users,
  Plus,
  Trash2,
  Sparkles,
  ChevronRight,
  Trophy,
  Clock,
  Smartphone,
  Play,
} from 'lucide-react';

interface SetupScreenProps {
  setupStep: 1 | 2 | 3;
  setSetupStep: (step: 1 | 2 | 3) => void;
  teams: Team[];
  onAddTeam: () => void;
  onRemoveTeam: (index: number) => void;
  onTeamNameChange: (index: number, name: string) => void;
  selectedCategories: string[];
  onToggleCategory: (catId: string) => void;
  roundTime: number;
  setRoundTime: (time: number) => void;
  winningScore: number;
  setWinningScore: (score: number) => void;
  controlMode: ControlMode;
  setControlMode: (mode: ControlMode) => void;
  skipPenalty: boolean;
  setSkipPenalty: (penalty: boolean) => void;
  partyModeEnabled: boolean;
  setPartyModeEnabled: (enabled: boolean) => void;
  soundEnabled: boolean;
  activeTheme: ThemeConfig;
  onStartGame: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  setupStep,
  setSetupStep,
  teams,
  onAddTeam,
  onRemoveTeam,
  onTeamNameChange,
  selectedCategories,
  onToggleCategory,
  roundTime,
  setRoundTime,
  winningScore,
  setWinningScore,
  controlMode,
  setControlMode,
  skipPenalty,
  setSkipPenalty,
  partyModeEnabled,
  setPartyModeEnabled,
  soundEnabled,
  activeTheme,
  onStartGame,
}) => {
  return (
    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4 animate-in fade-in duration-200">
      {/* Top Stepper Indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span className={setupStep === 1 ? `${activeTheme.accentText} font-extrabold` : 'text-slate-500'}>
            1. გუნდები
          </span>
          <span className={setupStep === 2 ? `${activeTheme.accentText} font-extrabold` : 'text-slate-500'}>
            2. კატეგორიები
          </span>
          <span className={setupStep === 3 ? `${activeTheme.accentText} font-extrabold` : 'text-slate-500'}>
            3. პარამეტრები
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden flex border border-slate-800">
          <div
            className={`h-full ${activeTheme.stepperGradient} transition-all duration-300 ${
              setupStep === 1 ? 'w-1/3' : setupStep === 2 ? 'w-2/3' : 'w-full'
            }`}
          />
        </div>
      </div>

      {/* STEP 1: TEAMS */}
      {setupStep === 1 && (
        <div className="flex-1 flex flex-col justify-between space-y-4 py-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Users className={`h-5 w-5 ${activeTheme.accentText}`} /> გუნდების შემადგენლობა
                </h2>
                <p className="text-xs text-slate-400">დაამატეთ ან შეცვალეთ გუნდის სახელები</p>
              </div>
              {teams.length < 6 && (
                <button
                  onClick={onAddTeam}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl ${activeTheme.accentBgLight} hover:opacity-90 ${activeTheme.accentText} border ${activeTheme.accentBorder}/30 flex items-center gap-1 transition-all active:scale-95 shrink-0`}
                >
                  <Plus className="h-3.5 w-3.5" /> დამატება
                </button>
              )}
            </div>

            {/* Teams List (Compact) */}
            <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-0.5">
              {teams.map((team, idx) => {
                const color = TEAM_COLORS[team.colorIndex] || TEAM_COLORS[0];
                return (
                  <div
                    key={team.id}
                    className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-2xl p-2 px-3 focus-within:border-purple-500 transition-colors"
                  >
                    <span
                      className={`w-7 h-7 rounded-xl ${color.badge} flex items-center justify-center text-xs font-black shrink-0 shadow-sm`}
                    >
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={team.name}
                      maxLength={20}
                      onChange={(e) => onTeamNameChange(idx, e.target.value)}
                      placeholder={`გუნდი ${idx + 1}`}
                      className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-100 outline-none placeholder:text-slate-600"
                    />
                    {teams.length > 2 && (
                      <button
                        onClick={() => onRemoveTeam(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors active:scale-90"
                        aria-label="Remove team"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              playButtonTapSound(soundEnabled);
              setSetupStep(2);
            }}
            className={`w-full py-4 rounded-2xl ${activeTheme.primaryGradient} text-white font-black text-base ${activeTheme.primaryShadow} active:scale-[0.99] transition-all flex items-center justify-center gap-2`}
          >
            <span>კატეგორიების არჩევა (2/3)</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* STEP 2: CATEGORIES */}
      {setupStep === 2 && (
        <div className="flex-1 flex flex-col justify-between space-y-3 py-1">
          <div className="space-y-2">
            <div className="space-y-0.5">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" /> სიტყვების კატეგორიები
              </h2>
              <p className="text-xs text-slate-400">აირჩიეთ ერთი ან რამდენიმე თემატიკა</p>
            </div>

            {/* Compact Category Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[48vh] overflow-y-auto pr-0.5">
              <button
                onClick={() => onToggleCategory('all')}
                className={`p-2.5 rounded-2xl text-left border transition-all flex items-center gap-2.5 active:scale-95 ${
                  selectedCategories.includes('all')
                    ? `${activeTheme.categoryActiveBg} ${activeTheme.categoryActiveBorder} ${activeTheme.categoryActiveText} ${activeTheme.categoryActiveShadow}`
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl shrink-0">🎲</span>
                <div className="truncate">
                  <div className="text-xs font-black text-slate-200 truncate">ყველა შერეული</div>
                  <div className="text-[10px] text-slate-400">1200+ სიტყვა</div>
                </div>
              </button>

              {CATEGORIES.map((cat) => {
                const isSelected =
                  selectedCategories.includes(cat.id) && !selectedCategories.includes('all');
                return (
                  <button
                    key={cat.id}
                    onClick={() => onToggleCategory(cat.id)}
                    className={`p-2.5 rounded-2xl text-left border transition-all flex items-center gap-2.5 active:scale-95 ${
                      isSelected
                        ? `${activeTheme.categoryActiveBg} ${activeTheme.categoryActiveBorder} ${activeTheme.categoryActiveText} ${activeTheme.categoryActiveShadow}`
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{cat.emoji}</span>
                    <div className="truncate">
                      <div className="text-xs font-black text-slate-200 truncate">{cat.name}</div>
                      <div className="text-[10px] text-slate-400">{cat.words.length} სიტყვა</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Back / Next Navigation */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => {
                playButtonTapSound(soundEnabled);
                setSetupStep(1);
              }}
              className="py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 active:scale-95 transition-all"
            >
              ← უკან
            </button>
            <button
              onClick={() => {
                playButtonTapSound(soundEnabled);
                setSetupStep(3);
              }}
              className={`col-span-2 py-3.5 rounded-2xl ${activeTheme.primaryGradient} text-white font-black text-sm ${activeTheme.primaryShadow} active:scale-[0.99] transition-all flex items-center justify-center gap-1.5`}
            >
              <span>პარამეტრები (3/3)</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: GAME SETTINGS */}
      {setupStep === 3 && (
        <div className="flex-1 flex flex-col justify-between space-y-2.5 overflow-y-auto max-h-full py-0.5 animate-in fade-in duration-150">
          <div className="space-y-2">
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-400" /> თამაშის პარამეტრები
              </h2>
              <p className="text-[11px] text-slate-400">დააკონფიგურირეთ რაუნდისა და მართვის წესები</p>
            </div>

            {/* 2-Column: Round Time & Winning Score */}
            <div className="grid grid-cols-2 gap-2">
              {/* Round Time */}
              <div className="bg-slate-950/50 p-2.5 rounded-2xl border border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" /> დრო
                </span>
                <div className="grid grid-cols-2 gap-1">
                  {ROUND_TIME_OPTIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        playPillSelectSound(soundEnabled);
                        setRoundTime(t);
                      }}
                      className={`py-1.5 rounded-lg text-xs font-black border transition-all active:scale-95 text-center ${
                        roundTime === t
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-950/50 font-black'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {t}წმ
                    </button>
                  ))}
                </div>
              </div>

              {/* Winning Score */}
              <div className="bg-slate-950/50 p-2.5 rounded-2xl border border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5 text-amber-400" /> ქულა
                </span>
                <div className="grid grid-cols-2 gap-1">
                  {WINNING_SCORE_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        playPillSelectSound(soundEnabled);
                        setWinningScore(s);
                      }}
                      className={`py-1.5 rounded-lg text-xs font-black border transition-all active:scale-95 text-center ${
                        winningScore === s
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-950/50 font-black'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Control Mode (Swipe vs Buttons vs Both) */}
            <div className="space-y-1.5 bg-slate-950/50 p-2.5 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Smartphone className="h-3.5 w-3.5 text-pink-400" /> მართვის რეჟიმი
                </span>
                <span className={`text-[10px] ${activeTheme.accentText} font-bold`}>Tinder Swipe</span>
              </div>
              <div className="flex gap-1">
                {CONTROL_MODE_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      playPillSelectSound(soundEnabled);
                      setControlMode(m.id);
                    }}
                    className={`flex-1 py-1.5 px-1 rounded-xl text-[11px] font-bold border transition-all active:scale-95 text-center ${
                      controlMode === m.id
                        ? `${activeTheme.primaryGradient} text-white border-purple-400 shadow-md shadow-purple-950/50 font-black`
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grouped Toggles: Penalty & Party Mode */}
            <div className="bg-slate-950/50 rounded-2xl border border-slate-800/80 divide-y divide-slate-800/80">
              {/* Skip Penalty */}
              <div className="flex items-center justify-between p-2.5 px-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200">გამოტოვების ჯარიმა (-1 ქულა)</div>
                  <div className="text-[10px] text-slate-400">
                    {skipPenalty ? 'Skip აკლებს 1 ქულას' : 'Skip არ აკლებს ქულას'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const nextVal = !skipPenalty;
                    playToggleSound(nextVal, soundEnabled);
                    setSkipPenalty(nextVal);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    skipPenalty ? 'bg-purple-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      skipPenalty ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Party Mode */}
              <div className="flex items-center justify-between p-2.5 px-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-purple-200 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Party რეჟიმი (დავალებები)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {partyModeEnabled ? 'გამოწვევები +2 ბონუსით' : 'კლასიკური თამაში'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const nextVal = !partyModeEnabled;
                    playToggleSound(nextVal, soundEnabled);
                    setPartyModeEnabled(nextVal);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    partyModeEnabled ? 'bg-purple-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      partyModeEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Back / Start Navigation */}
          <div className="grid grid-cols-3 gap-2 pt-1 shrink-0">
            <button
              onClick={() => {
                playButtonTapSound(soundEnabled);
                setSetupStep(2);
              }}
              className="py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 active:scale-95 transition-all"
            >
              ← უკან
            </button>
            <button
              onClick={() => {
                playButtonTapSound(soundEnabled);
                onStartGame();
              }}
              className={`col-span-2 py-3.5 rounded-2xl ${activeTheme.secondaryGradient} text-white font-black text-base shadow-xl shadow-emerald-950/60 active:scale-[0.99] transition-all flex items-center justify-center gap-2`}
            >
              <Play className="h-5 w-5 fill-white" />
              <span>თამაშის დაწყება</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
