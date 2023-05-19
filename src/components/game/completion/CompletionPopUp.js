import React, { useState, useEffect } from 'react';
import './popup.css';
import { Link } from 'react-router-dom';

const CompletionPopup = ({ scores }) => {
  const [showPopup, setShowPopup] = useState(false);

  console.log(scores);
  console.log(typeof scores);

  useEffect(() => {
    setShowPopup(true); // Show the pop-up window when component mounts
  }, []);

  const handleClose = () => {
    setShowPopup(false); // Close the pop-up window
  };

  return (
    showPopup && (
      <div className="popup">
        <div className="popup-content">
          <h2>Congratulations!</h2>
          <p>You have completed the game!</p>
          <ul>
            {scores.map((score, index) => (
              <li key={index}>{score}</li>
            ))}
          </ul>
          <button onClick={handleClose}>Close</button>
          <Link to={`/`} className="btn">
            Home
          </Link>
        </div>
      </div>
    )
  );
};

export default CompletionPopup;
