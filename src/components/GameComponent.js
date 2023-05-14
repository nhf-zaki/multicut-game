import React, { useState } from 'react';

import generateRandomTree from '../data/random-tree';
import generateCompleteGraph from '../data/complete-graph';
import petersonGraph from '../data/peterson.json';
import generateGridGraph from '../data/grid-graph';
import { useNavigate, useParams } from 'react-router-dom';
import GraphComponent from './GraphComponent';
import StopWatch from './StopWatch';

import './GameComponent.css';

const fetchData = (gameType) => {
  let dataByType;
  console.log('game type', gameType);
  switch (gameType) {
    case 'tree':
      dataByType = generateRandomTree(10, false);
      break;
    case 'complete-graph':
      dataByType = generateCompleteGraph(10);
      break;
    case 'peterson-graph':
      dataByType = petersonGraph;
      break;
    case 'grid-graph':
      dataByType = generateGridGraph(10);
      break;
    case 'custom':
      dataByType = generateRandomTree(15, false);
      break;
    default:
      break;
  }

  return dataByType;
};

function GameComponent() {
  const navigate = useNavigate();
  const dataByType = fetchData(useParams().gameType);

  const [data, setData] = useState(dataByType);
  const [totalCost, setTotalCost] = useState(0);

  console.log(data);

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
    link.cut
      ? setTotalCost(totalCost - link.cost)
      : setTotalCost(totalCost + link.cost);
  };

  return (
    <div>
      <div id="game-info" className="game-info">
        <button className="nav-btn" onClick={() => navigate(-1)}>
          <i className="fa fa-sign-out-alt fa-rotate-180" />
          &nbsp;Exit
        </button>
        <header>total cost: {totalCost}</header>
        <StopWatch />
      </div>
      <GraphComponent
        data={data}
        handleLinkClick={handleLinkClick}
        totalCost={totalCost}
      ></GraphComponent>
    </div>
  );
}

export default GameComponent;
