import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { rootSaga } from './modules/rootSaga';
import { rootReducer } from './modules/rootReducer';

import '../App.css';
import { Root } from './components/root/Root';


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

export const App: FC = () => (
  <div className="App">
    <Provider store={store}>
      <ToastContainer />
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </Provider>
  </div>
);
