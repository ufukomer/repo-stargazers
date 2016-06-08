/** Type Definitions **/

export interface IStargazer {
  stargazer: Object;
}

export interface IStargazerAction {
  type: string;
  stargazer?: Object;
  message?: any;
}
