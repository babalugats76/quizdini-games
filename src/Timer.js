import React, { Component } from 'react';

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

    if (remaining < 0) { // If game over  
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
    const { scale } = this.props; 
    return (<div id="timer">{Math.max(remaining, 0).toFixed(scale)}</div>);
  }

}

export default Timer;