// Módulo responsable de leer y escribir la configuración (settings) en localStorage

import type { SettingsState } from '../domain/settings.types';

const STORAGE_KEY = 'settings';

const defaultSettings: SettingsState = {
  playerName: 'Player',
};

export const loadSettings = (): SettingsState => {
  if (typeof window === 'undefined') return defaultSettings;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;

    const parsed = JSON.parse(raw) as Partial<SettingsState>;

    return {
      playerName: parsed.playerName ?? defaultSettings.playerName,
    };
  } catch (error) {
    console.error('Error loading settings from localStorage', error);
    return defaultSettings;
  }
};

export const saveSettings = (settings: SettingsState): void => {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify(settings);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Error saving settings to localStorage', error);
  }
};
