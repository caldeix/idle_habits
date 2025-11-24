import { DIFFICULTIES } from './difficulty.config';

const now = new Date().toISOString();

export const DEFAULT_HABITS = [
  {
    id: 'read',
    name: 'Leer',
    description: 'Leer durante 30 minutos',
    difficultyId: 'medium' as const,
    frequency: 'daily' as const,
    streak: 0,
    lastCompleted: null,
    xpReward: DIFFICULTIES.medium.xpReward,
    coinReward: DIFFICULTIES.medium.coinReward,
    createdAt: now
  },
  {
    id: 'exercise',
    name: 'Hacer ejercicio',
    description: 'Hacer 30 minutos de ejercicio',
    difficultyId: 'medium' as const,
    frequency: 'daily' as const,
    streak: 0,
    lastCompleted: null,
    xpReward: DIFFICULTIES.medium.xpReward,
    coinReward: DIFFICULTIES.medium.coinReward,
    createdAt: now
  },
  {
    id: 'sleep_early',
    name: 'Dormir temprano',
    description: 'Acostarse antes de las 11 PM',
    difficultyId: 'easy' as const,
    frequency: 'daily' as const,
    streak: 0,
    lastCompleted: null,
    xpReward: DIFFICULTIES.easy.xpReward,
    coinReward: DIFFICULTIES.easy.coinReward,
    createdAt: now
  },
  {
    id: 'wake_up_early',
    name: 'Levantarse temprano',
    description: 'Levantarse antes de las 7 AM',
    difficultyId: 'hard' as const,
    frequency: 'daily' as const,
    streak: 0,
    lastCompleted: null,
    xpReward: DIFFICULTIES.hard.xpReward,
    coinReward: DIFFICULTIES.hard.coinReward,
    createdAt: now
  },
  {
    id: 'healthy_eating',
    name: 'Comer sano',
    description: 'Comer al menos 3 comidas saludables al día',
    difficultyId: 'medium' as const,
    frequency: 'daily' as const,
    streak: 0,
    lastCompleted: null,
    xpReward: DIFFICULTIES.medium.xpReward,
    coinReward: DIFFICULTIES.medium.coinReward,
    createdAt: now
  }
] as const;