
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactConfetti from 'react-confetti';
import {
  CATEGORIES,
  getWordsForCategories,
  getAllWords,
} from '@/lib/words';
import {
  PartyChallenge,
  getRandomChallenge,
} from '@/lib/challenges';
import {
  playCorrectSound,
  playSkipSound,
  playTickingSound,
  playTimeUpSound,
  playWinningSound,
  playCountdownBeep,
  playButtonTapSound,
  playPillSelectSound,
  playToggleSound,
  playModalSound,
  playStreakSound,
  playPartyChallengeSound,
} from '@/lib/sounds';
import LogoSvg from '@/lib/logoSvg';
import {
  Volume2,
  VolumeX,
  RefreshCw,
  Pause,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Users,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  X,
  Swords,
  ChevronRight,
  Flame,
  Smartphone,
  MoveHorizontal,
} from 'lucide-react';

// Team color palettes for multi-team setup
const TEAM_COLORS = [
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

const DEFAULT_TEAM_NAMES = ['არჩევანი', 'არადანი', 'ფენიქსი', 'მგლები', 'ალმასები', 'ჩემპიონები'];

interface PlayedWord {
  id: string;
  word: string;
  isCorrect: boolean;
}

interface Team {
  id: string;
  name: string;
  score: number;
  roundScore: number;
  totalCorrect: number;
  totalSkipped: number;
  colorIndex: number;
}

type GameState = 'setup' | 'ready' | 'countdown' | 'playing' | 'paused' | 'turnEnd' | 'gameEnd';

export default function AliasGame() {
  // Game Setup State
  const [teams, setTeams] = useState<Team[]>([
    { id: '1', name: 'არჩევანი', score: 0, roundScore: 0, totalCorrect: 0, totalSkipped: 0, colorIndex: 0 },
    { id: '2', name: 'არადანი', score: 0, roundScore: 0, totalCorrect: 0, totalSkipped: 0, colorIndex: 1 },
  ]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [roundTime, setRoundTime] = useState(60);
  const [winningScore, setWinningScore] = useState(30);
  const [skipPenalty, setSkipPenalty] = useState(true); // true = -1, false = 0
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['general']);
  const [partyModeEnabled, setPartyModeEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [setupStep, setSetupStep] = useState<1 | 2 | 3>(1);

  // Active Gameplay State
  const [gameState, setGameState] = useState<GameState>('setup');
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState('');
  const [currentTurnWords, setCurrentTurnWords] = useState<PlayedWord[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<PartyChallenge | null>(null);
  const [challengeCompleted, setChallengeCompleted] = useState(true);
  const [roundNumber, setRoundNumber] = useState(1);
  const [isTieBreaker, setIsTieBreaker] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);

  // Control Mode: 'both' (Swipe + Buttons), 'swipe' (Swipe Only), 'buttons' (Buttons Only)
  const [controlMode, setControlMode] = useState<'both' | 'swipe' | 'buttons'>('both');

  // Swipe Card Physics state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyOutDirection, setFlyOutDirection] = useState<'left' | 'right' | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  // Window size for confetti
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Refs for stable intervals and event handlers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const deckRef = useRef<string[]>([]);
  const usedWordsRef = useRef<Set<string>>(new Set());

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Shuffle array using Fisher-Yates
  const shuffle = useCallback((array: string[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // Initialize deck from categories
  const initializeDeck = useCallback(() => {
    const baseWords = getWordsForCategories(selectedCategories);
    const validWords = baseWords.length > 0 ? baseWords : getAllWords();
    const shuffled = shuffle(validWords);
    deckRef.current = shuffled;
    usedWordsRef.current = new Set();
  }, [selectedCategories, shuffle]);

  // Draw next unique word from deck
  const getNextWord = useCallback(() => {
    if (deckRef.current.length === 0) {
      // Reshuffle all words when deck exhausted
      const baseWords = getWordsForCategories(selectedCategories);
      const shuffled = shuffle(baseWords);
      deckRef.current = shuffled;
    }
    const next = deckRef.current.pop() || 'სიტყვა';
    usedWordsRef.current.add(next);
    return next;
  }, [selectedCategories, shuffle]);

  // Start Turn - Trigger 3-2-1 Countdown
  const startCountdown = () => {
    setGameState('countdown');
    setCountdownValue(3);
    playCountdownBeep(false, soundEnabled);

    let count = 3;
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownValue(count);
        playCountdownBeep(false, soundEnabled);
      } else if (count === 0) {
        setCountdownValue(0);
        playCountdownBeep(true, soundEnabled);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        startActivePlay();
      }
    }, 850);
  };

  // Start active guessing phase
  const startActivePlay = () => {
    setTimeLeft(roundTime);
    setCurrentTurnWords([]);
    setCurrentStreak(0);
    const firstWord = getNextWord();
    setCurrentWord(firstWord);
    setGameState('playing');
  };

  // Assign random challenge if Party Mode is active
  const assignNextChallenge = useCallback(() => {
    if (partyModeEnabled) {
      const ch = getRandomChallenge();
      setCurrentChallenge(ch);
      setChallengeCompleted(true);
      playPartyChallengeSound(soundEnabled);
    } else {
      setCurrentChallenge(null);
      setChallengeCompleted(false);
    }
  }, [partyModeEnabled, soundEnabled]);

  // End active team turn
  const endTeamTurn = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (soundEnabled) playTimeUpSound(true);

    // Apply Party Challenge bonus (+2) if active
    if (partyModeEnabled && currentChallenge) {
      setChallengeCompleted(true);
      setTeams((prevTeams) => {
        const updated = [...prevTeams];
        const team = updated[currentTeamIndex];
        if (team) {
          updated[currentTeamIndex] = {
            ...team,
            score: team.score + 2,
            roundScore: team.roundScore + 2,
          };
        }
        return updated;
      });
    }

    setGameState('turnEnd');
  }, [soundEnabled, partyModeEnabled, currentChallenge, currentTeamIndex]);

  // Toggle Challenge Bonus in Turn Review
  const toggleChallengeCompleted = () => {
    if (!currentChallenge) return;
    const newStatus = !challengeCompleted;
    setChallengeCompleted(newStatus);
    playToggleSound(newStatus, soundEnabled);
    const scoreDiff = newStatus ? 2 : -2;

    setTeams((prevTeams) => {
      const updated = [...prevTeams];
      const team = updated[currentTeamIndex];
      if (team) {
        updated[currentTeamIndex] = {
          ...team,
          score: team.score + scoreDiff,
          roundScore: team.roundScore + scoreDiff,
        };
      }
      return updated;
    });
  };

  // Main game timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endTeamTurn();
            return 0;
          }
          if (prev <= 11 && prev > 1) {
            playTickingSound(soundEnabled);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, endTeamTurn, soundEnabled]);

  // Handle Correct Guess
  const handleCorrect = useCallback(() => {
    if (gameState !== 'playing' || !currentWord) return;

    const nextStreak = currentStreak + 1;
    setCurrentStreak(nextStreak);

    // Play energetic streak sound on every 3rd consecutive correct word, otherwise melodic chime
    if (nextStreak >= 3 && nextStreak % 2 === 1) {
      playStreakSound(nextStreak, soundEnabled);
    } else {
      playCorrectSound(soundEnabled);
    }

    const playedItem: PlayedWord = {
      id: `${Date.now()}-${Math.random()}`,
      word: currentWord,
      isCorrect: true,
    };

    setCurrentTurnWords((prev) => [...prev, playedItem]);

    // Update current team score
    setTeams((prevTeams) => {
      const updated = [...prevTeams];
      updated[currentTeamIndex] = {
        ...updated[currentTeamIndex],
        score: updated[currentTeamIndex].score + 1,
        roundScore: updated[currentTeamIndex].roundScore + 1,
        totalCorrect: updated[currentTeamIndex].totalCorrect + 1,
      };
      return updated;
    });

    setCurrentWord(getNextWord());
  }, [gameState, currentWord, soundEnabled, currentStreak, currentTeamIndex, getNextWord]);

  // Handle Skip
  const handleSkip = useCallback(() => {
    if (gameState !== 'playing' || !currentWord) return;

    playSkipSound(soundEnabled);
    setCurrentStreak(0);

    const playedItem: PlayedWord = {
      id: `${Date.now()}-${Math.random()}`,
      word: currentWord,
      isCorrect: false,
    };

    setCurrentTurnWords((prev) => [...prev, playedItem]);

    const penalty = skipPenalty ? 1 : 0;

    // Update current team score
    setTeams((prevTeams) => {
      const updated = [...prevTeams];
      updated[currentTeamIndex] = {
        ...updated[currentTeamIndex],
        score: updated[currentTeamIndex].score - penalty,
        roundScore: updated[currentTeamIndex].roundScore - penalty,
        totalSkipped: updated[currentTeamIndex].totalSkipped + 1,
      };
      return updated;
    });

    setCurrentWord(getNextWord());
  }, [gameState, currentWord, soundEnabled, skipPenalty, currentTeamIndex, getNextWord]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'playing') {
        if (e.code === 'ArrowRight' || e.code === 'ArrowUp' || e.code === 'Enter') {
          e.preventDefault();
          handleCorrect();
        } else if (e.code === 'ArrowLeft' || e.code === 'ArrowDown' || e.code === 'Space') {
          e.preventDefault();
          handleSkip();
        } else if (e.code === 'KeyP' || e.code === 'Escape') {
          e.preventDefault();
          setGameState('paused');
        }
      } else if (gameState === 'paused') {
        if (e.code === 'KeyP' || e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          setGameState('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleCorrect, handleSkip]);

  // Interactive Pointer / Touch Swipe Physics for Card (Tinder-Style)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || controlMode === 'buttons' || flyOutDirection) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    setIsDragging(true);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignored if unsupported
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || flyOutDirection) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || flyOutDirection) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    const dx = dragOffset.x;
    const dt = Math.max(1, Date.now() - dragStartRef.current.time);
    const velocityX = Math.abs(dx) / dt;

    const SWIPE_THRESHOLD = 75;
    const VELOCITY_THRESHOLD = 0.38;

    if (dx > SWIPE_THRESHOLD || (dx > 30 && velocityX > VELOCITY_THRESHOLD)) {
      // Throw Right -> Correct
      setFlyOutDirection('right');
      setTimeout(() => {
        handleCorrect();
        setDragOffset({ x: 0, y: 0 });
        setFlyOutDirection(null);
      }, 150);
    } else if (dx < -SWIPE_THRESHOLD || (dx < -30 && velocityX > VELOCITY_THRESHOLD)) {
      // Throw Left -> Skip
      setFlyOutDirection('left');
      setTimeout(() => {
        handleSkip();
        setDragOffset({ x: 0, y: 0 });
        setFlyOutDirection(null);
      }, 150);
    } else {
      // Smooth spring back
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Toggle word status during turn review screen (fix accidental clicks)
  const toggleTurnWordStatus = (wordId: string) => {
    const wordItem = currentTurnWords.find((w) => w.id === wordId);
    if (!wordItem) return;

    const newStatus = !wordItem.isCorrect;
    const penalty = skipPenalty ? 1 : 0;

    // Delta calculation:
    // was correct (+1) -> now skipped (-penalty): diff is (-1 - penalty)
    // was skipped (-penalty) -> now correct (+1): diff is (+1 + penalty)
    const scoreDiff = newStatus ? 1 + penalty : -(1 + penalty);

    setCurrentTurnWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, isCorrect: newStatus } : w))
    );

    setTeams((prevTeams) => {
      const updated = [...prevTeams];
      const team = updated[currentTeamIndex];
      updated[currentTeamIndex] = {
        ...team,
        score: team.score + scoreDiff,
        roundScore: team.roundScore + scoreDiff,
        totalCorrect: newStatus ? team.totalCorrect + 1 : team.totalCorrect - 1,
        totalSkipped: newStatus ? team.totalSkipped - 1 : team.totalSkipped + 1,
      };
      return updated;
    });
  };

  // Complete turn review and advance to next team / check winner
  const handleConfirmTurnEnd = () => {
    // Check if full cycle (all teams played this round) is completed
    const isRoundCycleComplete = currentTeamIndex === teams.length - 1;

    if (isRoundCycleComplete) {
      // Find top scores
      const highestScore = Math.max(...teams.map((t) => t.score));

      if (highestScore >= winningScore) {
        // Find how many teams have the highest score
        const winners = teams.filter((t) => t.score === highestScore);

        if (winners.length === 1) {
          // Exactly 1 winner! Game Ends!
          playWinningSound(soundEnabled);
          setGameState('gameEnd');
          return;
        } else {
          // TIE-BREAKER! Multiple teams tied at highest score >= winningScore
          setIsTieBreaker(true);
        }
      }

      // Next round cycle
      setRoundNumber((r) => r + 1);
      setCurrentTeamIndex(0);
    } else {
      // Next team in current round cycle
      setCurrentTeamIndex((prev) => prev + 1);
    }

    // Reset round scores for display in next turn
    setTeams((prev) => prev.map((t) => ({ ...t, roundScore: 0 })));
    assignNextChallenge();
    setGameState('ready');
  };

  // Start initial game
  const handleStartGame = () => {
    initializeDeck();
    setRoundNumber(1);
    setIsTieBreaker(false);
    setCurrentTeamIndex(0);
    setTeams((prev) =>
      prev.map((t) => ({
        ...t,
        score: 0,
        roundScore: 0,
        totalCorrect: 0,
        totalSkipped: 0,
      }))
    );
    assignNextChallenge();
    setGameState('ready');
  };

  // Reset / Rematch with same teams
  const handleRematch = () => {
    initializeDeck();
    setRoundNumber(1);
    setIsTieBreaker(false);
    setCurrentTeamIndex(0);
    setTeams((prev) =>
      prev.map((t) => ({
        ...t,
        score: 0,
        roundScore: 0,
        totalCorrect: 0,
        totalSkipped: 0,
      }))
    );
    assignNextChallenge();
    setGameState('ready');
  };

  // Full reset back to setup
  const handleResetToSetup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setShowConfirmRestart(false);
    setSetupStep(1);
    setCurrentChallenge(null);
    setGameState('setup');
  };

  // Add / Remove Team in Setup
  const handleAddTeam = () => {
    if (teams.length >= 6) return;
    playButtonTapSound(soundEnabled);
    const nextIdx = teams.length;
    const newName = DEFAULT_TEAM_NAMES[nextIdx] || `გუნდი ${nextIdx + 1}`;
    setTeams((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        name: newName,
        score: 0,
        roundScore: 0,
        totalCorrect: 0,
        totalSkipped: 0,
        colorIndex: nextIdx % TEAM_COLORS.length,
      },
    ]);
  };

  const handleRemoveTeam = (index: number) => {
    if (teams.length <= 2) return;
    playButtonTapSound(soundEnabled);
    setTeams((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTeamNameChange = (index: number, name: string) => {
    setTeams((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name };
      return updated;
    });
  };

  // Category Toggle
  const toggleCategory = (catId: string) => {
    playPillSelectSound(soundEnabled);
    if (catId === 'all') {
      setSelectedCategories(['all']);
      return;
    }

    let updated: string[];
    if (selectedCategories.includes('all')) {
      updated = [catId];
    } else if (selectedCategories.includes(catId)) {
      updated = selectedCategories.filter((c) => c !== catId);
      if (updated.length === 0) updated = ['general'];
    } else {
      updated = [...selectedCategories, catId];
    }
    setSelectedCategories(updated);
  };

  // Leaderboard sorting
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const currentTeam = teams[currentTeamIndex] || teams[0];
  const teamTheme = TEAM_COLORS[currentTeam.colorIndex] || TEAM_COLORS[0];

  // Total words guessed across match
  const totalMatchCorrect = teams.reduce((acc, t) => acc + t.totalCorrect, 0);

  // Swipe progress & physics calculations (Tinder-Style)
  const rightProgress = Math.min(1, Math.max(0, dragOffset.x / 65));
  const leftProgress = Math.min(1, Math.max(0, -dragOffset.x / 65));

  let cardTransform = 'translate3d(0, 0, 0) rotate(0deg)';
  let cardTransition =
    'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.2s ease, box-shadow 0.15s ease, border-color 0.15s ease';
  let cardOpacity = 1;

  if (flyOutDirection === 'right') {
    cardTransform = 'translate3d(120vw, 20px, 0) rotate(25deg)';
    cardOpacity = 0;
    cardTransition = 'transform 0.18s ease-out, opacity 0.18s ease-out';
  } else if (flyOutDirection === 'left') {
    cardTransform = 'translate3d(-120vw, 20px, 0) rotate(-25deg)';
    cardOpacity = 0;
    cardTransition = 'transform 0.18s ease-out, opacity 0.18s ease-out';
  } else if (isDragging) {
    const rot = Math.max(-18, Math.min(18, dragOffset.x * 0.08));
    cardTransform = `translate3d(${dragOffset.x}px, ${dragOffset.y * 0.35}px, 0) rotate(${rot}deg)`;
    cardTransition = 'none';
  }

  return (
    <main
      className="min-h-[100dvh] h-[100dvh] bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-2 sm:p-4 select-none overflow-hidden relative"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
        paddingLeft: 'max(env(safe-area-inset-left, 0px), 8px)',
        paddingRight: 'max(env(safe-area-inset-right, 0px), 8px)',
      }}
    >
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-xl bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl shadow-purple-950/50 flex flex-col justify-between overflow-hidden relative z-10 flex-1 min-h-0">
        
        {/* Header Bar */}
        <header className="px-4 py-2.5 sm:px-6 sm:py-3.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <LogoSvg className="h-9 sm:h-10" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Sound Toggle */}
            <button
              onClick={() => {
                const nextState = !soundEnabled;
                playToggleSound(nextState, true);
                setSoundEnabled(nextState);
              }}
              aria-label="Toggle Sound"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors active:scale-95"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5 text-amber-400" /> : <VolumeX className="h-5 w-5 text-slate-500" />}
            </button>

            {/* Rules Button */}
            <button
              onClick={() => {
                playModalSound(true, soundEnabled);
                setShowRulesModal(true);
              }}
              aria-label="Game Rules"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors active:scale-95"
            >
              <HelpCircle className="h-5 w-5 text-purple-400" />
            </button>

            {/* In-Game Action Buttons */}
            {(gameState === 'playing' || gameState === 'paused') && (
              <>
                <button
                  onClick={() => {
                    playButtonTapSound(soundEnabled);
                    setGameState(gameState === 'paused' ? 'playing' : 'paused');
                  }}
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
                  onClick={() => setShowConfirmRestart(true)}
                  className="p-2 sm:p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  aria-label="Restart Match"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 1. MULTI-STEP SETUP WIZARD (NO SCROLL, COMPACT & INTUITIVE) */}
        {/* ========================================================================= */}
        {gameState === 'setup' && (
          <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4 animate-in fade-in duration-200">
            {/* Top Stepper Indicator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className={setupStep === 1 ? 'text-purple-400 font-extrabold' : 'text-slate-500'}>
                  1. გუნდები
                </span>
                <span className={setupStep === 2 ? 'text-purple-400 font-extrabold' : 'text-slate-500'}>
                  2. კატეგორიები
                </span>
                <span className={setupStep === 3 ? 'text-purple-400 font-extrabold' : 'text-slate-500'}>
                  3. პარამეტრები
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden flex border border-slate-800">
                <div
                  className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${
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
                        <Users className="h-5 w-5 text-purple-400" /> გუნდების შემადგენლობა
                      </h2>
                      <p className="text-xs text-slate-400">დაამატეთ ან შეცვალეთ გუნდის სახელები</p>
                    </div>
                    {teams.length < 6 && (
                      <button
                        onClick={handleAddTeam}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center gap-1 transition-all active:scale-95 shrink-0"
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
                          <span className={`w-7 h-7 rounded-xl ${color.badge} flex items-center justify-center text-xs font-black shrink-0 shadow-sm`}>
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={team.name}
                            maxLength={20}
                            onChange={(e) => handleTeamNameChange(idx, e.target.value)}
                            placeholder={`გუნდი ${idx + 1}`}
                            className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-100 outline-none placeholder:text-slate-600"
                          />
                          {teams.length > 2 && (
                            <button
                              onClick={() => handleRemoveTeam(idx)}
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
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-base shadow-xl shadow-purple-900/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
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
                      onClick={() => toggleCategory('all')}
                      className={`p-2.5 rounded-2xl text-left border transition-all flex items-center gap-2.5 active:scale-95 ${
                        selectedCategories.includes('all')
                          ? 'bg-purple-600/25 border-purple-500 text-purple-200 shadow-md shadow-purple-950/50'
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
                          onClick={() => toggleCategory(cat.id)}
                          className={`p-2.5 rounded-2xl text-left border transition-all flex items-center gap-2.5 active:scale-95 ${
                            isSelected
                              ? 'bg-purple-600/25 border-purple-500 text-purple-200 shadow-md shadow-purple-950/50'
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
                    className="col-span-2 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-purple-900/40 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
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
                        {[30, 45, 60, 90].map((t) => (
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
                        {[20, 30, 50, 75].map((s) => (
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
                      <span className="text-[10px] text-purple-400 font-bold">Tinder Swipe</span>
                    </div>
                    <div className="flex gap-1">
                      {[
                        { id: 'both', label: '📱 ორივე' },
                        { id: 'swipe', label: '👆 სვაიპი' },
                        { id: 'buttons', label: '🔘 ღილაკი' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            playPillSelectSound(soundEnabled);
                            setControlMode(m.id as 'both' | 'swipe' | 'buttons');
                          }}
                          className={`flex-1 py-1.5 px-1 rounded-xl text-[11px] font-bold border transition-all active:scale-95 text-center ${
                            controlMode === m.id
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400 shadow-md shadow-purple-950/50 font-black'
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
                      handleStartGame();
                    }}
                    className="col-span-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-black text-base shadow-xl shadow-emerald-950/60 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="h-5 w-5 fill-white" />
                    <span>თამაშის დაწყება</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. READY SCREEN */}
        {/* ========================================================================= */}
        {gameState === 'ready' && (
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
                startCountdown();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-black text-lg sm:text-xl shadow-xl shadow-emerald-950/60 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 shrink-0"
            >
              <Play className="h-5 w-5 fill-white" /> რაუნდის დაწყება
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. COUNTDOWN SCREEN (3-2-1) */}
        {/* ========================================================================= */}
        {gameState === 'countdown' && (
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-sm font-bold text-purple-300 tracking-widest uppercase">
              {currentTeam.name}
            </span>
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-7xl font-black text-white shadow-2xl shadow-purple-900/60 animate-bounce">
              {countdownValue === 0 ? 'GO!' : countdownValue}
            </div>
            <p className="text-slate-400 text-sm font-semibold">ახსენით რაც შეიძლება მეტი სიტყვა!</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. ACTIVE PLAYING & PAUSED SCREEN */}
        {/* ========================================================================= */}
        {(gameState === 'playing' || gameState === 'paused') && (
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
                    : 'bg-slate-900 text-purple-300 border border-slate-800'
                }`}
              >
                <Clock className={`h-5 w-5 ${timeLeft <= 10 ? 'text-rose-400 animate-spin' : 'text-purple-400'}`} />
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
                      setGameState('playing');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors active:scale-95 shadow-lg shadow-emerald-950/50"
                  >
                    გაგრძელება
                  </button>
                </div>
              ) : (
                <div className="relative w-full max-w-md flex items-center justify-center h-48 sm:h-56">
                  {/* Background Deck Card (Physical 3D Stack depth) */}
                  <div className="absolute inset-0 bg-slate-900/70 border border-slate-800/80 rounded-3xl transform scale-95 translate-y-2 opacity-50 pointer-events-none shadow-xl" />

                  {/* Active Swipeable Card */}
                  <div
                    onPointerDown={controlMode !== 'buttons' ? handlePointerDown : undefined}
                    onPointerMove={controlMode !== 'buttons' ? handlePointerMove : undefined}
                    onPointerUp={controlMode !== 'buttons' ? handlePointerUpOrCancel : undefined}
                    onPointerCancel={controlMode !== 'buttons' ? handlePointerUpOrCancel : undefined}
                    style={{
                      transform: cardTransform,
                      transition: cardTransition,
                      opacity: cardOpacity,
                      touchAction: controlMode !== 'buttons' ? 'none' : 'auto',
                      boxShadow:
                        dragOffset.x > 15
                          ? `0 15px 40px rgba(16, 185, 129, ${Math.min(0.65, rightProgress * 0.75)})`
                          : dragOffset.x < -15
                          ? `0 15px 40px rgba(244, 63, 94, ${Math.min(0.65, leftProgress * 0.75)})`
                          : '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
                      borderColor:
                        dragOffset.x > 15
                          ? `rgba(52, 211, 153, ${0.4 + rightProgress * 0.6})`
                          : dragOffset.x < -15
                          ? `rgba(251, 113, 133, ${0.4 + leftProgress * 0.6})`
                          : 'rgba(71, 85, 105, 0.8)',
                    }}
                    className={`absolute inset-0 bg-gradient-to-b from-slate-800/95 via-slate-800/90 to-slate-900/95 border-2 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center select-none ${
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
                      <span>სიტყვა #{currentTurnWords.length + 1}</span>
                      {controlMode !== 'buttons' && (
                        <>
                          <span>•</span>
                          <span className="text-[11px] text-purple-400/80 font-bold">👈 სვაიპი 👉</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* In-Game Control Mode Pill & Desktop Hints */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
              {/* Quick toggle mode button */}
              <button
                onClick={() => {
                  playButtonTapSound(soundEnabled);
                  setControlMode((prev) => (prev === 'both' ? 'swipe' : prev === 'swipe' ? 'buttons' : 'both'));
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
                  onClick={handleSkip}
                  disabled={gameState === 'paused'}
                  className="py-4 sm:py-5 rounded-2xl bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-950/50 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  <span>გამოტოვება</span>
                </button>

                {/* Correct Button */}
                <button
                  onClick={handleCorrect}
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
        )}

        {/* ========================================================================= */}
        {/* 5. TURN END & WORD REVIEW SCREEN (ALIAS ESSENTIAL!) */}
        {/* ========================================================================= */}
        {gameState === 'turnEnd' && (
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
                onClick={toggleChallengeCompleted}
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
                      onClick={() => toggleTurnWordStatus(item.id)}
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
                handleConfirmTurnEnd();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-black text-lg shadow-xl shadow-purple-900/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>შემდეგი გუნდი</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. GAME OVER / WINNER CEREMONY SCREEN */}
        {/* ========================================================================= */}
        {gameState === 'gameEnd' && (
          <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-6 text-center overflow-y-auto max-h-[calc(88vh-80px)]">
            <ReactConfetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={350}
              gravity={0.15}
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
                <div className="text-base font-black text-purple-400">{roundNumber}</div>
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
                  handleRematch();
                }}
                className="py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-black text-base shadow-xl shadow-emerald-950/60 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-5 w-5" /> რევანში (იგივე გუნდები)
              </button>

              <button
                onClick={() => {
                  playButtonTapSound(soundEnabled);
                  handleResetToSetup();
                }}
                className="py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-base border border-slate-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Users className="h-5 w-5" /> ახალი თამაში
              </button>
            </div>
          </div>
        )}

        {/* Footer info pill */}
        <footer className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>სწორი: +1 ქულა {skipPenalty ? '| Skip: -1 ქულა' : '| Skip: 0 ქულა'}</span>
          <span>მიზანი: {winningScore} ქულამდე</span>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* HOW TO PLAY (RULES) MODAL */}
      {/* ========================================================================= */}
      {showRulesModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          style={{
            paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)',
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
            paddingLeft: 'max(env(safe-area-inset-left, 0px), 16px)',
            paddingRight: 'max(env(safe-area-inset-right, 0px), 16px)',
          }}
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-black text-white">როგორ ვითამაშოთ ალიასი?</h3>
              </div>
              <button
                onClick={() => {
                  playModalSound(false, soundEnabled);
                  setShowRulesModal(false);
                }}
                className="text-slate-400 hover:text-white p-1 active:scale-90 transition-transform"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="bg-purple-950/30 border border-purple-500/30 p-3 rounded-xl space-y-1">
                <div className="font-bold text-purple-300">🎯 თამაშის მიზანი:</div>
                <p>
                  აუხსენით თქვენს თანაგუნდელებს ეკრანზე გამოსახული სიტყვა ისე, რომ მათ დროის ამოწურვამდე გამოიცნონ.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-100">🚫 აკრძალულია:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>სიტყვის ან მისი ფუძის გამოყენება ახსნისას (მაგ. &quot;საათი&quot; - &quot;მაჯის საათი&quot;).</li>
                  <li>სიტყვის პირდაპირი თარგმანი სხვა ენიდან (მაგ. Dog -&gt; ძაღლი).</li>
                  <li>ჟესტებით ან თითით მინიშნება გარშემო არსებულ საგნებზე.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-100">💡 რა შეიძლება:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>სინონიმების, ანტონიმების, ასოციაციებისა და განმარტებების გამოყენება.</li>
                  <li>ისტორიების, სიტუაციებისა და მაგალითების მოყვანა.</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-emerald-950/30 to-rose-950/30 p-3 rounded-xl border border-purple-500/30 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-purple-400" /> 👆 Tinder Swipe ჟესტები:
                </div>
                <p className="text-slate-300 text-xs">
                  გაასრიალეთ ბარათი <strong>მარჯვნივ 👉</strong> სწორი პასუხისთვის (+1), ან <strong>მარცხნივ 👈</strong> გამოსატოვებლად (Skip).
                </p>
              </div>

              <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-500/30 space-y-1">
                <div className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-400" /> 🎭 Party რეჟიმი (გიჟური დავალებები):
                </div>
                <p className="text-slate-300 text-xs">
                  თითოეულ რაუნდში ამხსნელი იღებს საიდუმლო გამოწვევას (ემოციები, ხმები, მოძრაობები ან ტაბუ). დავალების წარმატებით შესრულება გუნდს ანიჭებს <strong>+2 ბონუს ქულას</strong>!
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-amber-400">🏆 გამარჯვება:</div>
                <p>
                  პირველი გუნდი, რომელიც რაუნდების თანაბარი რაოდენობის შემდეგ დააგროვებს გამარჯვების ქულას, იგებს თამაშს!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playModalSound(false, soundEnabled);
                setShowRulesModal(false);
              }}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-colors active:scale-98"
            >
              გასაგებია!
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRM RESTART MODAL */}
      {/* ========================================================================= */}
      {showConfirmRestart && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          style={{
            paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)',
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
            paddingLeft: 'max(env(safe-area-inset-left, 0px), 16px)',
            paddingRight: 'max(env(safe-area-inset-right, 0px), 16px)',
          }}
        >
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">თამაშის შეწყვეტა?</h3>
              <p className="text-xs text-slate-400">მიმდინარე პროგრესი და ქულები წაიშლება.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  playModalSound(false, soundEnabled);
                  setShowConfirmRestart(false);
                }}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors active:scale-95"
              >
                გაუქმება
              </button>
              <button
                onClick={() => {
                  playButtonTapSound(soundEnabled);
                  handleResetToSetup();
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors active:scale-95"
              >
                დიახ, შეწყვეტა
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
