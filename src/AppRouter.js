import React from 'react';
import { BrowserRouter, Route, hashHistory} from 'react-router-dom'
import Home from './Views/Home'
import Terms from './Views/Terms'
import DataSecurity from './Views/DataSecurity'
import Imprint from './Views/Imprint'
import ActionBar from './Components/ActionBar'
import './normalize.scss'
import './variables.scss'
const ActionBarLinks = [
    {
        name: 'IMPRINT',
        url: 'Imprint'
    },
    {
        name: 'DATA SECURITY',
        url: 'DataSecurity'
    }
]

function AppRouter() {
    return (
        <BrowserRouter>
            <div className="App">
                <Route path="/" exact component={Home} />
                <Route path="/Home" component={Home} />
                <Route path="/Imprint" component={Imprint} />
                <Route path="/Impressum" component={Imprint} />
                <Route path="/Datenschutz" component={DataSecurity} />
                <Route path="/DataSecurity" component={DataSecurity} />
                <Route path="/Terms" component={Terms} />
                <Route path="/AGB" component={Terms} />
            </div>
            <ActionBar links={ActionBarLinks} />
        </BrowserRouter>
  );
}

export default AppRouter;
