// src/utils/sound.js

// Crée un contexte audio partagé
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Joue un son de "spin" : un bruit blanc filtré, court et percutant
 */
export function playSpinSound() {
  // Génère un court buffer de bruit blanc
  const bufferSize = audioCtx.sampleRate * 0.2; // 0.2 s
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer;

  // Filtre pour rendre le bruit plus aigu
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(1000, audioCtx.currentTime);

  // Lecture
  noise.connect(filter).connect(audioCtx.destination);
  noise.start();
  noise.stop(audioCtx.currentTime + 0.2);
}

/**
 * Joue un son de "win" : un oscillator montant en fréquence avec enveloppe
 */
export function playWinSound() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, audioCtx.currentTime); // La3
  osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5); // Double en 0.5s

  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.6);
}
