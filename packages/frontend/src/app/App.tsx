import React, { FunctionComponent } from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';

import { rootSaga } from './modules/rootSaga';
import { rootReducer } from './modules/rootReducer';

import { Login } from './components/Login';
import { RegisterForm } from './components/RegisterForm';

import '../App.css';


// add redux devtools to window
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const sagaMiddleware = createSagaMiddleware();


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga);

export const App: FunctionComponent = () => (
  <div className="App">
    <Provider store={store}>
      <div>
        <Login />
      </div>
      <div>
        <RegisterForm />
      </div>
    </Provider>
  </div>
);
