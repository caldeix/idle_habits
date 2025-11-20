import { useRef } from 'react';

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
      <button type="button" onClick={handleDeleteAll}>
        Borrar todo
      </button>
    );
  }

  if (mode === 'export') {
    return (
      <button type="button" onClick={handleExport}>
        Exportar backup JSON (settings, player, habits)
      </button>
    );
  }

  return (
    <>
      <button type="button" onClick={handleImportClick}>
        Importar backup JSON (settings, player, habits)
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={handleImportFileChange}
      />
    </>
  );
}
