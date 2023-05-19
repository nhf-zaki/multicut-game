import React, { useEffect, useState } from 'react';

import generateRandomTree from '../data/random-tree';
import generateCompleteGraph from '../data/complete-graph';
import petersonGraph from '../data/peterson.json';
import generateGridGraph from '../data/grid-graph';
import { useNavigate, useParams } from 'react-router-dom';
import GraphComponent from './GraphComponent';
import StopWatch from './StopWatch';

import './GameComponent.css';
import axios from 'axios';
import generateCosts from '../utils/generateCosts';
import CompletionPopup from './game/completion/CompletionPopUp';

const fetchData = (gameType) => {
  let dataByType;
  console.log('game type', gameType);
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
      dataByType = generateGridGraph(3);
      break;
    case 'complete-graph-medium':
      dataByType = generateCompleteGraph(6);
      break;
    case 'grid-graph-medium':
      dataByType = generateGridGraph(5);
      break;
    case 'complete-graph-large':
      dataByType = generateCompleteGraph(8);
      break;
    case 'grid-graph-large':
      dataByType = generateGridGraph(7);
      break;
    case 'custom':
      dataByType = generateRandomTree(15, false);
      break;
    default:
      break;
  }

  dataByType = generateCosts(dataByType);

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

  console.log(data);

  // const costs = prepareCostDict(data);

  const requestBody = {
    graph: dataByType,
  };

  useEffect(() => {
    const solverResp = async () => {
      await axios
        .post('http://localhost:5000/multicut-solver', requestBody)
        .then((response) => {
          console.log('response', response.data);
          console.log('opt val', response.data.optimal_value);
          setOptimalCost(response.data.optimal_value);
        })
        .catch((error) => {
          console.log(error);
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
          ? l.cut === 'true'
            ? { ...l, cut: 'false', dashed: [] }
            : { ...l, cut: 'true', dashed: [2, 1] }
          : l
      ),
    }));
    // cut is not updated here, so reverse calculation is doing the correct calculation
    // TODO: there is a bug. when node is dragged, the data is updated
    // and the complete calculation goes in wrong direction
    link.cut
      ? setTotalCost(totalCost - link.cost)
      : setTotalCost(totalCost + link.cost);
  };

  // useEffect(
  //   (paramLink) => {
  //     console.log('data change hook', paramLink);
  //     data.links.forEach((link) => {
  //       if (link.cut) {
  //         setTotalCost((prevCost) => prevCost + link.cost);
  //       }
  //     });
  //   },
  //   [data]
  // );

  useEffect(() => {
    if (optimalCost < 0 && totalCost === optimalCost) {
      setIsCompleted(true);
    }
  }, [totalCost, optimalCost]);

  if (isCompleted) {
    const scores = [gameType, totalCost];
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
          {gameType !== 'tree' && <p>Optimal Cost: {optimalCost}</p>}
          <StopWatch />
        </div>
        <GraphComponent
          data={data}
          handleLinkClick={handleLinkClick}
          totalCost={totalCost}
          chargeStrength={chargeStrength(gameType)}
        ></GraphComponent>
      </div>
    );
  }
}

export default GameComponent;
