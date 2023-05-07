import './App.css';
import GameComponent from './components/GameComponent';
import MainMenu from './components/menu/MainMenu';

function App() {
  return (
    <div className="App">
      <header className="App-header">MultiCut Game</header>
      <section className="Main">
        {/* <GameComponent /> */}
        <MainMenu />
      </section>
    </div>
  );
}

export default App;
