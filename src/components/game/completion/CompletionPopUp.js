import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import typeMapping from '../../../utils/typeMapping';

import './popup.css';

const CompletionPopup = ({ scores }) => {
  const [showPopup, setShowPopup] = useState(false);

  console.log(scores);
  console.log(typeof scores);

  useEffect(() => {
    setShowPopup(true); // Show the pop-up window when component mounts
  }, []);

  return (
    showPopup && (
      <div className="popup">
        <div className="popup-content">
          <h2>Excellent!</h2>
          <p>You have solved the graph!</p>
          <table className="scoreboard-results">
            <tbody>
              <tr>
                <td>
                  <i className="fa fa-th-large" aria-hidden="true"></i>
                </td>
                <td>Graph Type</td>
                <td>{typeMapping[scores.gameType]}</td>
              </tr>
              <tr>
                <td>
                  <i className="fa fa-star" aria-hidden="true"></i>
                </td>
                <td>Total Cost</td>
                <td>{scores.totalCost}</td>
              </tr>
              <tr>
                <td>
                  <i className="fa fa-clock" aria-hidden="true"></i>
                </td>
                <td>Completion Time</td>
                <td>{scores.completedTime}</td>
              </tr>
            </tbody>
          </table>
          <div className="comp-btns">
            <Link to={`/leaderboard`} className="btn-comp">
              Leaderboard
            </Link>
            <Link to={`/`} className="btn-comp">
              Back to Main Menu
            </Link>
          </div>
        </div>
      </div>
    )
  );
};

export default CompletionPopup;
