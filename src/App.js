import { createHashRouter, RouterProvider } from 'react-router-dom';

import MainMenu from './components/menu/MainMenu';
import NewGameMenu from './components/menu/NewGameMenu';
import GameComponent from './components/game/GameComponent';
import ChallengeComponent from './components/game/ChallengeComponent';
import Tutorial from './components/tutorial/Tutorial';
import Leaderboard from './components/leaderboard/Leaderboard';

import './App.css';

const router = createHashRouter([
  {
    path: '/',
    element: <MainMenu />,
  },
  {
    path: '/new-game',
    element: <NewGameMenu />,
  },
  {
    path: '/new-game/:gameType',
    element: <GameComponent />,
  },
  {
    path: '/challenge',
    element: <ChallengeComponent />,
  },
  {
    path: '/tutorial',
    element: <Tutorial />,
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />,
  },
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">MultiCut Game</header>
      <section className="Main">
        <RouterProvider router={router} />
      </section>
    </div>
  );
}

export default App;
