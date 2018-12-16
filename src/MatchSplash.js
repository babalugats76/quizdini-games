import React, { Component } from 'react';
import badge from './badge.svg';
import logo from './logo.svg';
import GameTransition from './GameTransition';

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

    const { style, title, topic, author, instructions } = this.props;
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
      entered: { transition: `opacity ${timeout.enter}ms ease-in-out`, opacity: 1.0 },
      exiting: { transition: `opacity ${timeout.exit}ms ease-in-out`, opacity: 0.1 },
      exited: { opacity: 0 }
    };

    /* Render splash screen, wrapped in a transition */
    return (<GameTransition
      in={show}
      timeout={timeout}
      transitionStyles={transitionStyles}
      onExited={this.handleExited}>
      <div id="splash-container" className="container d-flex flex-row justify-content-center align-content-center mx-auto" style={style}>
        <section id="splash" className="fluid-container align-self-center mt-3">
          <div id="badge-logo" className="mx-auto">
            <a href="/" onClick={(e) => this.handleClick(e)} title="Click to Learn!">
              <img className="img-fluid spin-scale" id="badge" src={badge} alt="Quizdini badge" />
              <img className="img-fluid scale" id="logo" src={logo} alt="Quizdini logo" />
            </a>
          </div>
          <div id="match-details" className="py-1 px-3 pt-md-2 pb-md-4 px-md-5 text-center mx-auto">
            <div id="match-title" className="game-title h2">{title}</div>
            <div id="match-topic-author" className="h5">
              <span id="match-topic" className="game-topic">{topic}</span>
              <span id="match-author" className="game-author">{author}</span>
            </div>
            <div id="match-instructions" className="game-instructions">{instructions}</div>
          </div>
        </section>
      </div>
    </GameTransition>);
  }
}

export default MatchSplash;