// src/components/GameBoard.jsx
import React, { useEffect, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import Reel from './Reel';
import { Howl, Howler } from 'howler';

// 1️⃣ Charger les images
import zeus      from '../assets/images/eclair-zeus.png';
import athena    from '../assets/images/hiboux.png';
import hades     from '../assets/images/dead.png';
import poseidon  from '../assets/images/trident.png';
import aphrodite from '../assets/images/rose.png';
const symbols = [zeus, athena, hades, poseidon, aphrodite];

// 2️⃣ Initialiser les sons via Howler
const ambientSound = new Howl({
  src: ['/src/assets/audio/ambient.mp3'],
  loop: true,
  volume: 0.3,
});
const spinSound = new Howl({
  src: ['/src/assets/audio/spin.mp3'],
  volume: 0.5,
});
const winSound = new Howl({
  src: ['/src/assets/audio/win.mp3'],
  volume: 0.7,
});

export default function GameBoard() {
  const { balance, bet, setBet, result, lastWin, spin } = useGameLogic();

  // UI states
  const [flash, setFlash]         = useState(false);
  const [muted, setMuted]         = useState(false);
  const [showWin, setShowWin]     = useState(false);
  const [displayWin, setDisplayWin] = useState(0);

  // Auto-spin by count
  const [spinCount, setSpinCount] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(0);
  const [running, setRunning]     = useState(false);

  // Start ambient sound on mount
  useEffect(() => {
    ambientSound.play();
    return () => ambientSound.stop();
  }, []);

  // Mute/unmute global
  useEffect(() => {
    Howler.mute(muted);
  }, [muted]);

  // Flash + overlay + win sound
  useEffect(() => {
    if (lastWin > 0) {
      winSound.play();
      setFlash(true);
      setShowWin(true);
      setDisplayWin(0);
      const duration = 1000;
      const start = Date.now();
      const step = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        setDisplayWin(Math.floor(progress * lastWin));
        if (progress < 1) requestAnimationFrame(step);
        else setTimeout(() => setShowWin(false), 500);
      };
      step();
      const t = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(t);
    }
  }, [lastWin]);

  // Auto-spin sequence effect
  useEffect(() => {
    let id;
    if (running && spinsLeft > 0) {
      id = setTimeout(() => {
        winSound.stop();
        spinSound.play();
        spin();
        setSpinsLeft(s => s - 1);
      }, 700);
    } else if (running) {
      setRunning(false);
    }
    return () => clearTimeout(id);
  }, [running, spinsLeft, spin]);

  // Manual spin handler
  function handleSpin() {
    winSound.stop();
    spinSound.play();
    spin();
  }

  // Start auto-spins
  function startAutoSpins() {
    if (spinCount > 0 && !running) {
      setSpinsLeft(spinCount);
      setRunning(true);
    }
  }

  // Ensure 5 reels displayed
  const display = result.length ? result : Array(5).fill(null);

  return (
    <div className="app-container">
      <header>Machine à Sous</header>

      <main className="game-main">
        {showWin && (
          <div className="win-overlay">
            <span className="win-text">+{displayWin}</span>
          </div>
        )}
        <div className={`reel-wrapper ${flash ? 'flash' : ''}`}>
          <div className="reels">
            {display.map((sym, i) => (
              <Reel
                key={i}
                symbol={sym != null ? symbols[sym] : null}
                index={i}
                spinTrigger={lastWin + balance + i}
              />
            ))}
          </div>
        </div>
      </main>

      <section className="controls">
        {/* Spin manuel rond */}
        <button
          className="spin-button"
          onClick={handleSpin}
          disabled={running}
        >
          Spin
        </button>

        {/* Nombre de spins auto */}
        <div className="auto-spin-control">
          <label>
            Spins:
            <input
              type="number"
              min={0}
              value={spinCount}
              onChange={e => setSpinCount(Number(e.target.value))}
              disabled={running}
              className="interval-input"
            />
          </label>
          <button
            className="spin-button small"
            onClick={startAutoSpins}
            disabled={running || spinCount < 1}
          >
            Go ({spinsLeft})
          </button>
        </div>

        {/* Bouton mute rond */}
        <button
          className="mute-button"
          onClick={() => setMuted(!muted)}
          disabled={running}
        >
          {muted ? '🔇' : '🔊'}
        </button>

        {/* Choix de mise */}
        <div className="info-box">
          <span className="info-label">Mise</span>
          <input
            type="number"
            value={bet}
            min={1}
            max={balance}
            onChange={e => setBet(Number(e.target.value))}
            className="info-value interval-input"
          />
        </div>

        {/* Affichage du solde */}
        <div className="info-box">
          <span className="info-label">Solde</span>
          <span className="info-value">{balance}</span>
        </div>
      </section>

      <footer>Dernier gain: {lastWin}</footer>
    </div>
  );
}
