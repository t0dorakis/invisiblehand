import React from 'react';
import { HashRouter, Route } from 'react-router-dom'
import Home from './Views/Home'
import Terms from './Views/Terms'
import DataSecurity from './Views/DataSecurity'
import WeAreHiring from './Views/WeAreHiring'
import Imprint from './Views/Imprint'
import ActionBar from './Components/ActionBar'
import Header from './Components/Header'
import './normalize.scss'
import './variables.scss'
const ActionBarLinks = [
    {
        name: 'Imprint',
        url: 'Imprint'
    },
    {
        name: 'Data Policy',
        url: 'DataSecurity'
    }
]

function AppRouter() {
    return (
        <HashRouter>
          <Header links={ActionBarLinks} />
          <div className="App">
                <Route path="/" exact component={Home} />
                <Route path="/Home" component={Home} />
                <Route path="/Imprint" component={Imprint} />
                <Route path="/Impressum" component={Imprint} />
                <Route path="/Datenschutz" component={DataSecurity} />
                <Route path="/DataSecurity" component={DataSecurity} />
                <Route path="/wearehiring" component={WeAreHiring} />
                <Route path="/job" component={WeAreHiring} />
                <Route path="/jobs" component={WeAreHiring} />
                <Route path="/Terms" component={Terms} />
                <Route path="/AGB" component={Terms} />
            </div>
            <ActionBar links={ActionBarLinks} />
        </HashRouter>
  );
}

export default AppRouter;
