import React, { useEffect, useState, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import generateGridGraph from '../../data/grid-graph';
import generateCosts from '../../utils/generateCosts';

import CompletionPopup from './completion/CompletionPopUp';
import StopWatch from './stop-watch/StopWatch';
import GraphComponent from './GraphComponent';

import axios from 'axios';
import useLocalStorage from '../../hooks/useLocalStorage';

import './game.css';

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
  return nodesLength < 10
    ? -800
    : nodesLength < 13
    ? -700
    : nodesLength < 18
    ? -600
    : nodesLength > 40
    ? -30
    : -70;
};

function ChallengeComponent() {
  const navigate = useNavigate();
  const gameType = "challenge";
  const timeoutVal = 10 * 60 * 1000; // 10 minute timer

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

    fetchDataAndInitialize(); // Call the function to fetch initial data and get solver response
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCompleted(true);
    }, timeoutVal);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // determine the current graph is solved
  useEffect(() => {
    if (optimalCost !== 0 && totalCost === optimalCost) {
      setSolvedCount((prevCount) => prevCount + 1); // Increment solvedCount
    }
  }, [totalCost, optimalCost]);

  // update solved count, generate new graph, and update new optimal cost
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
    // save the solved count after completing the challenge
    if (timeRef.current > 0 && solvedCount > 0) {
      if (
        Object.keys(completedTime).length &&
        typeof completedTime !== 'string'
      ) {
        setCompletedTime([
          ...completedTime,
          { solvedCount: solvedCount, type: gameType },
        ]);
      } else {
        setCompletedTime([{ solvedCount: solvedCount, type: gameType }]);
      }
    }
  }, [isCompleted]);

  if (isCompleted) {
    const scores = {
      gameType: gameType,
      solvedCount: solvedCount,
    };
    return (
      <div>
        {solvedCount > 0 ? (
          <CompletionPopup scores={scores} />
        ) : (
          <CompletionPopup scores={scores} isFailed={true} />
        )}
      </div>
    );
  } else {
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
          <StopWatch ref={timeRef} countdown={true} timeoutVal={timeoutVal} />
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
