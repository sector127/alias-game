import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, ControlMode, PlayedWord, Team } from '@/types/game';
import { TEAM_COLORS, DEFAULT_TEAM_NAMES } from '@/constants/game';
import { getWordsForCategories, getAllWords } from '@/lib/words';
import { PartyChallenge, getRandomChallenge } from '@/lib/challenges';
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
  playStreakSound,
  playPartyChallengeSound,
} from '@/lib/sounds';
import { ThemeId, THEMES } from '@/lib/themes';

export function useAliasGame() {
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

  // Theme State
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('alias_theme');
        if (saved === 'summer' || saved === 'winter' || saved === 'neutral') {
          return saved as ThemeId;
        }
      } catch {
        // Fallback to default
      }
    }
    return 'neutral';
  });
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleSelectTheme = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem('alias_theme', themeId);
    } catch {
      // Ignore
    }
  };

  const activeTheme = THEMES[currentTheme] || THEMES.neutral;

  // Control Mode: 'both' (Swipe + Buttons), 'swipe' (Swipe Only), 'buttons' (Buttons Only)
  const [controlMode, setControlMode] = useState<ControlMode>('both');

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

  // Start active guessing phase
  const startActivePlay = useCallback(() => {
    setTimeLeft(roundTime);
    setCurrentTurnWords([]);
    setCurrentStreak(0);
    const firstWord = getNextWord();
    setCurrentWord(firstWord);
    setGameState('playing');
  }, [roundTime, getNextWord]);

  // Start Turn - Trigger 3-2-1 Countdown
  const startCountdown = useCallback(() => {
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
  }, [soundEnabled, startActivePlay]);

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
      playCorrectSound(soundEnabled, currentTheme);
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
  }, [gameState, currentWord, soundEnabled, currentStreak, currentTeamIndex, getNextWord, currentTheme]);

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

  // Toggle word status during turn review screen (fix accidental clicks)
  const toggleTurnWordStatus = (wordId: string) => {
    const wordItem = currentTurnWords.find((w) => w.id === wordId);
    if (!wordItem) return;

    const newStatus = !wordItem.isCorrect;
    const penalty = skipPenalty ? 1 : 0;

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
    const isRoundCycleComplete = currentTeamIndex === teams.length - 1;

    if (isRoundCycleComplete) {
      const highestScore = Math.max(...teams.map((t) => t.score));

      if (highestScore >= winningScore) {
        const winners = teams.filter((t) => t.score === highestScore);

        if (winners.length === 1) {
          playWinningSound(soundEnabled);
          setGameState('gameEnd');
          return;
        } else {
          setIsTieBreaker(true);
        }
      }

      setRoundNumber((r) => r + 1);
      setCurrentTeamIndex(0);
    } else {
      setCurrentTeamIndex((prev) => prev + 1);
    }

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

  return {
    // State
    teams,
    currentTeamIndex,
    currentTeam,
    teamTheme,
    sortedTeams,
    roundTime,
    winningScore,
    skipPenalty,
    selectedCategories,
    partyModeEnabled,
    soundEnabled,
    setupStep,
    gameState,
    timeLeft,
    currentWord,
    currentTurnWords,
    currentChallenge,
    challengeCompleted,
    roundNumber,
    isTieBreaker,
    countdownValue,
    currentStreak,
    controlMode,
    showRulesModal,
    showConfirmRestart,
    showThemeModal,
    currentTheme,
    activeTheme,
    windowSize,
    totalMatchCorrect,

    // Setters & Actions
    setSetupStep,
    setRoundTime,
    setWinningScore,
    setSkipPenalty,
    setPartyModeEnabled,
    setSoundEnabled,
    setControlMode,
    setGameState,
    setShowRulesModal,
    setShowConfirmRestart,
    setShowThemeModal,
    handleSelectTheme,
    handleAddTeam,
    handleRemoveTeam,
    handleTeamNameChange,
    toggleCategory,
    startCountdown,
    toggleChallengeCompleted,
    handleCorrect,
    handleSkip,
    toggleTurnWordStatus,
    handleConfirmTurnEnd,
    handleStartGame,
    handleRematch,
    handleResetToSetup,
  };
}
