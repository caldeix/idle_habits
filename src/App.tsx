import { useEffect } from 'react';
import './styles/retro-theme.css';
import { HabitsMainPage } from './pages/HabitsMainPage';
import { PlayerSettingsPanel } from './components/player/PlayerSettingsPanel';
import { PlayerProvider } from './features/player/context/PlayerContext';
import './App.css';
// Load the retro font
const loadRetroFont = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  // Add pixelated rendering for better retro look
  const style = document.createElement('style');
  style.textContent = `
    * {
      image-rendering: -moz-crisp-edges;
      image-rendering: pixelated;
    }
  `;
  document.head.appendChild(style);
};

function App() {
  useEffect(() => {
    loadRetroFont();
    // Add class to body for global styles
    document.body.classList.add('retro-app');

    return () => {
      document.body.classList.remove('retro-app');
    };
  }, []);

  return (
    <PlayerProvider>
      <div className="retro-app-container">
        <div className='player-panel'>
          <PlayerSettingsPanel />
        </div>
        <HabitsMainPage />
      </div>
    </PlayerProvider>
  );
}

export default App;
