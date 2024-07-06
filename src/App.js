import BoardSelect from "./components/BoardSelect";


import { useState } from "react";
import Board from "./components/Board";
import ToggleSwitch from "./ToggleSwitch";
function App() {
  
    const [boardsize, setBoardSize] = useState(16);
    const [color, setcolor] = useState('black');
    const handleBoardSizeChange = (e) => {
      const newSize = parseInt(e.target.value);
      setBoardSize(newSize);
    };
    const [isDay, setIsDay] = useState(true);
    
    const handleToggle = () => {
      setIsDay(!isDay);
      if(color === 'black'){
        setcolor("white")
      }
      else{
        setcolor("black");
      }
      console.log("hi",color)
      console.log("xx",isDay)
    };
  const bgimage=isDay?"url('/scenary.png')":"url('/Japan---mt.-fuji-night-.png')";
  return (
    <div
  className="bg-cover bg-center h-screen"
  style={{ backgroundImage: bgimage }}
>
  <div>
  {/* <BoardSelect onBoardSizeChange={handleBoardSizeChange}/> */}
  </div>
<div className="flex justify-between p-2">
  <div>
  <ToggleSwitch isDay={isDay} onToggle={handleToggle}/>
  </div>

  <div className="mb-4">
        <label htmlFor="size">Select Board Size: </label>
        <select id="size" value={boardsize} onChange={handleBoardSizeChange}>
          <option value={9}>Small (9x9)</option>
          <option value={16}>Medium (16x16)</option>
          <option value={24}>Large (30x16)</option>
        </select>
       
    </div>
</div>

<Board size={boardsize} mode={color}/>
</div>
  )
}

export default App;
