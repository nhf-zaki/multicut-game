import React from 'react';
import { useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { withResizeDetector } from 'react-resize-detector';

function GraphComponent(props) {
  const Graph = ({ width, height }) => {
    const forceRef = useRef(null);
    useEffect(() => {
      forceRef.current.d3Force('charge').strength(props.chargeStrength);
      forceRef.current.centerAt(10, 30);
    });

    return (
      <ForceGraph2D
        graphData={props.data}
        width={width}
        height={height}
        backgroundColor="aliceblue"
        nodeLabel="id"
        linkLabel={(link) => link.cost}
        nodeRelSize={6}
        ref={forceRef}
        onLinkClick={props.handleLinkClick}
        linkWidth={(link) =>
          link.cost < 0 ? -1 * (link.cost / 5) + 3 : link.cost / 5 + 3
        }
        linkColor={(link) => (link.cost < 0 ? '#DC143C' : 'green')}
        linkLineDash={(link) => link.dashed}
        // autoPauseRedraw={false}
        // enableNodeDrag={false}
        onNodeDrag={(node) => {
          node.fx = node.x;
          node.fy = node.y;
        }}
        onNodeDragEnd={(node) => {
          node.fx = node.x;
          node.fy = node.y;
        }}
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

export default GraphComponent;
