import React, { useState } from "react";
import Board from "./components/Board";
import ToggleSwitch from "./ToggleSwitch";
import BoardSelect from "./components/BoardSelect";

function App() {
  const [boardsize, setBoardSize] = useState(16);
  const [difficulty, setdifficulty] = useState('medium');
  const [color, setColor] = useState('black');
  const [isDay, setIsDay] = useState(true);

  const handleBoardSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setBoardSize(newSize);
  };
  const handledifficulty = (e) => {
    const diffi = e.target.value;
    setdifficulty(diffi);
  };
  const handleToggle = () => {
    setIsDay(!isDay);
    setColor(color === 'black' ? 'white' : 'black');
  };

  const bgimage = isDay ? "url('/scenary.png')" : "url('/Japan---mt.-fuji-night-.png')";

  return (
    <div className={`h-full bg-cover bg-center min-h-[100vh] `} style={{ backgroundImage: bgimage } }>
      <div>
        {/* <BoardSelect onBoardSizeChange={handleBoardSizeChange}/> */}
      </div>
      <div className="flex justify-between p-2">
        <div>
          <ToggleSwitch isDay={isDay} onToggle={handleToggle} />
        </div>
        <div className="mb-4">
          <label htmlFor="size" className={`text-${color}`}>Select Board Size: </label>
          <select id="size" value={boardsize} onChange={handleBoardSizeChange}>
            <option value={9}>Small (9x9)</option>
            <option value={12}>Medium (12x12)</option>
            <option value={15}>Large (15x15)</option>
          </select>
          <label htmlFor="size">Select Difficulty: </label>
          <select id="size" value={difficulty} onChange={handledifficulty}>
            <option value={'easy'}>Easy</option>
            <option value={'medium'}>Medium</option>
            <option value={'hard'}>Difficult</option>
          </select>
        </div>
      </div>
      <Board size={boardsize} mode={color} difficulty={difficulty}  />
    </div>
  );
}

export default App;
