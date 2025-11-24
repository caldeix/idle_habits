export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  maxStock: number;
  icon: string; // Emoji o código de icono
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Purchase {
  itemId: string;
  quantity: number;
  date: string; // ISO string
  totalCost: number;
}

export interface StoreState {
  items: StoreItem[];
  purchaseHistory: Purchase[];
  lastReset: string; // ISO string
}

export interface PurchaseResult {
  success: boolean;
  cost: number;
}

export interface StoreContextType {
  items: StoreItem[];
  purchaseItem: (itemId: string, quantity: number, playerCoins: number) => PurchaseResult;
  getPurchaseHistory: () => Purchase[];
  isStoreOpen: boolean;
  openStore: () => void;
  closeStore: () => void;
  playerCoins: number;
  nextResetDate: string;
}

export const INITIAL_STORE_STATE: StoreState = {
  items: [],
  purchaseHistory: [],
  lastReset: new Date().toISOString()
};
