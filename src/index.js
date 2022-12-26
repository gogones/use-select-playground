import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import TimePicker from "./TimePicker";
import fruits from "./fruits";

// const options = fruits.map((d, i) => ({
//   value: d,
//   label: d
// }));

function App() {
  const [time, setTime] = useState(new Date());
  // const [fruits, setFruits] = useState([options[0].value]);
  return (
    <div className="App">
      <div>
        <TimePicker
          value={time}
          onChange={(newTime) => setTime(newTime)}
          placeholder="Select one..."
        />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
