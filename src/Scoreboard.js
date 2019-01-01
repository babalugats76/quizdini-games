import React, { Component } from 'react';

import Timer from './Timer';

class Scoreboard extends Component {

   constructor(props) {
      super(props);
      this.state = ({
         active: false
      });
   }

   componentDidMount() {
     setTimeout(() => this.toggleActive(), this.props.wait);
   }

   toggleActive = () => {
     this.setState((state, props) => {
        return { active: !state.active }
     }); 
   }

   render() {
       const { correct, incorrect, duration, onGameOver } = this.props;
       const { active } = this.state;
       return(<div id="scoreboard">
                <div id="correct">{correct}</div>
                { active && (<Timer duration={duration} 
                                    interval={100} 
                                    scale={1} 
                                    onGameOver={onGameOver} />) } 
                <div id="incorrect">{incorrect}</div>
             </div>);
   }
}

export default Scoreboard;