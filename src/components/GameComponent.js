import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useResizeDetector, withResizeDetector } from 'react-resize-detector';

import generateRandomTree from '../data/random-tree';
import generateCompleteGraph from '../data/complete-graph';
import petersonGraph from '../data/peterson.json';
import generateGridGraph from '../data/grid-graph';
import { useParams } from 'react-router-dom';

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

  const Graph = (props) => {
    const { width, height } = props;
    const forceRef = useRef(null);
    useEffect(() => {
      forceRef.current.d3Force('charge').strength(-500);
    });

    console.log('totalCost', totalCost);

    return (
      <ForceGraph2D
        graphData={data}
        width={width}
        height={height}
        backgroundColor="aliceblue"
        nodeLabel="id"
        linkLabel={(link) => link.cost}
        nodeRelSize={6}
        ref={forceRef}
        onLinkClick={handleLinkClick}
        linkWidth={(link) =>
          link.cost < 0 ? -1 * (link.cost / 5) + 3 : link.cost / 5 + 3
        }
        linkColor={(link) => (link.cost < 0 ? '#DC143C' : 'green')}
        linkLineDash={(link) => link.dashed}
        autoPauseRedraw="false"
        enableNodeDrag="false"
        nodeCanvasObjectMode={() => 'after'}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color ? node.color : 'white';
          ctx.fillText(label, node.x, node.y);
        }}
      />
    );
  };

  const MyGraph = withResizeDetector(Graph);

  return (
    <div
      style={{
        background: 'whitesmoke',
        width: '100%',
        height: '400px',
      }}
    >
      <MyGraph />
    </div>
  );
}

export default GameComponent;
