function generateCompleteGraph(n = 20) {
  const nodes = Array.from({ length: n }, (_, i) => ({ id: i }));
  const links = nodes.flatMap((node, i) =>
    nodes.slice(i + 1).map((target) => ({ source: node.id, target: target.id }))
  );

  return { nodes, links };
}

export default generateCompleteGraph;
