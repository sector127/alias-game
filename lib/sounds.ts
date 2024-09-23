let audioContext = null;

// Initialize the AudioContext after a user gesture
const initAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
};

const createSound = (frequency, duration) => {
    if (!audioContext) return; // Make sure the AudioContext has been initialized
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
};

// Ensure play functions initialize the AudioContext first
export const playCorrectSound = () => {
    initAudioContext(); // Initialize audio context before playing
    createSound(800, 0.15); // Higher pitch, short duration
    setTimeout(() => createSound(1000, 0.15), 150); // Even higher pitch, played right after
};

export const playSkipSound = () => {
    initAudioContext(); // Initialize audio context before playing
    createSound(300, 0.15); // Lower pitch, short duration
    setTimeout(() => createSound(200, 0.15), 150); // Even lower pitch, played right after
};

export const playTimeUpSound = () => {
    initAudioContext(); // Initialize audio context before playing
    createSound(400, 0.1);
    setTimeout(() => createSound(300, 0.1), 100);
    setTimeout(() => createSound(200, 0.1), 200);
};

export const playTickingSound = () => {
    initAudioContext(); // Ensure AudioContext is initialized
    createSound(500, 0.05); // Short low-pitched sound for ticking
};

export const playWinningSound = () => {
    initAudioContext(); // Ensure AudioContext is initialized before playing
    createSound(1200, 0.2); // High pitch for winning
    setTimeout(() => createSound(1400, 0.2), 200); // Even higher pitch right after
    setTimeout(() => createSound(1600, 0.2), 400); // Even higher pitch again
};

