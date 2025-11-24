import type { StoreItem } from './store.types';

export const STORE_ITEMS: Omit<StoreItem, 'stock'>[] = [
  {
    id: 'movie_night',
    name: 'Ir al cine',
    description: 'Disfruta de una película en el cine',
    price: 500,
    maxStock: 2,
    icon: '🎬',
    rarity: 'uncommon',
  },
  {
    id: 'soda',
    name: 'Refresco',
    description: 'Tómate un refresco bien frío',
    price: 150,
    maxStock: 5,
    icon: '🥤',
    rarity: 'common',
  },
  {
    id: 'day_off',
    name: 'Día libre',
    description: 'Tómate un día libre de tus hábitos',
    price: 1000,
    maxStock: 1,
    icon: '🏖️',
    rarity: 'rare',
  },
  {
    id: 'junk_food',
    name: 'Comida basura',
    description: 'Déjate llevar por la comida basura',
    price: 750,
    maxStock: 3,
    icon: '🍔',
    rarity: 'uncommon',
  },
  {
    id: 'treat_yourself',
    name: 'Capricho',
    description: 'Cómprame algo que te haga feliz',
    price: 1500,
    maxStock: 1,
    icon: '💝',
    rarity: 'epic',
  },
];