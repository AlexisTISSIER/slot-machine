 // src/utils/random.js
/**
 * Tire aléatoirement une suite de symboles
 * @param {number} reels — nombre de rouleaux
 * @param {number} symbolCount — nombre de symboles
 * @returns {number[]}
 */
export function spinReels(reels = 5, symbolCount = 6) {
  return Array.from({ length: reels }, () =>
    Math.floor(Math.random() * symbolCount)
  );
}