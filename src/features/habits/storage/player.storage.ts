// Módulo responsable de leer y escribir el estado del jugador en localStorage

import type { PlayerState } from '../domain/player.types';

const STORAGE_KEY = 'player';

const defaultPlayerState: PlayerState = {
  totalXp: 0,
  totalCoins: 0,
};

export const loadPlayerState = (): PlayerState => {
  if (typeof window === 'undefined') return defaultPlayerState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPlayerState;

    const parsed = JSON.parse(raw) as Partial<PlayerState>;

    return {
      totalXp: parsed.totalXp ?? 0,
      totalCoins: parsed.totalCoins ?? 0,
    };
  } catch (error) {
    console.error('Error loading player from localStorage', error);
    return defaultPlayerState;
  }
};

export const savePlayerState = (state: PlayerState): void => {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Error saving player to localStorage', error);
  }
};
