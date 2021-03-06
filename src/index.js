import './variables.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider } from './Store';
import 'pepjs'

import './index.scss';
import * as serviceWorker from './serviceWorker';
import AppRouter from "./AppRouter";


ReactDOM.render(
        <StoreProvider>
            <AppRouter/>
        </StoreProvider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
