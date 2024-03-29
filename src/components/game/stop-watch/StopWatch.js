import React, { forwardRef, useState, useEffect } from 'react';
import Timer from './Timer';
import './StopWatch.css';

const StopWatch = forwardRef(function Stopwatch(props, ref) {
  const [isActive] = useState(true);
  const [time, setTime] = useState(0);
  const countdown = props.countdown;

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
        ref.current = ref.current + 10;
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  if (countdown) {
    const countdownTime = props.timeoutVal - time;
    return (
      <div className="stop-watch">
        <Timer time={countdownTime} />
      </div>
    );
  } else {
    return (
      <div className="stop-watch">
        <Timer time={time} />
      </div>
    );
  }
});

export default StopWatch;
