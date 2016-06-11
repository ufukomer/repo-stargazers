import * as React from 'react';
import { connect } from 'react-redux';
import { saveStargazers } from '../../redux/modules/stargazer/stargazer'

function mapStateToProps(state: any) {
  return {
    stargazer: state.stargazer
  };
}

function mapDispatchToProps(dispatch: Redux.Dispatch) {
  return {
    saveStargazers: () => dispatch(saveStargazers())
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
        <button onClick={/*() => this.props.saveStargazers*/}>
          Click to star fetching!
        </button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
