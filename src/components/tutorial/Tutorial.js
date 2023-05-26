import React from 'react';
import { Link } from 'react-router-dom';

function Tutorial() {
  return (
    <div>
      <div>
        <Link to={`/`} className="btn-main">
          <i className="fa fa-home" />
          &nbsp; Back to Main Menu
        </Link>
      </div>
      <div className="title">Tutorial</div>
    </div>
  );
}

export default Tutorial;
