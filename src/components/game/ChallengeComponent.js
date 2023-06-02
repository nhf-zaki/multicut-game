import React, { useEffect, useState, useRef } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import generateGridGraph from '../../data/grid-graph';
import generateCosts from '../../utils/generateCosts';

import CompletionPopup from './completion/CompletionPopUp';
import StopWatch from './stop-watch/StopWatch';
import GraphComponent from './GraphComponent';

import axios from 'axios';
import useLocalStorage from '../../hooks/useLocalStorage';

import './game.css';
import getTimeObj from '../../utils/timeObject';

const fetchData = () => {
  const randInts = [];

  for (let i = 0; i < 2; i++) {
    const ri = Math.floor(Math.random() * 4) + 3;
    randInts.push(ri);
  }
  randInts.sort();

  return generateCosts(generateGridGraph(randInts[0], randInts[1]));
};

const chargeStrength = (nodesLength = 20) => {
  // TODO: need to add more suitable condition
  return nodesLength < 15 ? -500 : nodesLength > 40 ? -30 : -70;
};

function ChallengeComponent() {
  const navigate = useNavigate();
  const gameType = useParams().gameType;
  // const dataByType = fetchData(gameType);

  // const [data, setData] = useState(dataByType);
  const [data, setData] = useState(fetchData());
  const [totalCost, setTotalCost] = useState(0);
  const [optimalCost, setOptimalCost] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  const [completedTime, setCompletedTime] = useLocalStorage(
    'leaderboard',
    '{}'
  );

  const timeRef = useRef(0);

  const handleLinkClick = (link) => {
    setData((prevData) => ({
      ...prevData,
      links: prevData.links.map((l) =>
        l.source.id === link.source.id && l.target.id === link.target.id
          ? l.cut
            ? { ...l, cut: false, dashed: [] }
            : { ...l, cut: true, dashed: [1, 2] }
          : l
      ),
    }));
    // cut is not updated here, so reverse calculation is doing the correct calculation
    link.cut
      ? setTotalCost(totalCost - link.cost)
      : setTotalCost(totalCost + link.cost);
  };

  useEffect(() => {
    const fetchDataAndInitialize = async () => {
      console.log('getting initial data and solver call', data);
      try {
        const response = await axios.post(
          'http://localhost:5000/multicut-solver',
          {
            graph: data,
          }
        );
        console.log('init response', response.data);
        setOptimalCost(response.data.optimal_value);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataAndInitialize(); // Call the function to fetch initial data and initialize solver
  }, []);

  useEffect(() => {
    if (optimalCost !== 0 && totalCost === optimalCost) {
      setSolvedCount((prevCount) => prevCount + 1); // Increment solvedCount
    }
  }, [totalCost, optimalCost]);

  useEffect(() => {
    const generateNewDataAndCallSolver = async () => {
      const newData = fetchData(); // Generate new data
      setData(newData);
      setTotalCost(0);
      console.log(
        'setting new data, resetting totalCost and solver call',
        newData
      );

      try {
        const response = await axios.post(
          'http://localhost:5000/multicut-solver',
          {
            graph: newData,
          }
        );
        console.log('later responses', response.data);
        setOptimalCost(response.data.optimal_value);
      } catch (error) {
        console.log(error);
      }
    };

    if (solvedCount > 0) {
      generateNewDataAndCallSolver(); // Generate new data and call solver after the solution
    }
  }, [solvedCount]);

  useEffect(() => {
    if (timeRef.current > 0) {
      if (
        Object.keys(completedTime).length &&
        typeof completedTime !== 'string'
      ) {
        setCompletedTime([
          ...completedTime,
          { time: timeRef.current, type: gameType },
        ]);
      } else {
        setCompletedTime([{ time: timeRef.current, type: gameType }]);
      }
    }
  }, [isCompleted]);

  if (isCompleted) {
    const timeObj = getTimeObj(timeRef.current);
    const scores = {
      gameType: gameType,
      totalCost: totalCost,
      completedTime: `${timeObj.minutes}:${timeObj.seconds}.${timeObj.millis}0`,
    };
    return (
      <div>
        <CompletionPopup scores={scores} />
      </div>
    );
  } else {
    console.log('before rendering, data:', data);
    return (
      <div>
        <div id="game-info" className="game-info">
          <button className="exit-btn" onClick={() => navigate(-1)}>
            <i className="fa fa-sign-out-alt fa-rotate-180" />
            &nbsp;Exit
          </button>
          <p>Solved: {solvedCount}</p>
          <p>Cost: {totalCost}</p>
          {gameType !== 'tree' && (
            <p>Optimal: {optimalCost === 0 ? '...' : optimalCost}</p>
          )}
          <StopWatch ref={timeRef} />
        </div>
        <GraphComponent
          data={data}
          handleLinkClick={handleLinkClick}
          chargeStrength={chargeStrength(gameType)}
        ></GraphComponent>
      </div>
    );
  }
}

export default ChallengeComponent;
