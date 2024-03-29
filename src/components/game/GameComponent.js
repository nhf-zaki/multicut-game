import React, { useEffect, useState, useRef } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import generateRandomTree from '../../data/random-tree';
import generateCompleteGraph from '../../data/complete-graph';
import petersonGraph from '../../data/peterson.json';
import generateGridGraph from '../../data/grid-graph';
import generateCosts from '../../utils/generateCosts';
import gridTest from '../../data/grid-test.json';

import CompletionPopup from './completion/CompletionPopUp';
import StopWatch from './stop-watch/StopWatch';
import GraphComponent from './GraphComponent';

import axios from 'axios';
import useLocalStorage from '../../hooks/useLocalStorage';

import './game.css';
import getTimeObj from '../../utils/timeObject';

const fetchData = (gameType) => {
  let dataByType;
  switch (gameType) {
    case 'tree':
      dataByType = generateRandomTree(10, false);
      break;
    case 'complete-graph-small':
      dataByType = generateCompleteGraph(4);
      break;
    case 'peterson-graph':
      dataByType = petersonGraph;
      break;
    case 'grid-graph-small':
      dataByType = generateGridGraph(3, 4);
      break;
    case 'complete-graph-medium':
      dataByType = generateCompleteGraph(6);
      break;
    case 'grid-graph-medium':
      dataByType = generateGridGraph(5, 6);
      break;
    case 'complete-graph-large':
      dataByType = generateCompleteGraph(8);
      break;
    case 'grid-graph-large':
      dataByType = generateGridGraph(7, 8);
      break;
    case 'custom':
      dataByType = gridTest;
      break;
    default:
      break;
  }

  if (gameType !== 'custom') {
    dataByType = generateCosts(dataByType);
  }

  return dataByType;
};

const chargeStrength = (gameType) => {
  let strength;

  switch (gameType) {
    case 'tree':
      strength = -50;
      break;
    case 'complete-graph-small':
    case 'complete-graph-medium':
    case 'complete-graph-large':
      strength = -800;
      break;
    case 'peterson-graph':
      strength = -500;
      break;
    case 'grid-graph-small':
      strength = -500;
      break;
    case 'grid-graph-medium':
      strength = -70;
      break;
    case 'grid-graph-large':
      strength = -30;
      break;
    default:
      strength = -500;
      break;
  }

  return strength;
};

function GameComponent() {
  const navigate = useNavigate();
  const gameType = useParams().gameType;
  const dataByType = fetchData(gameType);

  const [data, setData] = useState(dataByType);
  const [totalCost, setTotalCost] = useState(0);
  const [optimalCost, setOptimalCost] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [completedTime, setCompletedTime] = useLocalStorage(
    'leaderboard',
    '{}'
  );

  const timeRef = useRef(0);

  const requestBody = {
    graph: dataByType,
  };

  useEffect(() => {
    const solverResp = async () => {
      await axios
        .post('http://localhost:5000/multicut-solver', requestBody)
        .then((response) => {
          console.log('response', response.data);
          setOptimalCost(response.data.optimal_value);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    solverResp();
  }, []);

  // this part is useless until now
  data.nodes.forEach((node) => {
    node.val = (node.size * 100) | (node.degrees / 10);
    if (node.isClusterNode) {
      node.clusterId = null;
    } else {
      const link = data.links.find((link) => link.target === node.id);
      node.clusterId = link && link.source;
    }
  });

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
    if (optimalCost !== 0 && totalCost === optimalCost) {
      setIsCompleted(true);
    }
  }, [totalCost, optimalCost]);

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
          <p>Total Cost: {totalCost}</p>
          {gameType !== 'tree' && (
            <p>Optimal Cost: {optimalCost === 0 ? '...' : optimalCost}</p>
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

export default GameComponent;
