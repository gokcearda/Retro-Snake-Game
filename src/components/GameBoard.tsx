import React from 'react';

type Position = { x: number; y: number };

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  cellSize: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  food,
  gridSize,
  cellSize,
}) => {
  const canvasSize = gridSize * cellSize;

  return (
    <div className="relative aspect-square w-full max-w-[500px] mx-auto bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${canvasSize} ${canvasSize}`}
        className="block"
      >
        {Array.from({ length: gridSize }).map((_, i) => (
          <React.Fragment key={`grid-${i}`}>
            <line
              x1={i * cellSize}
              y1={0}
              x2={i * cellSize}
              y2={canvasSize}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            <line
              x1={0}
              y1={i * cellSize}
              x2={canvasSize}
              y2={i * cellSize}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          </React.Fragment>
        ))}

        {snake.map((segment, index) => (
          <rect
            key={`snake-${index}`}
            x={segment.x * cellSize}
            y={segment.y * cellSize}
            width={cellSize}
            height={cellSize}
            fill={index === 0 ? '#10b981' : '#34d399'}
            rx={cellSize / 4}
          />
        ))}

        <circle
          cx={food.x * cellSize + cellSize / 2}
          cy={food.y * cellSize + cellSize / 2}
          r={cellSize / 3}
          fill="#ef4444"
        />
      </svg>
    </div>
  );
};
