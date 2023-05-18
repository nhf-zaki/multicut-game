function generateCompleteGraph(n = 20) {
  const radius = 100; // Radius of the circular layout
  const centerX = 0; // X-coordinate of the center of the circle
  const centerY = 0; // Y-coordinate of the center of the circle

  const angleStep = (2 * Math.PI) / n; // Angle between each node in radians

  const nodes = Array.from({ length: n }, (_, i) => ({
    id: i,
    x: centerX + radius * Math.cos(i * angleStep), // Calculate x position based on angle
    y: centerY + radius * Math.sin(i * angleStep), // Calculate y position based on angle
  }));

  const links = nodes.flatMap((node, i) =>
    nodes.slice(i + 1).map((target) => ({ source: node.id, target: target.id }))
  );

  return { nodes, links };
}

export default generateCompleteGraph;
