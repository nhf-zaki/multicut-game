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
  console.log('data fetch call');
  const randInts = [];

  for (let i = 0; i < 2; i++) {
    const ri = Math.floor(Math.random() * 4) + 3;
    randInts.push(ri);
  }
  console.log(randInts);

  const graph = generateGridGraph(randInts[0], randInts[1]);
  console.log('graph', graph);

  return generateCosts(
    generateGridGraph(Math.min(randInts), Math.max(randInts))
  );
};

const chargeStrength = (nodesLength = 20) => {
  return nodesLength < 30 ? -500 : nodesLength > 40 ? -30 : -70;
};

function ChallengeComponent() {
  const navigate = useNavigate();
  const gameType = useParams().gameType;

  const [data, setData] = useState();
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

  const requestBody = {
    graph: data,
  };

  const solverResp = async () => {
    await axios
      .post('http://localhost:5000/multicut-solver', requestBody)
      .then((response) => {
        console.log('response', response.data);
        setOptimalCost(response.data.optimal_value);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // initial call to solver
  useEffect(() => {
    setData(fetchData());
    solverResp();
  }, []);

  useEffect(() => {
    if (optimalCost !== 0 && totalCost === optimalCost) {
      // setIsCompleted(true);
      setSolvedCount((prevCount) => prevCount + 1);
    }
  }, [totalCost, optimalCost]);

  useEffect(() => {
    const newData = fetchData();
    setData(newData);
    console.log('newData', newData, 'cost:', totalCost);
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
