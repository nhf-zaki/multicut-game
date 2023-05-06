function generateGridGraph(n = 20) {
  const nodes = Array.from({ length: n * n }, (_, i) => ({ id: i }));
  const links = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i > 0) links.push({ source: i * n + j, target: (i - 1) * n + j });
      if (j > 0) links.push({ source: i * n + j, target: i * n + j - 1 });
      if (i < n - 1) links.push({ source: i * n + j, target: (i + 1) * n + j });
      if (j < n - 1) links.push({ source: i * n + j, target: i * n + j + 1 });
    }
  }

  return { nodes, links };
}

export default generateGridGraph;
