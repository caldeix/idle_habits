import { useEffect, useState } from 'react';
import { loadPlayerState } from '../../features/habits/storage/player.storage';
import { calculatePlayerLevel } from '../../features/habits/domain/player.utils';
import type { PlayerState } from '../../features/habits/domain/player.types';
import { loadSettings, saveSettings } from '../../features/habits/storage/settings.storage';
import type { SettingsState } from '../../features/habits/domain/settings.types';
import { StorageJsonTestButton } from './StorageJsonTestButton';


export function PlayerTestPanel() {
  const [player, setPlayer] = useState<PlayerState>(() => loadPlayerState());
  const [settings, setSettings] = useState<SettingsState>(() => loadSettings());
  const [playerNameInput, setPlayerNameInput] = useState<string>(
    () => loadSettings().playerName,
  );

  useEffect(() => {
    // Pequeño efecto para recargar el estado cuando se monte el componente
    setPlayer(loadPlayerState());
    setSettings(loadSettings());
    setPlayerNameInput(loadSettings().playerName);
  }, []);

  const handleReload = () => {
    setPlayer(loadPlayerState());
    const reloadedSettings = loadSettings();
    setSettings(reloadedSettings);
    setPlayerNameInput(reloadedSettings.playerName);
  };

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

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
      <h2>Player test</h2>

      <h3>Configuración</h3>
      <p>Nombre actual del jugador: {settings.playerName}</p>
      <input
        placeholder="Nombre del jugador"
        value={playerNameInput}
        onChange={(event) => setPlayerNameInput(event.target.value)}
      />
      <button type="button" onClick={handleSavePlayerName}>
        Guardar nombre
      </button>

      <hr />

      <h3>Estado del jugador</h3>
      <p>Total XP: {player.totalXp}</p>
      <p>Monedas: {player.totalCoins}</p>
      <p>Nivel: {levelInfo.level}</p>
      <p>
        Progreso nivel: {levelInfo.xpInCurrentLevel} / {levelInfo.xpToNextLevel} XP
      </p>
      <button type="button" onClick={handleReload}>
        Recargar estado del jugador
      </button>

      <hr />

      <h3>Backup JSON (test)</h3>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <StorageJsonTestButton mode="export" />
        <StorageJsonTestButton mode="import" />
        <StorageJsonTestButton mode="deleteall" />
      </div>
    </div>
  );
}
