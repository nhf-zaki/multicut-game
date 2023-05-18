import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './StopWatch.css';
import Timer from './Timer';
import useLocalStorage from '../hooks/useLocalStorage';
import { useEffect } from 'react';
import { useRef } from 'react';

// import ControlButtons from "../ControlButtons/ControlButtons";

function StopWatch() {
  const gameType = useParams().gameType;
  const [isActive, setIsActive] = useState(true);
  const [time, setTime] = useState(0);
  const t = useRef(0);
  const [completedTime, setCompletedTime] = useLocalStorage(
    'leaderboard',
    '{}'
  );

  React.useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
        t.current = t.current + 10;
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (
        Object.keys(completedTime).length &&
        typeof completedTime !== 'string'
      ) {
        setCompletedTime([
          ...completedTime,
          { time: t.current, type: gameType },
        ]);
      } else {
        setCompletedTime([{ time: t.current, type: gameType }]);
      }
      //   console.log('Hook based on time', t.current);
      console.log('completedTime', completedTime);
    };
  }, []);

  return (
    <div className="stop-watch">
      <Timer time={time} />
      {/* <ControlButtons
		active={isActive}
		isPaused={isPaused}
		handleStart={handleStart}
		handlePauseResume={handlePauseResume}
		handleReset={handleReset}
	/> */}
    </div>
  );
}

export default StopWatch;
