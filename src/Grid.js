import React, { useState, useEffect } from 'react';

const numRows = 40;
const numCols = 40;

const generateColor = () => {
  const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Cell = ({ alive }) => (
  <div
    style={{
      width: 20,
      height: 20,
      backgroundColor: alive ? generateColor() : 'white',
      border: '1px solid gray',
    }}
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`,
      }}
    >
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <Cell key={`${i}-${j}`} alive={cell} />
        )),
      )}
    </div>
  );
};

export default Grid;
