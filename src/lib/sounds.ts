// Web Audio API Synthesized Sound Engine with iOS/Android suspended context support

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;

  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {
        // Ignored if browser blocks before first user gesture
      });
    }
    return audioCtx;
  } catch {
    return null;
  }
};

// Play a tone with envelope control
const playTone = (
  freq: number,
  type: OscillatorType,
  duration: number,
  startTimeOffset = 0,
  startGain = 0.25,
  endGain = 0.001
) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTimeOffset);

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime + startTimeOffset);
    gainNode.gain.exponentialRampToValueAtTime(startGain, ctx.currentTime + startTimeOffset + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(endGain, ctx.currentTime + startTimeOffset + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime + startTimeOffset);
    osc.stop(ctx.currentTime + startTimeOffset + duration);
  } catch {
    // Graceful fallback
  }
};

// Haptic vibration feedback for mobile
export const triggerHaptic = (type: 'success' | 'skip' | 'warning' | 'win' = 'success') => {
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  try {
    switch (type) {
      case 'success':
        navigator.vibrate(30);
        break;
      case 'skip':
        navigator.vibrate([20, 30, 20]);
        break;
      case 'warning':
        navigator.vibrate(50);
        break;
      case 'win':
        navigator.vibrate([100, 50, 100, 50, 200]);
        break;
    }
  } catch {
    // Ignore unsupported devices
  }
};

// Sound effects
export const playCorrectSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('success');
  // Cheerful major chord ding (E5 -> A5)
  playTone(659.25, 'sine', 0.12, 0, 0.3);
  playTone(880.0, 'sine', 0.18, 0.08, 0.35);
};

export const playSkipSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('skip');
  // Downward subtle swipe tone
  playTone(320, 'triangle', 0.12, 0, 0.25);
  playTone(220, 'triangle', 0.14, 0.06, 0.2);
};

export const playTickingSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  // High crisp woodblock/tick
  playTone(950, 'sine', 0.04, 0, 0.15);
};

export const playTimeUpSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('warning');
  // Friendly alarm sequence
  playTone(523.25, 'triangle', 0.15, 0, 0.3);
  playTone(440.0, 'triangle', 0.15, 0.12, 0.3);
  playTone(349.23, 'sawtooth', 0.35, 0.24, 0.25);
};

export const playWinningSound = (soundEnabled = true) => {
  if (!soundEnabled) return;
  triggerHaptic('win');
  // Fanfare victory chords (C5 -> E5 -> G5 -> C6)
  playTone(523.25, 'sine', 0.2, 0, 0.3);
  playTone(659.25, 'sine', 0.2, 0.12, 0.35);
  playTone(783.99, 'sine', 0.25, 0.24, 0.4);
  playTone(1046.5, 'sine', 0.6, 0.38, 0.45);
};

export const playCountdownBeep = (isFinal = false, soundEnabled = true) => {
  if (!soundEnabled) return;
  if (isFinal) {
    playTone(880, 'sine', 0.25, 0, 0.4);
  } else {
    playTone(440, 'sine', 0.12, 0, 0.25);
  }
};
