import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
const createLogger = require('redux-logger');
const router = routerMiddleware(browserHistory);

export function configureStore(initialState?: any): Redux.Store {

  let middlewares: Redux.Middleware[] = [router, thunk];

  if (process.env.NODE_ENV === `development`) {
    const logger: Redux.Middleware = createLogger();
    middlewares.push(logger);
  }

  const enhancer: Function = applyMiddleware(...middlewares);
  
  const store: Redux.Store = createStore(
    rootReducer,
    initialState,
    enhancer
  );

  return store;
}
