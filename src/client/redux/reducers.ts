import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const rootReducer: Redux.Reducer = combineReducers({
  routing: routerReducer
});

export default rootReducer;
