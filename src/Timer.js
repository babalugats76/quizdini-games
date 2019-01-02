import React, { Component } from 'react';

import CircularProgressbar from 'react-circular-progressbar'; 
import MatchGame from './MatchGame';

class Timer extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      startTime: Date.now(),
      remaining: props.duration,
    })
  }

  componentDidMount() {
    this.setState((state, props) => {
      const id = setInterval(this.tick, props.interval);
      return { id: id }
    });

  }

  tick = () => {

    // Calculate time remaining
    const remaining = this.props.duration - ((Date.now() - this.state.startTime) / 1000);

    if (Math.ceil(remaining) < 0) { // If game over  
      clearInterval(this.state.id); // clear execution of tick
      return this.props.onGameOver(); // Let parent know game is over
    } else { 
      this.setState((state, props) => {
        return { remaining }
      });
    }

  }

  render() {
    const { remaining } = this.state;
    const { scale, duration } = this.props; 
    // eslint-disable-next-line
    const percent = Math.ceil(((duration - remaining) / duration) * 100);
    
    // eslint-disable-next-line
    const percentLeft = Math.max(100 - percent,0);
    console.log(percentLeft);
    console.log(remaining);
    //console.log(percentLeft);
    // eslint-disable-next-line
    const timeLeft = Math.max(remaining, 0).toFixed(scale);
    /*return (<div id="timer">{Math.max(remaining, 0).toFixed(scale)}</div>); */

    // eslint-disable-next-line
    const classes = {
      root: 'timer',
      path: 'timer-path',
      trail: 'timer-trail',
      background: 'timer-background',
      text: 'timer-text' 
    };

    const progressColor = ((percent <= 70) ? '#1fe73f' : (percent <= 85 ? '#ffe119' : '#e6194b')) ;

    return(<div id="timer">
             <CircularProgressbar 
                initialAnimation
                background
                classes={classes}
                counterClockwise
                percentage={percent} 
                strokeWidth={4}
                styles={{ 'trail': { stroke: progressColor } }}
                text={percent} />
           </div>);
  }

}

export default Timer;