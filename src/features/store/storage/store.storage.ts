import type { StoreState } from '../domain/store.types';
import { STORE_ITEMS } from '../domain/store.constants';

const STORAGE_KEY = 'idle-habit-store';

export const loadStoreState = (): StoreState => {
  try {
    console.log('Cargando estado de la tienda...');
    const savedState = localStorage.getItem(STORAGE_KEY);
    
    if (!savedState) {
      console.log('No se encontró estado guardado, inicializando tienda...');
      return initializeStore();
    }
    
    const parsedState = JSON.parse(savedState) as StoreState;
    console.log('Estado cargado del localStorage:', parsedState);
    
    const lastReset = new Date(parsedState.lastReset);
    const now = new Date();
    
    // Verificar si necesitamos reiniciar la tienda (si el último reinicio fue en un mes anterior)
    if (lastReset.getMonth() < now.getMonth() || 
        lastReset.getFullYear() < now.getFullYear()) {
      // Si el día actual es mayor o igual a 1, reiniciamos
      if (now.getDate() >= 1) {
        console.log('Reiniciando stock de la tienda...');
        return resetStoreStock(parsedState);
      }
    }
    
    return parsedState;
  } catch (error) {
    console.error('Error loading store state:', error);
    return initializeStore();
  }
};

export const saveStoreState = (state: StoreState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving store state:', error);
  }
};

export const initializeStore = (): StoreState => {
  const now = new Date();
  const initialState: StoreState = {
    items: STORE_ITEMS.map(item => ({
      ...item,
      stock: item.maxStock
    })),
    purchaseHistory: [],
    lastReset: now.toISOString()
  };
  
  saveStoreState(initialState);
  return initialState;
};

const resetStoreStock = (currentState: StoreState): StoreState => {
  const now = new Date();
  const updatedState: StoreState = {
    ...currentState,
    items: currentState.items.map(item => ({
      ...item,
      stock: STORE_ITEMS.find(i => i.id === item.id)?.maxStock || item.maxStock
    })),
    lastReset: now.toISOString()
  };
  
  saveStoreState(updatedState);
  return updatedState;
};
