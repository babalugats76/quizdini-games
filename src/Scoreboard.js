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
      // eslint-disable-next-line
       const { correct, incorrect, score, wait, duration, onGameOver } = this.props;
       const { active } = this.state;
       return(<React.Fragment>
                { active && (<Timer 
                                    correct={correct}
                                    incorrect={incorrect}
                                    score={score}
                                    duration={duration} 
                                    interval={100} 
                                    scale={1} 
                                    timeout={500}
                                    onGameOver={onGameOver} />) } 
              </React.Fragment>);   
   }
}

export default Scoreboard;