import { spinReels } from './random.js';
import { paytable }  from './paytable.js';

function simulate(spins = 1_000_000) {
  let totalBet = 0;
  let totalWin = 0;
  for (let i = 0; i < spins; i++) {
    totalBet += 1;               // mise = 1 par spin
    const res = spinReels();
    // calcul de gain basique : tous identiques
    const sym = res[0];
    const allSame = res.every(s => s === sym);
    if (allSame && paytable[sym]) {
      const count = res.length;
      const key = ['three', 'four', 'five'][count - 3];
      totalWin += (paytable[sym][key] || 0);
    }
  }
  console.log('RTP simulé:', (totalWin / totalBet) * 100);
}

simulate();
