import App from './App';
import React, {useEffect} from 'react';
import {store} from "./reducer";
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById('root')
);