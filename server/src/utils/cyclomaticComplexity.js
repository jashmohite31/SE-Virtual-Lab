/**
 * Calculates Cyclomatic Complexity of a graph.
 * Formula: V(G) = E - N + 2P
 * N = number of nodes, E = number of edges, P = number of entry/exit points (usually 1)
 */
export const calculateCyclomaticComplexity = (nodeCount, edgeCount, connectedComponents = 1) => {
  if (nodeCount === 0) return 0;
  return edgeCount - nodeCount + 2 * connectedComponents;
};

/**
 * Checks which edges and nodes are covered by a list of test execution paths.
 * Paths are arrays of node IDs (e.g. ['n1', 'n2', 'n4']).
 */
export const evaluatePathCoverage = (nodes = [], edges = [], paths = []) => {
  const coveredNodes = new Set();
  const coveredEdges = new Set();

  paths.forEach((path) => {
    // Mark nodes
    path.forEach((nodeId) => {
      coveredNodes.add(nodeId);
    });

    // Mark edges (consecutive node pairs in path)
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      const edge = edges.find((e) => e.source === from && e.target === to);
      if (edge) {
        coveredEdges.add(edge.id || `${from}->${to}`);
      }
    }
  });

  const nodeCoveragePercentage = nodes.length > 0 ? Math.round((coveredNodes.size / nodes.length) * 100) : 0;
  const edgeCoveragePercentage = edges.length > 0 ? Math.round((coveredEdges.size / edges.length) * 100) : 0;

  return {
    nodeCoveragePercentage,
    edgeCoveragePercentage,
    coveredNodeIds: Array.from(coveredNodes),
    coveredEdgeIds: Array.from(coveredEdges),
    allNodesCovered: coveredNodes.size === nodes.length,
    allEdgesCovered: coveredEdges.size === edges.length
  };
};
