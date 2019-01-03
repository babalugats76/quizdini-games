import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar'; 

import GameTransition from './GameTransition';

class Timer extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      startTime: Date.now(),
      remaining: props.duration,
      showTransition: false,
      success: false
    })
  }

  componentDidMount() {
    this.setState((state, props) => {
      const id = setInterval(this.tick, props.interval);
      return { id: id }
    });

  }

  componentWillUpdate(nextProps, nextState) {
    if(nextProps.score !== this.props.score) {
      console.log('Score change detected...');
      const success = ((nextProps.score > this.props.score) ? true : false);
      this.setState((state, props) => {
        return { 
          showTransition: true, 
          success: success
        };
      });
    }
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

  endTransition = () => {
    this.setState((state, props) => {
      return { showTransition : false };
    });
  }

  render() {
    const { remaining, showTransition, success } = this.state;
    const { timeout, duration, score } = this.props; 
    const percent = Math.ceil(((duration - remaining) / duration) * 100);

    const transitionStyles = {
      default: { opacity: 1.0 },
      entering: { transition: `transform cubic-bezier(1, 0, 0, 1)`, transform: 'scale(1, 1)' },
      entered: { transform: 'scale(1, 1)', 'opacity': 1.0},
      exiting: { transition: `transform cubic-bezier(1, 0, 0, 1)`, transform: 'scale(1.1, 1.1)', opacity: 1.0},
      exited: { opacity: .95}
    };

    const classes = {
      root: 'timer',
      path: 'timer-path',
      trail: 'timer-trail',
      background: 'timer-background',
      text: 'timer-text' 
    };

    const progressColor = ((percent <= 70) ? '#1fe73f' : (percent <= 85 ? '#ffe119' : '#e6194b')) ;

    console.log(success);

    return(
      <GameTransition 
          mountOnEnter={false}
          unmountOnExit={false}
          appear={true}
          in={!showTransition} 
          timeout={timeout} 
          transitionStyles={transitionStyles}
          onExited={this.endTransition}
          >
          <div id="timer">
            <CircularProgressbar 
                initialAnimation
                background
                classes={classes}
                counterClockwise
                percentage={percent} 
                strokeWidth={4}
                styles={{ 'trail': { stroke: progressColor, visibility: ((showTransition) ? 'hidden' : 'visible') }, 
                          'background': { fill: ((showTransition) ? ((success) ? '#1fe73f' : '#e6194b') : undefined) }
                       }}
                text={score.toString()} />
           </div></GameTransition>);
  }

}

export default Timer;