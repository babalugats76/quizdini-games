import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar'; 

import GameTransition from './GameTransition';

class Timer extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      show: false,
      remaining: props.duration,
      showTransition: false,
      startTime: Date.now(),
      success: false
    })
  }

  componentDidMount() {
    setTimeout(() => this.startTimer(), this.props.wait);
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextProps.correct !== this.props.correct || nextProps.incorrect !== this.props.incorrect) {
      console.log('Score change detected...');
      const success = ((nextProps.correct > this.props.correct) ? true : false);
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

    if (Math.ceil(remaining) < 0) { // If no time remaining, i.e., game over  
      clearInterval(this.state.id); // clear execution of tick
      return this.props.onTimerEnd(); // Let parent know that timer has exhausted itself
    } else { 
      this.setState((state, props) => {
        return { remaining }
      });
    }

  }

  startTimer = () => {
    this.setState((state, props) => {
      const id = setInterval(this.tick, props.interval);
      return { show: true, id: id }
    });
    return this.props.onTimerStart();
  }

  endTransition = () => {
    this.setState((state, props) => {
      return { showTransition : false };
    });
  }

  render() {
    const { remaining, showTransition, success, show } = this.state;
    const { wait, duration, score } = this.props; 
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

    const colors = {
      GREEN: '#1fe73f',
      YELLOW: '#ffe119',
      RED: '#e6194b'
    }

    const progressColor = ((percent <= 70) ? colors.GREEN : (percent <= 85 ? colors.YELLOW : colors.RED)) ;

    return(<React.Fragment>
             { show && 
               (<GameTransition 
                  mountOnEnter={false}
                  unmountOnExit={false}
                  appear={true}
                  in={!showTransition} 
                  timeout={wait} 
                  transitionStyles={transitionStyles}
                  onExited={this.endTransition}>
                  <div id="timer">
                    <div className="timer-wrapper">
                      <div className="progress-bar-wrapper">
                        <CircularProgressbar 
                          initialAnimation
                          background
                          classes={classes}
                          counterClockwise
                          percentage={percent} 
                          strokeWidth={4}
                          styles={{ 'trail': { stroke: progressColor, visibility: ((showTransition) ? 'hidden' : 'visible') }, 
                                    'background': { fill: ((showTransition) ? ((success) ? colors.GREEN : colors.RED) : undefined) }
                                 }} />
                      </div>  
                      <div className="timer-score-wrapper">
                        <div id="timer-score">{score.toString()}</div>
                      </div> 
                    </div>  
                  </div>
                </GameTransition>)
             }
          </React.Fragment>);
  }

}

export default Timer;