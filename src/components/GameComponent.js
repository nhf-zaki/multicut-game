import React, { useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
// import "./styles.css";
import { withResizeDetector } from 'react-resize-detector';

// import treeNodeLinks from '../data/tree-node-links.json';
import generateRandomTree from '../data/random-tree';
// import testData from '../data/test-data.json';

// const data = treeNodeLinks;
const data = generateRandomTree(10, false);
// const data = testData;

data.nodes.forEach((node) => {
  node.val = (node.size * 100) | (node.degrees / 10);
  if (node.isClusterNode) {
    node.clusterId = null;
  } else {
    const link = data.links.find((link) => link.target === node.id);
    node.clusterId = link && link.source;
  }
});

const Graph = (props) => {
  console.log(data);
  const { width = 0, height = 610 } = props;
  const forceRef = useRef(null);
  useEffect(() => {
    forceRef.current.d3Force('charge').strength(-200);
  });
  console.log(width, height);

  return (
    <ForceGraph2D
      graphData={data}
      width={width}
      height={height}
      backgroundColor="aliceblue"
      nodeLabel="id"
      ref={forceRef}
    />
  );
};

const MyGraph = withResizeDetector(Graph);

function GameComponent() {
  return (
    <div
      style={{
        background: 'whitesmoke',
        width: 650,
        height: 610,
        color: '#1a73e8',
      }}
    >
      <MyGraph />
    </div>
  );
}

export default GameComponent;
