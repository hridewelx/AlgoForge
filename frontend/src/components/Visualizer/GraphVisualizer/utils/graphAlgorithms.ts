import { Graph, GraphNode, GraphEdge } from '../../types';

export interface StepResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  current: string;
  visited: string[];
  description: string;
}

export interface NodePosition {
  id: string;
  x: number;
  y: number;
}

// Default graph
export const createDefaultGraph = (): Graph => {
  const nodes: GraphNode[] = [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
    { id: 'E', label: 'E' },
    { id: 'F', label: 'F' },
  ];

  const edges: GraphEdge[] = [
    { id: '1', source: 'A', target: 'B', weight: 4 },
    { id: '2', source: 'A', target: 'C', weight: 2 },
    { id: '3', source: 'B', target: 'C', weight: 1 },
    { id: '4', source: 'B', target: 'D', weight: 5 },
    { id: '5', source: 'C', target: 'D', weight: 8 },
    { id: '6', source: 'C', target: 'E', weight: 10 },
    { id: '7', source: 'D', target: 'E', weight: 2 },
    { id: '8', source: 'D', target: 'F', weight: 6 },
    { id: '9', source: 'E', target: 'F', weight: 3 },
  ];

  return { nodes, edges, directed: false, weighted: true };
};

// Node positions in a circle layout
export const calculateNodePositions = (nodes: GraphNode[], width: number, height: number): NodePosition[] => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;

  return nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / nodes.length - Math.PI / 2;
    return {
      id: node.id,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
};

// BFS Generator
export function* bfsGenerator(graph: Graph, startId: string): Generator<StepResult> {
  const nodes = graph.nodes.map(n => ({ ...n, visited: false, distance: Infinity }));
  const edges = graph.edges.map(e => ({ ...e }));
  const visited: string[] = [];
  const queue: string[] = [startId];

  const startNode = nodes.find(n => n.id === startId);
  if (startNode) {
    startNode.distance = 0;
  }

  yield {
    nodes: [...nodes],
    edges: [...edges],
    current: startId,
    visited: [],
    description: `Starting BFS from node ${startId}`,
  };

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.includes(current)) continue;

    visited.push(current);
    const currentNode = nodes.find(n => n.id === current);
    if (currentNode) {
      currentNode.visited = true;
    }

    yield {
      nodes: [...nodes],
      edges: [...edges],
      current,
      visited: [...visited],
      description: `Visiting node ${current}`,
    };

    // Get neighbors
    const neighbors: string[] = [];
    for (const edge of edges) {
      if (edge.source === current && !visited.includes(edge.target)) {
        neighbors.push(edge.target);
      } else if (!graph.directed && edge.target === current && !visited.includes(edge.source)) {
        neighbors.push(edge.source);
      }
    }

    for (const neighbor of neighbors) {
      if (!queue.includes(neighbor) && !visited.includes(neighbor)) {
        queue.push(neighbor);
        const neighborNode = nodes.find(n => n.id === neighbor);
        const currentNodeDist = nodes.find(n => n.id === current)?.distance || 0;
        if (neighborNode && (neighborNode.distance === undefined || neighborNode.distance > currentNodeDist + 1)) {
          neighborNode.distance = currentNodeDist + 1;
        }

        yield {
          nodes: [...nodes],
          edges: [...edges],
          current,
          visited: [...visited],
          description: `Adding ${neighbor} to queue`,
        };
      }
    }
  }

  yield {
    nodes: [...nodes],
    edges: [...edges],
    current: '',
    visited: [...visited],
    description: 'BFS complete!',
  };
}

// DFS Generator
export function* dfsGenerator(graph: Graph, startId: string): Generator<StepResult> {
  const nodes = graph.nodes.map(n => ({ ...n, visited: false, distance: Infinity }));
  const edges = graph.edges.map(e => ({ ...e }));
  const visited: string[] = [];
  const stack: string[] = [startId];

  const startNode = nodes.find(n => n.id === startId);
  if (startNode) {
    startNode.distance = 0;
  }

  yield {
    nodes: [...nodes],
    edges: [...edges],
    current: startId,
    visited: [],
    description: `Starting DFS from node ${startId}`,
  };

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.includes(current)) continue;

    visited.push(current);
    const currentNode = nodes.find(n => n.id === current);
    if (currentNode) {
      currentNode.visited = true;
    }

    yield {
      nodes: [...nodes],
      edges: [...edges],
      current,
      visited: [...visited],
      description: `Visiting node ${current}`,
    };

    // Get neighbors (in reverse order for correct DFS order)
    const neighbors: string[] = [];
    for (const edge of edges) {
      if (edge.source === current && !visited.includes(edge.target)) {
        neighbors.push(edge.target);
      } else if (!graph.directed && edge.target === current && !visited.includes(edge.source)) {
        neighbors.push(edge.source);
      }
    }

    for (const neighbor of neighbors.reverse()) {
      if (!stack.includes(neighbor) && !visited.includes(neighbor)) {
        stack.push(neighbor);

        yield {
          nodes: [...nodes],
          edges: [...edges],
          current,
          visited: [...visited],
          description: `Adding ${neighbor} to stack`,
        };
      }
    }
  }

  yield {
    nodes: [...nodes],
    edges: [...edges],
    current: '',
    visited: [...visited],
    description: 'DFS complete!',
  };
}

// Dijkstra Generator
export function* dijkstraGenerator(graph: Graph, startId: string): Generator<StepResult> {
  const nodes = graph.nodes.map(n => ({ ...n, visited: false, distance: Infinity }));
  const edges = graph.edges.map(e => ({ ...e }));
  const visited: string[] = [];
  const unvisited = new Set(nodes.map(n => n.id));

  const startNode = nodes.find(n => n.id === startId);
  if (startNode) {
    startNode.distance = 0;
  }

  yield {
    nodes: [...nodes],
    edges: [...edges],
    current: startId,
    visited: [],
    description: `Starting Dijkstra from node ${startId}`,
  };

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let minDist = Infinity;
    let current = '';
    for (const id of unvisited) {
      const node = nodes.find(n => n.id === id);
      if (node && node.distance !== undefined && node.distance < minDist) {
        minDist = node.distance;
        current = id;
      }
    }

    if (current === '' || minDist === Infinity) break;

    unvisited.delete(current);
    visited.push(current);
    const currentNode = nodes.find(n => n.id === current);
    if (currentNode) {
      currentNode.visited = true;
    }

    yield {
      nodes: [...nodes],
      edges: [...edges],
      current,
      visited: [...visited],
      description: `Visiting node ${current} (distance: ${minDist})`,
    };

    // Update neighbors
    for (const edge of edges) {
      let neighbor: string | null = null;
      const weight = edge.weight || 1;

      if (edge.source === current && unvisited.has(edge.target)) {
        neighbor = edge.target;
      } else if (!graph.directed && edge.target === current && unvisited.has(edge.source)) {
        neighbor = edge.source;
      }

      if (neighbor) {
        const neighborNode = nodes.find(n => n.id === neighbor);
        const newDist = minDist + weight;
        if (neighborNode && (neighborNode.distance === undefined || newDist < neighborNode.distance)) {
          neighborNode.distance = newDist;

          yield {
            nodes: [...nodes],
            edges: [...edges],
            current,
            visited: [...visited],
            description: `Updated distance to ${neighbor}: ${newDist}`,
          };
        }
      }
    }
  }

  yield {
    nodes: [...nodes],
    edges: [...edges],
    current: '',
    visited: [...visited],
    description: 'Dijkstra complete! Shortest paths found.',
  };
}
