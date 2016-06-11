import * as async from 'async';
import { IStargazer, IStargazerAction } from './stargazer.model';
import * as Api from '../../../../server/helpers/api';

/** Action Types **/
export const SAVE_REQUEST = 'SAVE_REQUEST';
export const SAVE_SUCCESS = 'SAVE_SUCCESS';
export const SAVE_FAILURE = 'SAVE_FAILURE';

/** Initial State **/
const initialState: IStargazer = {
  stargazer: {}
};

/** Reducer **/
export function stargazerReducer(state = initialState, action: IStargazerAction) {
  switch (action.type) {
    case SAVE_REQUEST:
      console.info(action);
      break;
    case SAVE_SUCCESS:
      console.info(action);
      break;
    case SAVE_FAILURE:
      console.info(action);
      break;
    default:
      return state;
  }
}

/** Async Action Creator **/
export function saveStargazers(): Redux.Dispatch {
  const fetchQueue = async.queue(Api.fetchStarGazers, 1);

  const saveUserAction = (user) => {
    console.info(`User ${user.login} is saved with location ${user.location}`);
  };

  return dispatch => {
    dispatch(stargazerRequest());
    return Api.fetchPageCount()
      .then((count: number) => {
        for (let i = 1; i <= count; i++) {
          fetchQueue.push({
            index: i,
            store: (user) => console.info(user),
            run: (user) => dispatch(stargazerSuccess(user))
          }, (error?: any) => {
            if (error) {
              dispatch(stargazerFailure(error));
            }
          });
        }
      })
      .catch((error?: any) => {
        dispatch(stargazerFailure(error));
      })
      .done(() => {
        console.info('Fetching is done.');
      });
  };
}

/** Action Creator **/
export function stargazerRequest(): IStargazerAction {
  return {
    type: SAVE_REQUEST
  };
}

/** Action Creator **/
export function stargazerSuccess(stargazer: Object): IStargazerAction {
  return {
    type: SAVE_SUCCESS,
    stargazer
  };
}

/** Action Creator **/
export function stargazerFailure(message: any): IStargazerAction {
  return {
    type: SAVE_FAILURE,
    message
  };
}
