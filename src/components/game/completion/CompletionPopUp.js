import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import typeMapping from '../../../utils/typeMapping';

import './popup.css';

const CompletionPopup = ({ scores, isFailed }) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setShowPopup(true); // Show the pop-up window when component mounts
  }, []);

  return (
    showPopup && (
      <div className="popup">
        <div className="popup-content">
          {isFailed ? (
            <div className="failed">
              <h2>Sorry!</h2>
              <p>You could not solve any graph</p>
            </div>
          ) : (
            <div className="success">
              <h2>Excellent!</h2>
              {scores.gameType === 'challenge' ? (
                ''
              ) : (
                <p>You have solved the graph!</p>
              )}
              <table className="scoreboard-results">
                <tbody>
                  <tr>
                    <td>
                      <i className="fa fa-th-large" aria-hidden="true"></i>
                    </td>
                    <td>Game Mode</td>
                    <td>{typeMapping[scores.gameType]}</td>
                  </tr>
                  {scores.totalCost ? (
                    <tr>
                      <td>
                        <i className="fa fa-star" aria-hidden="true"></i>
                      </td>
                      <td>Total Cost</td>
                      <td>{scores.totalCost}</td>
                    </tr>
                  ) : null}
                  {scores.completedTime ? (
                    <tr>
                      <td>
                        <i className="fa fa-clock" aria-hidden="true"></i>
                      </td>
                      <td>Completion Time</td>
                      <td>{scores.completedTime}</td>
                    </tr>
                  ) : null}
                  {scores.solvedCount ? (
                    <tr>
                      <td>
                        <i className="fa fa-star" aria-hidden="true"></i>
                      </td>
                      <td>Solved</td>
                      <td>{scores.solvedCount}</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
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
