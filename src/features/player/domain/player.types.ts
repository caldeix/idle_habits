// Tipos relacionados con el estado del jugador (XP total, monedas, etc.)

export interface PlayerState {
  totalXp: number;
  totalCoins: number;
}

export interface PlayerLevelInfo {
  level: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
}
