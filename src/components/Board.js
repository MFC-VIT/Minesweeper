import React, { useState, useEffect } from 'react';

function Board({ size, mode, difficulty, mines }) {
  const [cells, setCells] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(0);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [powerups, setPowerups] = useState({ revealSurroundingCells: 2, freezeTimer: 1 });

  useEffect(() => {
    if (size) {
      const parsedSize = parseInt(size);
      if (!isNaN(parsedSize) && parsedSize > 0) {
        let rows = parsedSize;
        let cols = parsedSize;

        if (parsedSize === 24) {
          rows = 24;
          cols = 16;
        }

        initializeBoard(rows, cols);
      }
    }
    return () => clearInterval(intervalId);
  }, [size, difficulty, mines]);

  const initializeBoard = (rows, cols) => {
    const initialCells = initializeCells(rows, cols);
    const cellsWithMines = placeMines(initialCells, rows, cols);
    const finalCells = placeNumbers(cellsWithMines, rows, cols);
    setCells(finalCells);
    setGameOver(false);
    setTimer(0);
    setGameStarted(false);
    clearInterval(intervalId);
  };

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],         [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  const placeNumbers = (grid, rows, cols) => {
    const grids = JSON.parse(JSON.stringify(grid));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!grids[row][col].isMine) {
          directions.forEach(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && grids[newRow][newCol].isMine) {
              grids[row][col].num++;
            }
          });
        }
      }
    }
    return grids;
  };

  const initializeCells = (rows, cols) => {
    const cellsArray = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push({ isMine: false, isOpen: false, num: 0, isFlagged: false });
      }
      cellsArray.push(row);
    }
    return cellsArray;
  };

  const createMines = (rows, cols) => {
    if (mines) return mines;
    switch (difficulty) {
      case 'easy':
        return 10;
      case 'medium':
        return 40;
      case 'hard':
        return 99;
      default:
        return 40;
    }
  };

  const placeMines = (cellsArray, rows, cols) => {
    const cellsCopy = JSON.parse(JSON.stringify(cellsArray));
    const minesCount = createMines(rows, cols);
    setFlagsLeft(minesCount);
    let minesPlaced = 0;

    while (minesPlaced < minesCount) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);

      if (!cellsCopy[row][col].isMine) {
        cellsCopy[row][col].isMine = true;
        minesPlaced++;
      }
    }

    return cellsCopy;
  };

  const handleCellClick = (row, col) => {
    if (gameOver || cells[row][col].isOpen) {
      return;
    }

    if (!gameStarted) {
      setGameStarted(true);
      startTimer();
    }

    const cellsCopy = JSON.parse(JSON.stringify(cells));
    const clickedCell = cellsCopy[row][col];

    if (clickedCell.isMine) {
      revealAllMines(cellsCopy);
      setCells(cellsCopy);
      setGameOver(true);
      clearInterval(intervalId);
    } else {
      openCell(cellsCopy, row, col);
      setCells(cellsCopy);
      checkWin(cellsCopy);
    }
  };

  const openCell = (cellsCopy, row, col) => {
    const cell = cellsCopy[row][col];

    if (cell.isOpen || cell.isFlagged) {
      return;
    }

    cell.isOpen = true;

    if (cell.num === 0) {
      directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < cellsCopy.length && newCol >= 0 && newCol < cellsCopy[0].length) {
          openCell(cellsCopy, newRow, newCol);
        }
      });
    }
  };

  const revealAllMines = (cellsCopy) => {
    for (let i = 0; i < cellsCopy.length; i++) {
      for (let j = 0; j < cellsCopy[i].length; j++) {
        if (cellsCopy[i][j].isMine) {
          cellsCopy[i][j].isOpen = true;
        }
      }
    }
  };

  const checkWin = (cellsCopy) => {
    const allNonMinesOpen = cellsCopy.every(row =>
      row.every(cell => cell.isMine || cell.isOpen)
    );
    if (allNonMinesOpen) {
      setGameOver(true);
      clearInterval(intervalId);
      alert("You win!");
    }
  };

  const startTimer = () => {
    clearInterval(intervalId);
    const newIntervalId = setInterval(() => setTimer(prev => prev + 1), 1000);
    setIntervalId(newIntervalId);
  };

  const handleRightClick = (e, row, col) => {
    e.preventDefault();

    if (gameOver || cells[row][col].isOpen) {
      return;
    }

    const cellsCopy = JSON.parse(JSON.stringify(cells));
    const cell = cellsCopy[row][col];

    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlagsLeft(prev => prev + 1);
    } else {
      if (flagsLeft > 0) {
        cell.isFlagged = true;
        setFlagsLeft(prev => prev - 1);
      }
    }

    setCells(cellsCopy);
  };

  const resetBoard = () => {
    const parsedSize = parseInt(size);
    if (!isNaN(parsedSize) && parsedSize > 0) {
      let rows = parsedSize;
      let cols = parsedSize;

      if (parsedSize === 24) {
        rows = 24;
        cols = 16;
      }

      initializeBoard(rows, cols);
    }
    const minesCount = createMines(parsedSize);
    setFlagsLeft(minesCount);
    setTimer(0);
    clearInterval(intervalId);
    setPowerups({ revealSurroundingCells: 2, freezeTimer: 1 });
  };

  const handlePowerUp = (type) => {
    if (powerups[type] > 0) {
      setPowerups((prev) => ({ ...prev, [type]: prev[type] - 1 }));
      switch (type) {
        case 'revealSurroundingCells':
          revealSurroundingCells();
          break;
        case 'freezeTimer':
          freezeTimer();
          break;
        default:
          break;
      }
    }
  };

  const revealSurroundingCells = () => {
    const unopenedCells = cells.flatMap((row, rowIndex) =>
      row.map((cell, colIndex) => ({ ...cell, rowIndex, colIndex }))
    ).filter(cell => !cell.isOpen);

    if (unopenedCells.length === 0) return;

    const randomCell = unopenedCells[Math.floor(Math.random() * unopenedCells.length)];
    const cellsCopy = JSON.parse(JSON.stringify(cells));
    directions.forEach(([dx, dy]) => {
      const newRow = randomCell.rowIndex + dx;
      const newCol = randomCell.colIndex + dy;
      if (newRow >= 0 && newRow < cellsCopy.length && newCol >= 0 && newCol < cellsCopy[0].length && !cellsCopy[newRow][newCol].isMine) {
        openCell(cellsCopy, newRow, newCol);
      }
    });
    setCells(cellsCopy);
    checkWin(cellsCopy);
  };

  const freezeTimer = () => {
    clearInterval(intervalId);
    setTimeout(() => {
      startTimer();
    }, 10000); // Freeze the timer for 10 seconds
  };

  if (!cells.length) {
    return null; // or loading indicator
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`flex items        -center justify-center space-x-4 mb-2 text-${mode}`}>
        <div className="flex gap-2">
          <img src="/red-flag.png" alt="Flags left" />
          <div>: {flagsLeft}</div>
        </div>
        <div className='flex gap-2'>
          <img className='w-6 h-6' src="/chronometer.png" alt="Timer" />
          <div>Timer: {timer}s</div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {cells.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-[1.85rem] bg-slate-400 text-center shadow ${cell.isOpen ? 'bg-slate-100 border-[1.5px] border-[#696969]' : 'bg-slate-400 border-[1.5px] border-[#d3d3d3]'}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
              >
                {cell.isOpen ? (
                  cell.isMine ? (
                    <div className="flex items-center justify-center w-full h-full bg-[#ff0000] border-[1.5px] border-[#8b000]">
                      <img className="" src="/mine.png" alt="Mine" />
                    </div>
                  ) : (
                    <div className="w-[1.5rem] h-[1.5rem] flex items-center justify-center ">{cell.num > 0 ? cell.num : ''}</div>
                  )
                ) : (
                  cell.isFlagged ? (
                    <img className="w-[1.5rem] border-[1.5px] h-[1.5rem] bg-[#ffd700]" src="/red-flag.png" alt="Flag" />
                  ) : (
                    <div className="text-gray-400 w-[1.5rem] h-[1.5rem]">{" "}</div>
                  )
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-4 mt-2">
        <button onClick={resetBoard} className="bg-blue-500 text-white py-2 px-4 rounded">Reset</button>
        {!gameStarted && !gameOver && (
          <button onClick={() => { setGameStarted(true); startTimer(); }} className="bg-green-500 text-white py-2 px-4 rounded">Start</button>
        )}
      </div>
      {gameOver && (
        <div className="mt-2 text-red-600">
          Game Over
        </div>
      )}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => handlePowerUp('revealSurroundingCells')}
          className={`bg-orange-500 text-white py-2 px-4 rounded ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={gameOver}
        >
          Reveal Surrounding Cells ({powerups.revealSurroundingCells})
        </button>
        <button
          onClick={() => handlePowerUp('freezeTimer')}
          className={`bg-blue-500 text-white py-2 px-4 rounded ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={gameOver}
        >
          Freeze Timer ({powerups.freezeTimer})
        </button>
      </div>
    </div>
  );
}
export default Board;
