import * as React from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state: any) {
  return {
    stargazer: state.stargazer
  };
}

function mapDispatchToProps(dispatch: Redux.Dispatch) {
  return {
    // saveStargazers: () => dispatch(saveStargazers())
  };
}

class App extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  render() {
    const s = require('./style.css');

    return (
      <div style={s.app}>
        Empty
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
