import React from 'react';
import { TreeNode as TreeNodeType } from '../../types';

interface TreeNodeProps {
  node: TreeNodeType;
  x: number;
  y: number;
  level: number;
  maxLevel: number;
  spacing: number;
  highlighted: boolean;
  visited: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  x,
  y,
  level,
  maxLevel,
  spacing,
  highlighted,
  visited,
}) => {
  const leftChildX = x - spacing / Math.pow(2, level);
  const rightChildX = x + spacing / Math.pow(2, level);
  const childY = y + 80;

  const nodeColor = highlighted
    ? 'fill-yellow-500'
    : visited
    ? 'fill-green-500'
    : 'fill-cyan-500';

  const strokeColor = highlighted
    ? 'stroke-yellow-500'
    : visited
    ? 'stroke-green-500'
    : 'stroke-cyan-500';

  return (
    <g>
      {/* Lines to children */}
      {node.left && (
        <line
          x1={x}
          y1={y + 20}
          x2={leftChildX}
          y2={childY - 20}
          className={`${strokeColor} stroke-2 transition-all duration-300`}
        />
      )}
      {node.right && (
        <line
          x1={x}
          y1={y + 20}
          x2={rightChildX}
          y2={childY - 20}
          className={`${strokeColor} stroke-2 transition-all duration-300`}
        />
      )}

      {/* Node circle */}
      <circle
        cx={x}
        cy={y}
        r="25"
        className={`${nodeColor} stroke-2 stroke-gray-600 transition-all duration-300`}
      />

      {/* Node value */}
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        className="fill-white text-sm font-bold"
      >
        {node.value}
      </text>

      {/* Render children */}
      {node.left && level < maxLevel && (
        <TreeNode
          node={node.left}
          x={leftChildX}
          y={childY}
          level={level + 1}
          maxLevel={maxLevel}
          spacing={spacing}
          highlighted={node.left.highlighted || false}
          visited={node.left.visited || false}
        />
      )}
      {node.right && level < maxLevel && (
        <TreeNode
          node={node.right}
          x={rightChildX}
          y={childY}
          level={level + 1}
          maxLevel={maxLevel}
          spacing={spacing}
          highlighted={node.right.highlighted || false}
          visited={node.right.visited || false}
        />
      )}
    </g>
  );
};

export default TreeNode;
