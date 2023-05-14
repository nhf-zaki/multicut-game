import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './StopWatch.css';
import Timer from './Timer';
import useLocalStorage from '../hooks/useLocalStorage';
import { useEffect } from 'react';
import { useRef } from 'react';

// import ControlButtons from "../ControlButtons/ControlButtons";

function StopWatch() {
  //   console.log(useParams().gameType);
  const gameType = useParams().gameType;
  const [isActive, setIsActive] = useState(true);
  // const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const t = useRef(0);
  const [completedTime, setCompletedTime] = useLocalStorage(
    'leaderboard',
    '{}'
  );
  //   console.log('Time: ', time);

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
      //   setIsActive(!isActive);
      clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    return () => {
      console.log(typeof completedTime);
      if (
        Object.keys(completedTime).length &&
        typeof completedTime !== 'string'
      ) {
        console.log('In here');
        setCompletedTime([
          ...completedTime,
          { time: t.current, type: gameType },
        ]);
      } else {
        setCompletedTime([{ time: t.current, type: gameType }]);
      }
      //   console.log('Hook based on time', t.current);
      console.log(completedTime);
    };
  }, []);

  // const handleStart = () => {
  // 	setIsActive(true);
  // 	setIsPaused(false);
  // };

  // const handlePauseResume = () => {
  // 	setIsPaused(!isPaused);
  // };

  // const handleReset = () => {
  // 	setIsActive(false);
  // 	setTime(0);
  // };

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
