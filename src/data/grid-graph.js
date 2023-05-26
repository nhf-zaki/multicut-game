function generateGridGraph(row = 3, col = 4) {
  const nodes = Array.from({ length: row * col }, (_, i) => ({
    id: i,
    x: i % col, // Calculate x position based on the column index
    y: Math.floor(i / col), // Calculate y position based on the row index
  }));

  const links = [];

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const currentNode = i * col + j;

      // Connect nodes horizontally
      if (j < col - 1)
        links.push({ source: currentNode, target: currentNode + 1 });

      // Connect nodes vertically
      if (i < row - 1)
        links.push({ source: currentNode, target: currentNode + col });
    }
  }

  return { nodes, links };
}

export default generateGridGraph;
