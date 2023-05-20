import React from 'react';
import { Link } from 'react-router-dom';

import './main-menu.css';

function MainMenu() {
  return (
    <div>
      <div className="menu-grp">
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
