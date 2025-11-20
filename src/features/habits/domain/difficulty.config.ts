// Configuración de las dificultades disponibles para los hábitos
// Esta configuración se usa para determinar cuánta XP y monedas otorga
// un hábito al ser completado según su dificultad.

import type { HabitDifficultyId } from './habit.types';

export interface DifficultyConfig {
  id: HabitDifficultyId;
  label: string;
  xpReward: number;
  coinReward: number;
}

export const DIFFICULTIES: Record<HabitDifficultyId, DifficultyConfig> = {
  'easy': {
    id: 'easy',
    label: 'Muy fácil',
    xpReward: 25,
    coinReward: 5,
  },
  'easy-medium': {
    id: 'easy-medium',
    label: 'Fácil',
    xpReward: 40,
    coinReward: 8,
  },
  'medium': {
    id: 'medium',
    label: 'Normal',
    xpReward: 60,
    coinReward: 12,
  },
  'medium-hard': {
    id: 'medium-hard',
    label: 'Difícil',
    xpReward: 90,
    coinReward: 18,
  },
  'hard': {
    id: 'hard',
    label: 'Muy difícil',
    xpReward: 130,
    coinReward: 25,
  },
};
