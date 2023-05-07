import React from 'react';
import './main-menu.css';

function NewGameMenu() {
  return (
    <div>
      <div className="btn-grp">
        <button>Tree</button>
        <button>Complete Graph</button>
        <button>Peterson Graph</button>
        <button>Grid Graph</button>
        <button>Complete Graph</button>
        <button>Custom Graph</button>
      </div>
    </div>
  );
}

export default NewGameMenu;
