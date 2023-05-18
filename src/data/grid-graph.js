function generateGridGraph(n = 20) {
  const nodes = Array.from({ length: n * n }, (_, i) => ({
    id: i,
    x: i % n, // Calculate x position based on the column index
    y: Math.floor(i / n), // Calculate y position based on the row index
  }));

  const links = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Connect nodes horizontally
      if (j < n - 1) links.push({ source: i * n + j, target: i * n + j + 1 });
      // Connect nodes vertically
      if (i < n - 1) links.push({ source: i * n + j, target: (i + 1) * n + j });
    }
  }

  return { nodes, links };
}

export default generateGridGraph;
