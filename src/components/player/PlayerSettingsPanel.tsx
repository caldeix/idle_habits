import { useState, useEffect } from 'react';
import { loadPlayerState } from '../../features/habits/storage/player.storage';
import { calculatePlayerLevel } from '../../features/habits/domain/player.utils';
import type { PlayerState } from '../../features/habits/domain/player.types';
import { loadSettings, saveSettings } from '../../features/habits/storage/settings.storage';
import type { SettingsState } from '../../features/habits/domain/settings.types';
import { onPlayerUpdated } from '../../features/habits/events/player.events';
import './PlayerSettingsPanel.css';



export function PlayerSettingsPanel() {
  const [player, setPlayer] = useState<PlayerState>(() => loadPlayerState());
  const [settings, setSettings] = useState<SettingsState>(() => loadSettings());
  const [playerNameInput, setPlayerNameInput] = useState<string>(
    () => loadSettings().playerName,
  );

  // Efecto para suscribirse a los cambios del jugador
  useEffect(() => {
    // Función para actualizar el estado del jugador
    const updatePlayerState = () => {
      setPlayer(loadPlayerState());
    };

    // Suscribirse al evento de actualización del jugador
    const unsubscribe = onPlayerUpdated(updatePlayerState);

    // Cargar el estado inicial
    updatePlayerState();

    // Limpiar la suscripción al desmontar el componente
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSavePlayerName = () => {
    const trimmed = playerNameInput.trim();
    if (!trimmed) return;

    const updated: SettingsState = {
      ...settings,
      playerName: trimmed,
    };

    saveSettings(updated);
    setSettings(updated);
  };

  const levelInfo = calculatePlayerLevel(player.totalXp);

  // Calcular el progreso del nivel en porcentaje
  const levelProgress = (levelInfo.xpInCurrentLevel / levelInfo.xpToNextLevel) * 100;
  const playerInitial = settings.playerName ? settings.playerName.charAt(0).toUpperCase() : 'P';

  return (
    <div className="player-card">
      <div className="player-header">
        <div className="player-avatar" title={`Nivel ${levelInfo.level}`}>
          {playerInitial}
        </div>
        <h2 className="player-name">{settings.playerName || 'Jugador'}</h2>
        <div className="level-display">Nivel {levelInfo.level}</div>
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-label">
            <span>Experiencia</span>
            <span>{levelInfo.xpInCurrentLevel} / {levelInfo.xpToNextLevel} XP</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="coins-display">
          {player.totalCoins} monedas
        </div>
      </div>

      <div className="player-actions" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Nuevo nombre"
            value={playerNameInput}
            onChange={(event) => setPlayerNameInput(event.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '5px',
              border: '1px solid #3498db',
              background: 'rgba(0,0,0,0.2)',
              color: '#ecf0f1',
              flex: 1
            }}
          />
          <button 
            onClick={handleSavePlayerName}
            style={{
              padding: '0.5rem 1rem',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#2980b9'}
            onMouseOut={(e) => e.currentTarget.style.background = '#3498db'}
          >
            Cambiar
          </button>
        </div>
      </div>
    </div>
  );
}
