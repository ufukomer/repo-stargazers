import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import rootReducer from './reducers';
const thunk = require('redux-thunk');
const createLogger = require('redux-logger');
const router = routerMiddleware(browserHistory);

export function configureStore(initialState?: any): Redux.Store {

  let middlewares: Redux.Middleware[] = [router];

  if (process.env.NODE_ENV === `development`) {
    const logger: Redux.Middleware = createLogger();
    middlewares = [...middlewares, logger];
  }

  const store: Redux.Store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  );

  return store;
}
