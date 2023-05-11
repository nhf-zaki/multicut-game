import React from 'react';
import './main-menu.css';
import { Link, useNavigate } from 'react-router-dom';

function NewGameMenu() {
  const navigate = useNavigate();
  return (
    <div>
      <button className="nav-btn" onClick={() => navigate(-1)}>
        <i className="fa fa-chevron-left" />
        &nbsp; back
      </button>
      <div className="title">New Game</div>
      <div className="btn-grp">
        <Link to={`/new-game/tree`} className="btn">
          Tree
        </Link>
        <Link to={`/new-game/complete-graph`} className="btn">
          Complete Graph
        </Link>
        <Link to={`/new-game/peterson-graph`} className="btn">
          Peterson Graph
        </Link>
        <Link to={`/new-game/grid-graph`} className="btn">
          Grid Graph
        </Link>
        <Link to={`/new-game/custom`} className="btn">
          Custom Graph
        </Link>
      </div>
    </div>
  );
}

export default NewGameMenu;
