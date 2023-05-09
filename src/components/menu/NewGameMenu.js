import React from 'react';
import './main-menu.css';
import { Link, useNavigate } from 'react-router-dom';

function NewGameMenu() {
  const navigate = useNavigate();
  return (
    <div>
      <button className="nav-btn" onClick={() => navigate(-1)}>
        <i class="fa fa-chevron-left" />
        &nbsp; back
      </button>
      <div className="title">New Game</div>
      <div className="btn-grp">
        <Link to={`/new-game`} className="btn">
          Tree
        </Link>
        <Link to={`/tutorial`} className="btn">
          Complete Graph
        </Link>
        <Link to={`/leaderboard`} className="btn">
          Peterson Graph
        </Link>
        <Link to={`/leaderboard`} className="btn">
          Grid Graph
        </Link>
        <Link to={`/leaderboard`} className="btn">
          Custom Graph
        </Link>
      </div>
    </div>
  );
}

export default NewGameMenu;
