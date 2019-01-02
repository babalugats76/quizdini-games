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
       const { correct, incorrect, duration, onGameOver } = this.props;
       const { active } = this.state;
       return(<React.Fragment>
                { active && (<Timer duration={duration} 
                                    interval={100} 
                                    scale={1} 
                                    onGameOver={onGameOver} />) } 
              </React.Fragment>);
       /*return(<div id="scoreboard">
       <div id="correct">{correct}</div>
       { active && (<Timer duration={duration} 
                           interval={100} 
                           scale={1} 
                           onGameOver={onGameOver} />) } 
       <div id="incorrect">{incorrect}</div>
       </div>);  */     
   }
}

export default Scoreboard;