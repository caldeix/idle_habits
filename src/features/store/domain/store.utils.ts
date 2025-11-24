import type { StoreItem, Purchase, StoreState } from './store.types';

export const canAffordItem = (item: StoreItem, quantity: number, playerCoins: number): boolean => {
  return item.stock >= quantity && playerCoins >= item.price * quantity;
};

export const purchaseItem = (
  state: StoreState, 
  itemId: string, 
  quantity: number,
  playerCoins: number
): { success: boolean; updatedState?: StoreState; cost?: number } => {
  const item = state.items.find(i => i.id === itemId);
  
  if (!item || !canAffordItem(item, quantity, playerCoins)) {
    return { success: false };
  }
  
  const cost = item.price * quantity;
  const updatedItems = state.items.map(i => 
    i.id === itemId ? { ...i, stock: i.stock - quantity } : i
  );
  
  const purchase: Purchase = {
    itemId,
    quantity,
    date: new Date().toISOString(),
    totalCost: cost
  };
  
  const updatedState: StoreState = {
    ...state,
    items: updatedItems,
    purchaseHistory: [...state.purchaseHistory, purchase]
  };
  
  return { success: true, updatedState, cost };
};

export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#9ca3af',    // gray-400
    uncommon: '#10b981',  // emerald-500
    rare: '#3b82f6',      // blue-500
    epic: '#8b5cf6',      // violet-500
    legendary: '#f59e0b'  // amber-500
  };
  
  return colors[rarity as keyof typeof colors] || colors.common;
};

export const getNextResetDate = (): string => {
  const now = new Date();
  const nextMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
  const year = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  
  const nextReset = new Date(year, nextMonth, 1);
  return nextReset.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};
