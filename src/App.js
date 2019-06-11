import React from 'react';
import { Store } from './Store';
import './App.css';
import BabylonScene from './Components/BabylonScene'

function App() {
    const store = React.useContext(Store);
    return (
    <div className="App">
      <header className="App-header">
          {console.log(store)}

        <BabylonScene/>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
