import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './main-menu.css';

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
        {/* <Link to={`/new-game/tree`} className="btn">
          Tree
        </Link> */}
        <Link to={`/new-game/complete-graph-small`} className="btn">
          Complete Graph (small)
        </Link>
        <Link to={`/new-game/peterson-graph`} className="btn">
          Peterson Graph
        </Link>
        <Link to={`/new-game/grid-graph-small`} className="btn">
          Grid Graph (small)
        </Link>
        <Link to={`/new-game/complete-graph-medium`} className="btn">
          Complete Graph (medium)
        </Link>
        <Link to={`/new-game/grid-graph-medium`} className="btn">
          Grid Graph (medium)
        </Link>
        <Link to={`/new-game/complete-graph-large`} className="btn">
          Complete Graph (large)
        </Link>
        <Link to={`/new-game/grid-graph-large`} className="btn">
          Grid Graph (large)
        </Link>
        <Link to={`/new-game/custom`} className="btn">
          Custom Graph
        </Link>
      </div>
    </div>
  );
}

export default NewGameMenu;
