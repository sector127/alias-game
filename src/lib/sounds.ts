// Advanced Web Audio API Synthesizer & Sound FX Engine with iOS/Android low-latency support

let audioCtx: AudioContext | null = null;

export const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;

  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {
        // Handled on first user interaction
      });
    }
    return audioCtx;
  } catch {
    return null;
  }
};

// Polyphonic layered tone builder with ADSR & filter support
interface ToneOptions {
  freq: number;
  type?: OscillatorType;
  duration: number;
  startTimeOffset?: number;
  startGain?: number;
  endGain?: number;
  pitchBendTo?: number;
  filterFreq?: number;
}

const playLayeredTone = (options: ToneOptions) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const {
    freq,
    type = 'sine',
    duration,
    startTimeOffset = 0,
    startGain = 0.25,
    endGain = 0.0001,
    pitchBendTo,
    filterFreq,
  } = options;

  try {
    const startTime = ctx.currentTime + startTimeOffset;
    const stopTime = startTime + duration;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (pitchBendTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(10, pitchBendTo), stopTime);
    }

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(startGain, startTime + Math.min(0.02, duration * 0.2));
    gainNode.gain.exponentialRampToValueAtTime(endGain, stopTime);

    if (filterFreq) {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, startTime);
      osc.connect(filter);
      filter.connect(gainNode);
    } else {
      osc.connect(gainNode);
    }

    gainNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(stopTime);
  } catch {
    // Graceful silent fallback
  }
};

// Haptic vibration feedback for mobile devices
export const triggerHaptic = (
  type: 'tap' | 'success' | 'skip' | 'warning' | 'win' | 'streak' | 'challenge' = 'tap'
) => {
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  try {
    switch (type) {
      case 'tap':
        navigator.vibrate(10);
        break;
      case 'success':
        navigator.vibrate([15, 20, 30]);
        break;
      case 'skip':
        navigator.vibrate([25, 40, 15]);
        break;
      case 'streak':
        navigator.vibrate([30, 30, 50, 30, 70]);
        break;
      case 'challenge':
        navigator.vibrate([20, 20, 20, 20, 40]);
        break;
      case 'warning':
        navigator.vibrate([60, 40, 60]);
        break;
      case 'win':
        navigator.vibrate([100, 50, 100, 50, 200, 50, 300]);
        break;
    }
  } catch {
    // Ignore unsupported devices
  }
};

// ============================================================================
// 1. UI & MENU SOUND EFFECTS
// ============================================================================

/** Tactile UI Button Pop / Tap (Bubble click) */
export const playButtonTapSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('tap');
  playLayeredTone({
    freq: 480,
    type: 'sine',
    duration: 0.06,
    pitchBendTo: 720,
    startGain: 0.18,
  });
};

/** Category & Option Pill Selection */
export const playPillSelectSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('tap');
  playLayeredTone({
    freq: 587.33, // D5
    type: 'triangle',
    duration: 0.08,
    pitchBendTo: 880, // A5
    startGain: 0.2,
  });
};

/** Toggle Switch Sound (On vs Off) */
export const playToggleSound = (isOn = true, soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('tap');
  if (isOn) {
    playLayeredTone({ freq: 523.25, type: 'sine', duration: 0.07, startGain: 0.2 });
    playLayeredTone({ freq: 783.99, type: 'sine', duration: 0.09, startTimeOffset: 0.04, startGain: 0.25 });
  } else {
    playLayeredTone({ freq: 659.25, type: 'sine', duration: 0.07, startGain: 0.2 });
    playLayeredTone({ freq: 440.0, type: 'sine', duration: 0.09, startTimeOffset: 0.04, startGain: 0.18 });
  }
};

/** Modal Open & Close / Navigation */
export const playModalSound = (isOpen = true, soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('tap');
  if (isOpen) {
    playLayeredTone({ freq: 392, type: 'sine', duration: 0.1, startGain: 0.15 });
    playLayeredTone({ freq: 523.25, type: 'sine', duration: 0.12, startTimeOffset: 0.05, startGain: 0.2 });
  } else {
    playLayeredTone({ freq: 523.25, type: 'sine', duration: 0.08, startGain: 0.15 });
    playLayeredTone({ freq: 349.23, type: 'sine', duration: 0.1, startTimeOffset: 0.04, startGain: 0.12 });
  }
};

// ============================================================================
// 2. IN-GAME ACTION SOUND EFFECTS
// ============================================================================

