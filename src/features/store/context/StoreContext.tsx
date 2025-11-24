import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadStoreState, saveStoreState } from '../storage/store.storage';
import { purchaseItem as purchaseItemUtil, getNextResetDate } from '../domain/store.utils';
import type { StoreContextType, StoreItem } from '../domain/store.types';
import { usePlayer } from '../../player/context/PlayerContext';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(() => {
    const loadedState = loadStoreState();
    console.log('Estado inicial de la tienda cargado:', loadedState);
    return loadedState;
  });
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const { player, addRewards } = usePlayer(); // Usamos addRewards para restar monedas
  
  // Efecto para verificar el estado de la tienda
  useEffect(() => {
    console.log('Estado actual de la tienda:', state);
  }, [state]);

  // Actualizar el almacenamiento cuando cambia el estado
  useEffect(() => {
    saveStoreState(state);
  }, [state]);

  const purchaseItem = useCallback((itemId: string, quantity: number, price: number) => {
    // Primero verificamos si el jugador tiene suficientes monedas
    if (player.totalCoins < price * quantity) {
      return { success: false, cost: 0 };
    }

    const { success, updatedState } = purchaseItemUtil(
      state,
      itemId,
      quantity,
      player.totalCoins
    );

    if (success && updatedState) {
      // Restamos las monedas usando addRewards (pasamos monedas negativas)
      addRewards(0, -price * quantity);
      setState(updatedState);
      return { success: true, cost: price * quantity };
    }
    
    return { success: false, cost: 0 };
  }, [state, player.totalCoins, addRewards]);

  const getPurchaseHistory = useCallback(() => {
    return [...state.purchaseHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [state.purchaseHistory]);

const openStore = useCallback(() => {
  console.log('Abriendo tienda...');
  setIsStoreOpen(true);
}, []);

const closeStore = useCallback(() => {
  console.log('Cerrando tienda...');
  setIsStoreOpen(false);
}, []);

  const updateStoreItem = useCallback((itemId: string, updatedItem: StoreItem) => {
    setState(prevState => ({
      ...prevState,
      items: prevState.items.map(item => 
        item.id === itemId ? { ...updatedItem } : item
      )
    }));
  }, []);

  const addStoreItem = useCallback((newItem: StoreItem, cost: number) => {
    // Deduct coins for creating a new item
    addRewards(0, -cost);
    
    setState(prevState => ({
      ...prevState,
      items: [...prevState.items, newItem]
    }));
  }, [addRewards]);

  const removeStoreItem = useCallback((itemId: string) => {
    // Add coins back when deleting an item
    addRewards(0, 25);
    
    setState(prevState => ({
      ...prevState,
      items: prevState.items.filter(item => item.id !== itemId)
    }));
  }, [addRewards]);

  const value = {
    items: state.items,
    purchaseItem,
    getPurchaseHistory,
    isStoreOpen,
    openStore,
    closeStore,
    playerCoins: player.totalCoins,
    nextResetDate: getNextResetDate(),
    updateStoreItem,
    addStoreItem,
    removeStoreItem
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
