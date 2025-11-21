import { useState, useEffect } from 'react';
import { loadPlayerState } from '../../features/habits/storage/player.storage';
import { calculatePlayerLevel } from '../../features/habits/domain/player.utils';
import type { PlayerState } from '../../features/habits/domain/player.types';
import { loadSettings, saveSettings } from '../../features/habits/storage/settings.storage';
import type { SettingsState } from '../../features/habits/domain/settings.types';
import { onPlayerUpdated } from '../../features/habits/events/player.events';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { FaCoins } from 'react-icons/fa';
import './PlayerSettingsPanel.css';



export function PlayerSettingsPanel() {
  const [player, setPlayer] = useState<PlayerState>(() => loadPlayerState());
  const [settings, setSettings] = useState<SettingsState>(() => loadSettings());
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');

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

  const handleStartEditing = () => {
    setTempName(settings.playerName);
    setIsEditing(true);
  };

  const handleSavePlayerName = () => {
    const trimmed = tempName.trim();
    if (!trimmed) return;

    const updated: SettingsState = {
      ...settings,
      playerName: trimmed,
    };

    saveSettings(updated);
    setSettings(updated);
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
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
        <div className="name-edit-container">
          {isEditing ? (
            <div className="edit-name-container">
              <input
                type="text"
                className="name-edit-input"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
              />
              <button 
                className="icon-button confirm-button" 
                onClick={handleSavePlayerName}
                title="Guardar cambios"
              >
                <FiCheck />
              </button>
              <button 
                className="icon-button cancel-button"
                onClick={handleCancelEditing}
                title="Cancelar"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <div className="name-display">
              <h2 className="player-name">{settings.playerName || 'Jugador'}</h2>
              <button 
                className="icon-button edit-button" 
                onClick={handleStartEditing}
                title="Editar nombre"
              >
                <FiEdit2 />
              </button>
            </div>
          )}
          <div className="level-display">Nivel {levelInfo.level}</div>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-label">
            <span></span>
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
          <FaCoins className="coins-icon" />
          <span className="coins-amount">{player.totalCoins}</span>
        </div>
      </div>

    </div>
  );
}