/** Upgraded Melodic Correct Chime (Sparkling Major 9th Arpeggio) */
export const playCorrectSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('success');
  // C6 -> E6 -> G6 -> B6 shimmer
  playLayeredTone({ freq: 1046.5, type: 'sine', duration: 0.15, startGain: 0.35 });
  playLayeredTone({ freq: 1318.51, type: 'sine', duration: 0.18, startTimeOffset: 0.05, startGain: 0.35 });
  playLayeredTone({ freq: 1567.98, type: 'sine', duration: 0.22, startTimeOffset: 0.09, startGain: 0.4 });
  playLayeredTone({ freq: 1975.53, type: 'triangle', duration: 0.25, startTimeOffset: 0.13, startGain: 0.25 });
};

/** Upgraded Smooth Whoosh / Skip Sound */
export const playSkipSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('skip');
  // Gentle downward sweeping whoosh (not harsh or buzzing)
  playLayeredTone({
    freq: 440,
    type: 'triangle',
    duration: 0.14,
    pitchBendTo: 160,
    startGain: 0.25,
    filterFreq: 800,
  });
  playLayeredTone({
    freq: 280,
    type: 'sine',
    duration: 0.16,
    startTimeOffset: 0.04,
    pitchBendTo: 110,
    startGain: 0.2,
  });
};

/** Streak Fire Multiplier Chime (3+, 5+ streak) */
export const playStreakSound = (streakCount: number, soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('streak');
  const base = 523.25 + Math.min(streakCount * 50, 400);
  playLayeredTone({ freq: base, type: 'sine', duration: 0.12, startGain: 0.3 });
  playLayeredTone({ freq: base * 1.25, type: 'triangle', duration: 0.15, startTimeOffset: 0.06, startGain: 0.35 });
  playLayeredTone({ freq: base * 1.5, type: 'sine', duration: 0.2, startTimeOffset: 0.12, startGain: 0.4 });
};

/** Party Challenge Reveal Sparkle Chime */
export const playPartyChallengeSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('challenge');
  // Magical ascending flourish: F5 -> A5 -> C6 -> F6
  playLayeredTone({ freq: 698.46, type: 'sine', duration: 0.18, startGain: 0.25 });
  playLayeredTone({ freq: 880.0, type: 'sine', duration: 0.2, startTimeOffset: 0.07, startGain: 0.3 });
  playLayeredTone({ freq: 1046.5, type: 'triangle', duration: 0.25, startTimeOffset: 0.14, startGain: 0.35 });
  playLayeredTone({ freq: 1396.91, type: 'sine', duration: 0.35, startTimeOffset: 0.21, startGain: 0.4 });
};

/** Subtle Wooden Clock Tick */
export const playTickingSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  playLayeredTone({
    freq: 1200,
    type: 'sine',
    duration: 0.03,
    startGain: 0.12,
    filterFreq: 1800,
  });
};

/** Dramatic 3-2-1 Countdown Beeps */
export const playCountdownBeep = (isFinal = false, soundEnabled = true) => {
  if (!soundEnabled) return;
  if (isFinal) {
    triggerHaptic('challenge');
    // High celebratory GO! burst
    playLayeredTone({ freq: 880, type: 'triangle', duration: 0.22, startGain: 0.4 });
    playLayeredTone({ freq: 1318.51, type: 'sine', duration: 0.28, startTimeOffset: 0.04, startGain: 0.45 });
  } else {
    triggerHaptic('tap');
    // Low resonance prep beep
    playLayeredTone({ freq: 440, type: 'sine', duration: 0.1, startGain: 0.25 });
  }
};

/** Time's Up Round End Gong & Sequence */
export const playTimeUpSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('warning');
  // Deep double bell sequence
  playLayeredTone({ freq: 440, type: 'triangle', duration: 0.25, startGain: 0.35 });
  playLayeredTone({ freq: 349.23, type: 'triangle', duration: 0.25, startTimeOffset: 0.15, startGain: 0.35 });
  playLayeredTone({ freq: 261.63, type: 'sine', duration: 0.45, startTimeOffset: 0.3, startGain: 0.4 });
};

/** Grand Multi-Voice Victory Fanfare */
export const playWinningSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('win');
  // Majestic brass triumphant arpeggio: C5 -> E5 -> G5 -> C6 -> E6
  playLayeredTone({ freq: 523.25, type: 'triangle', duration: 0.2, startGain: 0.35 });
  playLayeredTone({ freq: 659.25, type: 'triangle', duration: 0.2, startTimeOffset: 0.12, startGain: 0.4 });
  playLayeredTone({ freq: 783.99, type: 'triangle', duration: 0.25, startTimeOffset: 0.24, startGain: 0.45 });
  playLayeredTone({ freq: 1046.5, type: 'sine', duration: 0.35, startTimeOffset: 0.36, startGain: 0.5 });
  playLayeredTone({ freq: 1318.51, type: 'sine', duration: 0.7, startTimeOffset: 0.5, startGain: 0.55 });
};
