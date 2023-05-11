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
  const gameType = useParams().gameType;
  console.log("i'm into game component my boy!!!", gameType);

  const dataByType = fetchData(gameType);
  console.log('dataByType', dataByType);

  const [data, setData] = useState(dataByType);
  const [cost, setCost] = useState(null);

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
          ? l.color === 'red'
            ? { ...l, color: '' }
            : { ...l, color: 'red' }
          : l
      ),
    }));
    setCost((prevCost) => ({
      ...prevCost,
      links: data.links.map((l) =>
        l.source.id === link.source.id && l.target.id === link.target.id
          ? l.color === 'red'
            ? { ...l, color: '' }
            : { ...l, color: 'red' }
          : l
      ),
    }));
  };

  const Graph = (props) => {
    const { width, height } = props;
    console.log(props);
    const forceRef = useRef(null);
    useEffect(() => {
      forceRef.current.d3Force('charge').strength(-500);
    });
    console.log(width, height);

    return (
      <ForceGraph2D
        graphData={data}
        width={width}
        height={height}
        backgroundColor="aliceblue"
        nodeLabel="id"
        nodeRelSize={6}
        linkLabel="index"
        ref={forceRef}
        onLinkClick={handleLinkClick}
        linkColor={(link) => link.color}
        nodeCanvasObjectMode={() => 'after'}
        nodeCanvasObject={(node, ctx, globalScale) => {
          // console.log('node', node);
          const label = node.id;
          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          // const textWidth = ctx.measureText(label).width;
          // const bckgDimensions = [textWidth, fontSize].map(
          //   (n) => n + fontSize * 0.2
          // ); // some padding

          // ctx.fillStyle = 'rgba(45, 200, 135, 0.8)';
          // ctx.fillRect(
          //   node.x - bckgDimensions[0] / 2,
          //   node.y - bckgDimensions[1] / 2,
          //   ...bckgDimensions
          // );

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color ? node.color : 'white';
          ctx.fillText(label, node.x, node.y);
          // node.x = node.pos && node.pos.x ? node.pos.x : node.x;
          // node.y = node.pos && node.pos.y ? node.pos.y : node.y;

          // const pos = data.nodes.find((dn) => node.id === dn.id);
          // node.x = data.nodes.map((dn)=>{
          //   dn.pos_x;
          // });
        }}
        // nodeCanvasObject={(node, ctx, globalScale) => {
        //   const label = node.id;
        //   const fontSize = 12 / globalScale;
        //   ctx.font = `${fontSize}px Sans-Serif`;
        //   const textWidth = ctx.measureText(label).width;
        //   const bckgDimensions = [textWidth, fontSize].map(
        //     (n) => n + fontSize * 0.2
        //   ); // some padding

        //   ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        //   ctx.fillRect(
        //     node.x - bckgDimensions[0] / 2,
        //     node.y - bckgDimensions[1] / 2,
        //     ...bckgDimensions
        //   );

        //   ctx.textAlign = 'center';
        //   ctx.textBaseline = 'middle';
        //   ctx.fillStyle = node.color;
        //   ctx.fillText(label, node.x, node.y);

        //   node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        // }}
        // nodePointerAreaPaint={(node, color, ctx) => {
        //   console.log(node, color, ctx);
        //   ctx.fillStyle = color;
        //   const bckgDimensions = node.__bckgDimensions;
        //   bckgDimensions &&
        //     ctx.fillRect(
        //       node.x - bckgDimensions[0] / 2,
        //       node.y - bckgDimensions[1] / 2,
        //       ...bckgDimensions
        //     );
        // }}
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
