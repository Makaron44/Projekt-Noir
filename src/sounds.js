// ============================================
// SOUND ENGINE - Web Audio API
// Noir ambient sounds without external files
// ============================================

let audioCtx = null;
let rainNodes = [];
let rainGain = null;
let dropletInterval = null;
let isMuted = false;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Helper: create a looping noise buffer with given filter
function createNoiseLayer(ctx, cutoff, filterType, Q, volume) {
  const bufferSize = 4 * ctx.sampleRate;
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
  
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    // Brown noise (smoother) - integrate white noise
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + (0.02 * white)) / 1.02;
      data[i] = lastOut * 3.5;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = cutoff;
  filter.Q.value = Q;

  const gain = ctx.createGain();
  gain.gain.value = volume;

  source.connect(filter);
  filter.connect(gain);
  return { source, gain };
}

// --- AMBIENT RAIN (realistic, multi-layer) ---
export function startRain() {
  if (rainNodes.length > 0) return;
  const ctx = getCtx();
  
  rainGain = ctx.createGain();
  rainGain.gain.value = isMuted ? 0 : 1;
  rainGain.connect(ctx.destination);

  // Layer 1: Deep rumble (distant thunder/wind) 
  const deep = createNoiseLayer(ctx, 150, 'lowpass', 0.5, 0.06);
  deep.gain.connect(rainGain);
  deep.source.start();
  rainNodes.push(deep);

  // Layer 2: Mid rain wash (main body of rain)
  const mid = createNoiseLayer(ctx, 800, 'bandpass', 0.8, 0.035);
  mid.gain.connect(rainGain);
  mid.source.start();
  rainNodes.push(mid);

  // Layer 3: Gentle high patter (individual drops on window)
  const high = createNoiseLayer(ctx, 3000, 'bandpass', 2, 0.012);
  high.gain.connect(rainGain);
  high.source.start();
  rainNodes.push(high);

  // Layer 4: Random droplet plinks
  startDroplets(ctx);
}

function startDroplets(ctx) {
  if (dropletInterval) return;
  
  function playDroplet() {
    if (isMuted) return;
    const freq = 2000 + Math.random() * 4000;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.008 + Math.random() * 0.008, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(rainGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  function scheduleNext() {
    const delay = 100 + Math.random() * 350;
    dropletInterval = setTimeout(() => {
      playDroplet();
      scheduleNext();
    }, delay);
  }
  scheduleNext();
}

export function stopRain() {
  rainNodes.forEach(n => { n.source.stop(); n.source.disconnect(); n.gain.disconnect(); });
  rainNodes = [];
  rainGain = null;
  if (dropletInterval) { clearTimeout(dropletInterval); dropletInterval = null; }
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
    rainGain.gain.value = isMuted ? 0 : 1;
  }
  return isMuted;
}

export function getMuted() {
  return isMuted;
}
