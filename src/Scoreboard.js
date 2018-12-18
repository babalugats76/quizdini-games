import React, { Component } from 'react';

class Scoreboard extends Component {
   render() {
       const {score, correct, incorrect} = this.props;
       return(<div id="scoreboard">
                <span id="score">{score}</span>
                <span id="correct">{correct}</span>
                <span id="incorrect">{incorrect}</span>
              </div>);
   }
}

export default Scoreboard;