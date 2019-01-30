import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom"; 
import MatchGame from './MatchGame';

class App extends Component {
  render() {
    return (<Router>
              <Route path='/match/:id' component={MatchGame} />
            </Router>);
  }
}

export default App;