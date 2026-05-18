import './styles/retro-theme.css';
import './App.scss';
import { MainPage } from './pages/MainPage';
import { PlayerSettingsPanel } from './components/player/PlayerSettingsPanel';
import { PlayerProvider } from './features/player/context/PlayerContext';
import { StoreProvider, StoreModal } from './features/store';

function App() {
  return (
    <PlayerProvider>
      <StoreProvider>
        <div className="retro-app-container">
          <div className="player-panel">
            <PlayerSettingsPanel />
          </div>
          <MainPage />
        </div>
        <StoreModal />
      </StoreProvider>
    </PlayerProvider>
  );
}

export default App;
