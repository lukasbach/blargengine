import React, {useEffect} from 'react';
import './App.css';
import {GameEngine} from "./gameengine/GameEngine";
import {KeyGame} from "./gameengine/KeyGame";

const App: React.FC = () => {
  useEffect(() => {
    new GameEngine(document.getElementById('container')!, KeyGame);
  }, [])

  return (
    <div className="App" id={'container'}>

    </div>
  );
}

export default App;
