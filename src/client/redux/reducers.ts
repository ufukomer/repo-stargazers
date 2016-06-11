import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { stargazerReducer } from './modules/stargazer/stargazer';

const rootReducer: Redux.Reducer = combineReducers({
  routing: routerReducer,
  stargazer: stargazerReducer
});

export default rootReducer;
