// src/hooks/useGameLogic.js
import { useState } from 'react';
import { spinReels }  from '../utils/random';
import { paytable }   from '../utils/paytable';

export function useGameLogic({
  initialBalance = 100,
  betAmount     = 1,
  reels         = 5,
  symbolCount   = 6,
  twoChance     = 0.1,  // 10% de chance de payer le palier "two"
} = {}) {
  const [balance, setBalance] = useState(initialBalance);
  const [bet,     setBet]     = useState(betAmount);
  const [result,  setResult]  = useState(Array(reels).fill(null));
  const [lastWin, setLastWin] = useState(0);

  function spin() {
    // Retirer la mise
    setBalance(b => b - bet);

    // Tirage
    const res = spinReels(reels, symbolCount);
    setResult(res);

    // Comptage des occurrences
    const countsMap = res.reduce((map, sym) => {
      map[sym] = (map[sym] || 0) + 1;
      return map;
    }, {});

    // Symbole le plus fréquent
    const [sym, count] = Object.entries(countsMap).reduce(
      (prev, curr) => (curr[1] > prev[1] ? curr : prev),
      [null, 0]
    );

    // Déterminer le multiplicateur
    let multiplier = 0;
    if (count >= 2 && paytable[sym]) {
      if (count >= 5) multiplier = paytable[sym].five;
      else if (count >= 4) multiplier = paytable[sym].four;
      else if (count >= 3) multiplier = paytable[sym].three;
      else if (count === 2) {
        // Appliquer une probabilité pour les petits gains
        if (Math.random() < twoChance) {
          multiplier = paytable[sym].two;
        }
      }
    }

    // Verser le gain
    const winAmount = multiplier * bet;
    setLastWin(winAmount);
    setBalance(b => b + winAmount);
  }

  return { balance, bet, setBet, result, lastWin, spin };
}
