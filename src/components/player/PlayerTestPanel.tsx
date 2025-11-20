import { useEffect, useState } from 'react';
import { loadPlayerState } from '../../features/habits/storage/player.storage';
import { calculatePlayerLevel } from '../../features/habits/domain/player.utils';
import type { PlayerState } from '../../features/habits/domain/player.types';

export function PlayerTestPanel() {
  const [player, setPlayer] = useState<PlayerState>(() => loadPlayerState());

  useEffect(() => {
    // Pequeño efecto para recargar el estado cuando se monte el componente
    setPlayer(loadPlayerState());
  }, []);

  const handleReload = () => {
    setPlayer(loadPlayerState());
  };

  const levelInfo = calculatePlayerLevel(player.totalXp);

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
      <h2>Player test</h2>
      <p>Total XP: {player.totalXp}</p>
      <p>Monedas: {player.totalCoins}</p>
      <p>Nivel: {levelInfo.level}</p>
      <p>
        Progreso nivel: {levelInfo.xpInCurrentLevel} / {levelInfo.xpToNextLevel} XP
      </p>
      <button type="button" onClick={handleReload}>
        Recargar estado del jugador
      </button>
    </div>
  );
}
