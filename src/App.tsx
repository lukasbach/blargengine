import React, {useEffect} from 'react';
import './App.css';
import {GameEngine} from "./gameengine/GameEngine";
import {TestGame} from "./gameengine/TestGame";

const App: React.FC = () => {
  useEffect(() => {
    new GameEngine(document.getElementById('container')!, TestGame);
  }, [])

  return (
    <div className="App" id={'container'}>

    </div>
  );
}

export default App;
