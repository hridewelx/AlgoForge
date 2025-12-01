import React from 'react';
import { Graph, GraphEdge } from '../../types';
import { NodePosition } from '../utils/graphAlgorithms';

interface GraphSVGProps {
  isDark: boolean;
  graph: Graph;
  positions: NodePosition[];
  currentNode: string;
  visitedNodes: string[];
  algorithm: string;
}

const GraphSVG: React.FC<GraphSVGProps> = ({
  isDark,
  graph,
  positions,
  currentNode,
  visitedNodes,
  algorithm,
}) => {
  // Get node color
  const getNodeColor = (nodeId: string): string => {
    if (nodeId === currentNode) return 'fill-yellow-500';
    if (visitedNodes.includes(nodeId)) return 'fill-green-500';
    return 'fill-cyan-500';
  };

  // Get edge color
  const getEdgeColor = (edge: GraphEdge): string => {
    const sourceVisited = visitedNodes.includes(edge.source);
    const targetVisited = visitedNodes.includes(edge.target);
    if (sourceVisited && targetVisited) return 'stroke-green-500';
    return 'stroke-gray-500';
  };

  // Get position by node ID
  const getPosition = (nodeId: string): NodePosition => {
    return positions.find(p => p.id === nodeId) || { id: nodeId, x: 0, y: 0 };
  };

  return (
    <svg width="600" height="400" className={`rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-white shadow-inner border border-slate-200'}`}>
      {/* Edges */}
      {graph.edges.map(edge => {
        const sourcePos = getPosition(edge.source);
        const targetPos = getPosition(edge.target);
        const midX = (sourcePos.x + targetPos.x) / 2;
        const midY = (sourcePos.y + targetPos.y) / 2;

        return (
          <g key={edge.id}>
            <line
              x1={sourcePos.x}
              y1={sourcePos.y}
              x2={targetPos.x}
              y2={targetPos.y}
              className={`${getEdgeColor(edge)} stroke-2 transition-all duration-300`}
            />
            {edge.weight !== undefined && (
              <g>
                <circle cx={midX} cy={midY} r="12" className={isDark ? 'fill-gray-800' : 'fill-white stroke-slate-300 stroke-1'} />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  className={`text-xs font-medium ${isDark ? 'fill-gray-300' : 'fill-slate-600'}`}
                >
                  {edge.weight}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {graph.nodes.map(node => {
        const pos = getPosition(node.id);
        const nodeData = graph.nodes.find(n => n.id === node.id);
        const distance = nodeData?.distance;

        return (
          <g key={node.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="30"
              className={`${getNodeColor(node.id)} stroke-2 ${isDark ? 'stroke-gray-600' : 'stroke-slate-400'} transition-all duration-300`}
            />
            <text
              x={pos.x}
              y={pos.y + 5}
              textAnchor="middle"
              className="fill-white text-lg font-bold"
            >
              {node.label}
            </text>
            {algorithm === 'dijkstra' && distance !== undefined && distance !== Infinity && (
              <text
                x={pos.x}
                y={pos.y - 40}
                textAnchor="middle"
                className="fill-cyan-500 text-sm font-medium"
              >
                d={distance}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default GraphSVG;
