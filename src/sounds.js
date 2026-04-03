// ============================================
// SOUND ENGINE - Web Audio API
// Noir ambient sounds without external files
// ============================================

let audioCtx = null;
let rainNode = null;
let rainGain = null;
let isMuted = false;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// --- AMBIENT RAIN ---
export function startRain() {
  if (rainNode) return;
  const ctx = getCtx();
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  rainNode = ctx.createBufferSource();
  rainNode.buffer = buffer;
  rainNode.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;

  const filter2 = ctx.createBiquadFilter();
  filter2.type = 'highpass';
  filter2.frequency.value = 80;

  rainGain = ctx.createGain();
  rainGain.gain.value = isMuted ? 0 : 0.08;

  rainNode.connect(filter);
  filter.connect(filter2);
  filter2.connect(rainGain);
  rainGain.connect(ctx.destination);
  rainNode.start();
}

export function stopRain() {
  if (rainNode) {
    rainNode.stop();
    rainNode.disconnect();
    rainNode = null;
    rainGain = null;
  }
}

// --- SHORT SOUND EFFECTS ---
function playTone(freq, duration, type = 'sine', volume = 0.15) {
  if (isMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playNoiseBurst(duration, volume = 0.1) {
  if (isMuted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 1;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

// Door creak: low frequency sweep
export function playDoorSound() {
  if (isMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(60, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.15);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4);
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}

// Item discovery: ascending chime
export function playDiscoverySound() {
  playTone(523, 0.15, 'sine', 0.1);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.1), 80);
  setTimeout(() => playTone(784, 0.25, 'sine', 0.12), 160);
}

// Typewriter click
export function playTypewriterClick() {
  playNoiseBurst(0.03, 0.06);
}

// Error / wrong code
export function playErrorSound() {
  playTone(200, 0.2, 'square', 0.08);
  setTimeout(() => playTone(150, 0.3, 'square', 0.06), 150);
}

// Success
export function playSuccessSound() {
  playTone(440, 0.12, 'sine', 0.1);
  setTimeout(() => playTone(554, 0.12, 'sine', 0.1), 100);
  setTimeout(() => playTone(659, 0.12, 'sine', 0.1), 200);
  setTimeout(() => playTone(880, 0.3, 'sine', 0.12), 300);
}

// Keypad beep
export function playKeypadBeep() {
  playTone(800, 0.05, 'sine', 0.05);
}

// --- MUTE TOGGLE ---
export function toggleMute() {
  isMuted = !isMuted;
  if (rainGain) {
    rainGain.gain.value = isMuted ? 0 : 0.08;
  }
  return isMuted;
}

export function getMuted() {
  return isMuted;
}
