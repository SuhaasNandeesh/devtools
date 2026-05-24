let audioCtx: AudioContext | null = null;
let audioMutedGlobal = true; // Default to muted by default as requested!

if (typeof localStorage !== 'undefined') {
  const cachedMute = localStorage.getItem('devtools_audio_muted');
  if (cachedMute !== null) {
    audioMutedGlobal = cachedMute === 'true';
  }
}

export const setAudioMutedGlobal = (muted: boolean) => {
  audioMutedGlobal = muted;
};

export const playFeedbackSound = (type: 'click' | 'success') => {
  if (audioMutedGlobal) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);
      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'success') {
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      gainNode.connect(audioCtx.destination);

      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
      osc1.connect(gainNode);

      const osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25);
      osc2.connect(gainNode);

      osc1.start(now);
      osc1.stop(now + 0.25);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.25);
    }
  } catch (err) {
    console.warn('Audio feedback failed:', err);
  }
};

if (typeof window !== 'undefined') {
  (window as any).playFeedbackSound = playFeedbackSound;
}
