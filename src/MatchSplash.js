import React, { Component } from 'react';
import computer from './computer.svg';
import computerStars from './computer-stars.svg';
import GameTransition from './GameTransition';
import stars from './stars.svg';
import logo from './logo.svg';

class MatchSplash extends Component {

  /* Initialize component, including state */
  constructor(props) {
    super(props);
    this.state = ({ show: false });
  }

  /* When component mounts, toggle component visibility; after short timeout */
  componentDidMount() {
    setTimeout(() => this.toggleShow(), this.props.wait);
  }

  /* Toggles, i.e., shows/hides component, triggering transitions */
  toggleShow = () => {
    this.setState((state, props) => {
      return { show: !state.show };
    });
  }

  /* When clicked toggle visibility; triggers exit transition */
  handleClick = (e) => {
    e.preventDefault();
    this.toggleShow();
  }

  /* When exited, call parent function to start game */
  handleExited = () => {
    this.props.onGameStart();
  }

  render() {

    const { style, title, termCount, topic, author, instructions, showResults, score } = this.props;
    const { show } = this.state;

    /* Transition timeouts */
    const timeout = {
      enter: this.props.wait,
      exit: this.props.wait
    };

    /* Define object for the following states: 'default', 'entering', 'entered', 'exiting', 'exited' */
    const transitionStyles = {
      default: { opacity: 0 },
      entering: { opacity: 0 },
      entered: { transition: `opacity ${timeout.enter}ms cubic-bezier(1,.01,.7,.84)`, opacity: 1.0 },
      exiting: { transition: `opacity ${timeout.exit}ms cubic-bezier(1,.01,.7,.84)`, opacity: 0.1 },
      exited: { opacity: 0 }
    };

    /* Render splash screen, wrapped in a transition */
    return (
      <GameTransition
        mountOnEnter={false}
        unmountOnExit={true}
        appear={true}
        in={show}
        timeout={timeout}
        transitionStyles={transitionStyles}
        onExited={this.handleExited}>
        <div id="splash-wrapper" style={style}>
          <div id="splash">
            <img id="splash-logo" src={logo} alt="Quizdini logo" />
            <div id="title">{title}</div>
            { showResults 
                ? (<div id="score">{score}</div>)
                : (<div id="instructions">{instructions}</div>)
            }
            <div id="splash-details">
              <div id="matches">{termCount} matches</div>
              <div id="topic">{topic}</div>
              <div id="author">{author}</div>
            </div>
          </div>
          <button id="play" onClick={(e) => this.handleClick(e)} style={style}>PLAY {((showResults) ? 'AGAIN' : 'GAME')}</button>
          <img id="stars" src={stars} alt="Stars" />
          <img id="computer" src={computer} alt="Computer" />
          <img id="computer-stars" src={computerStars} alt="Computer Stars" />
        </div>
      </GameTransition>
    );
  }
}

export default MatchSplash;