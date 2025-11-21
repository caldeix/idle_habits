import { useRef } from 'react';
import './StorageJsonTestButton.css';

export type StorageJsonButtonMode = 'export' | 'import' | 'deleteall';

interface StorageJsonTestButtonProps {
  mode: StorageJsonButtonMode;
}

const EXPORT_FILENAME = 'idle-habit-backup.json';

export function StorageJsonTestButton({ mode }: StorageJsonTestButtonProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    const snapshot = {
      settings: window.localStorage.getItem('settings'),
      player: window.localStorage.getItem('player'),
      habits: window.localStorage.getItem('habits'),
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = EXPORT_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  };

  const handleImportFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text) as {
          settings?: string | null;
          player?: string | null;
          habits?: string | null;
        };

        if (parsed.settings != null) {
          window.localStorage.setItem('settings', parsed.settings);
        }
        if (parsed.player != null) {
          window.localStorage.setItem('player', parsed.player);
        }
        if (parsed.habits != null) {
          window.localStorage.setItem('habits', parsed.habits);
        }
      } catch (error) {
        console.error('Error importing backup JSON', error);
      }
    };

    reader.readAsText(file);
  };

  const handleDeleteAll = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  if (mode === 'deleteall') {
    return (
      <div className="storage-buttons-container">
        <button 
          type="button" 
          className="storage-button delete"
          onClick={handleDeleteAll}
        >
          🗑️ Borrar todo
        </button>
      </div>
    );
  }

  if (mode === 'export') {
    return (
      <div className="storage-buttons-container">
        <button 
          type="button" 
          className="storage-button export"
          onClick={handleExport}
        >
          💾 Exportar backup
        </button>
      </div>
    );
  }

  return (
    <div className="storage-buttons-container">
      <button 
        type="button" 
        className="storage-button import"
        onClick={handleImportClick}
      >
        📤 Importar backup
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden-file-input"
        onChange={handleImportFileChange}
        accept=".json"
      />
    </div>
  );
}
