import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import rootreducer from './reducers/root.js';
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension'

const compose=composeWithDevTools(applyMiddleware(thunkMiddleware));

const myStore=createStore(rootreducer,compose);
ReactDOM.render(
	<Provider store={myStore}>
	<App /></Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 