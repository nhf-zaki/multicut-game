import React from 'react';
import './main-menu.css';
import { Link } from 'react-router-dom';

function MainMenu() {
  return (
    <div>
      <div className="btn-grp">
        <Link to={`/new-game`} className="btn">
          New Game
        </Link>
        <Link to={`/tutorial`} className="btn">
          Tutorial
        </Link>
        <Link to={`/leaderboard`} className="btn">
          Leaderboard
        </Link>
      </div>
    </div>
  );
}

export default MainMenu;
