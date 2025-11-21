import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { loadPlayerState, savePlayerState } from '../storage/player.storage';
import type { PlayerState } from '../domain/player.types';
import { calculatePlayerLevel, addRewardsToPlayer } from '../domain/player.utils';

interface PlayerContextType {
  player: PlayerState;
  levelInfo: ReturnType<typeof calculatePlayerLevel>;
  addRewards: (xp: number, coins: number) => void;
  setPlayer: (player: PlayerState) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayerState] = useState<PlayerState>(() => loadPlayerState());
  const [levelInfo, setLevelInfo] = useState(() => calculatePlayerLevel(player.totalXp));

  // Update level info when XP changes
  useEffect(() => {
    setLevelInfo(calculatePlayerLevel(player.totalXp));
  }, [player.totalXp]);

  // Save to localStorage when player state changes
  useEffect(() => {
    savePlayerState(player);
  }, [player]);

  const addRewards = (xp: number, coins: number) => {
    setPlayerState(prev => ({
      ...addRewardsToPlayer(prev, xp, coins)
    }));
  };

  const setPlayer = (newPlayer: PlayerState) => {
    setPlayerState(newPlayer);
  };

  return (
    <PlayerContext.Provider value={{ player, levelInfo, addRewards, setPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
