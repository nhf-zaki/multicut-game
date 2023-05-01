import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { withResizeDetector } from 'react-resize-detector';

import generateRandomTree from '../data/random-tree';

function GameComponent() {
  const [data, setData] = useState(generateRandomTree(10, false));

  console.log(data);

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
  };

  const Graph = (props) => {
    const { width = 0, height = 600 } = props;
    const forceRef = useRef(null);
    useEffect(() => {
      forceRef.current.d3Force('charge').strength(-200);
    });

    return (
      <ForceGraph2D
        graphData={data}
        width={width}
        height={height}
        backgroundColor="aliceblue"
        nodeLabel="id"
        linkLabel="index"
        ref={forceRef}
        onLinkClick={handleLinkClick}
        linkColor={(link) => link.color}
      />
    );
  };

  const MyGraph = withResizeDetector(Graph);

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
