import './App.css';
// Importamos la página de pruebas de hábitos que hemos creado en src/pages
import { HabitsTestPage } from './pages/HabitsTestPage';
import { PlayerTestPanel } from './components/player/PlayerTestPanel';

function App() {
  // De momento la app principal solo muestra la página de test de hábitos
  // Más adelante podrás sustituir esto por tu layout definitivo con header, módulos, etc.
  return (
    <>
      <HabitsTestPage />
      <PlayerTestPanel />
    </>
  );
}

export default App;
