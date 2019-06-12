import React from 'react';
import { Store } from './Store';
import './App.scss';
import PageWithScene from "./Views/ViewWithScene";


function App() {
    const store = React.useContext(Store);
    return (
    <div className="App">
      <header className="App-header">
          {console.log(store)}

        <PageWithScene/>
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
