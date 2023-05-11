import './App.css';
import GameComponent from './components/GameComponent';
import MainMenu from './components/menu/MainMenu';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NewGameMenu from './components/menu/NewGameMenu';

const router = createBrowserRouter([
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
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">MultiCut Game</header>
      <section className="Main">
        <RouterProvider router={router} />
        {/* <GameComponent /> */}
        {/* <MainMenu /> */}
      </section>
    </div>
  );
}

export default App;
