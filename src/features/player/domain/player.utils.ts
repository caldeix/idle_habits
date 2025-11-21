// Utilidades puras para trabajar con el estado del jugador

import type { PlayerState, PlayerLevelInfo } from './player.types';

// Calcula el nivel del jugador y el progreso dentro del nivel actual
// Regla: nivel 0 -> 1000 XP para subir; nivel 1 -> 1100; nivel 2 -> 1200; etc.
export const calculatePlayerLevel = (totalXp: number): PlayerLevelInfo => {
  let level = 0;
  let remainingXp = totalXp;
  let currentLevelCost = 1000; // coste para subir de 0 a 1

  while (remainingXp >= currentLevelCost) {
    remainingXp -= currentLevelCost;
    level += 1;
    currentLevelCost = 1000 + level * 100;
  }

  return {
    level,
    xpInCurrentLevel: remainingXp,
    xpToNextLevel: currentLevelCost,
  };
};

// Suma recompensas al estado del jugador de forma inmutable
export const addRewardsToPlayer = (
  player: PlayerState,
  xpReward: number,
  coinReward: number,
): PlayerState => ({
  totalXp: player.totalXp + xpReward,
  totalCoins: player.totalCoins + coinReward,
});
