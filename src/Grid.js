import React, { useState, useEffect } from 'react';

const numRows = 40;
const numCols = 40;

const generateColor = () => {
  const colors = [
    'bg-slate-400',
    'bg-slate-500',
    'bg-slate-600',
    'bg-slate-700',
    'bg-gray-400',
    'bg-gray-500',
    'bg-gray-600',
    'bg-gray-700',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Cell = ({ alive }) => (
  <div
    className={`${alive ? generateColor() : 'bg-white'} border border-gray-900 w-5 h-5`}
  />
);

const createEmptyGrid = () => {
  return Array(numRows).fill().map(() => Array(numCols).fill(false));
};

const initializeRPentomino = (grid) => {
  const x = Math.floor(numRows / 2);
  const y = Math.floor(numCols / 2);
  grid[x][y] = true;
  grid[x][y - 1] = true;
  grid[x - 1][y] = true;
  grid[x - 1][y + 1] = true;
  grid[x - 2][y] = true;
};

const Grid = () => {
  const [grid, setGrid] = useState(() => {
    const emptyGrid = createEmptyGrid();
    initializeRPentomino(emptyGrid);
    return emptyGrid;
  });

  const restartAnimation = () => {
    const emptyGrid = createEmptyGrid();
    initializeRPentomino(emptyGrid);
    setGrid(emptyGrid);
  };

  const nextGeneration = () => {
    const newGrid = createEmptyGrid();

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let liveNeighbors = 0;
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            if (x === 0 && y === 0) continue;
            const newX = i + x;
            const newY = j + y;
            if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols) {
              liveNeighbors += grid[newX][newY] ? 1 : 0;
            }
          }
        }

        if (grid[i][j] && (liveNeighbors === 2 || liveNeighbors === 3)) {
          newGrid[i][j] = true;
        } else if (!grid[i][j] && liveNeighbors === 3) {
          newGrid[i][j] = true;
        }
      }
    }

    setGrid(newGrid);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextGeneration();
    }, 100);

    return () => clearInterval(interval);
  }, [grid]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl mb-1">ChatGPT4 - R-pentomino Conway's Game of Life</h2>
      <button
        className="mt-4 mb-4 px-4 py-2 text-white font-semibold bg-slate-600 hover:bg-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
        onClick={restartAnimation}
      >
        Restart Animation
      </button>
      <div
        className="grid grid-flow-row-dense gap-0.5"
        style={{
            gridTemplateColumns: `repeat(${numCols}, 1.25rem)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <Cell key={`${i}-${j}`} alive={cell} />
          )),
        )}
      </div>
    </div>
  );
};

export default Grid;
