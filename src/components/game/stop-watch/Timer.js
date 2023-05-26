import React from 'react';
import './Timer.css';
import getTimeObj from '../../../utils/timeObject';

export default function Timer(props) {
  const timeObj = getTimeObj(props.time);
  return (
    <div className="timer">
      <span className="digits">{timeObj.minutes}:</span>
      <span className="digits">{timeObj.seconds}.</span>
      <span className="digits mili-sec">{timeObj.millis}0</span>
    </div>
  );
}
