import React, { Component } from 'react';

import Timer from './Timer';
import computer from './computer.svg';
import stars from './computer-stars.svg';

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
       const { score, correct, incorrect, duration, onGameOver } = this.props;
       const { active } = this.state;
       return(<React.Fragment>
              <div id="scoreboard">
                { active && (<Timer duration={duration} 
                                    interval={100} 
                                    scale={1} 
                                    onGameOver={onGameOver} />) } 
                <span id="score">{score}</span>
                <span id="correct">{correct}</span>
                <span id="incorrect">{incorrect}</span>
             </div>
             <img id="computer" alt="Computer" src={computer} />
             <img id="computer-stars" alt="Computer Accent Stars" src={stars} />
             </React.Fragment>);
   }
}

export default Scoreboard;