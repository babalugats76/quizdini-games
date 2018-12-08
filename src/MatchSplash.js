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
              in={this.state.show}
              timeout={timeout}
              transitionStyles={transitionStyles}
              onExited={this.handleExited}>
              <div id="splash" className="py-5 fluid-container" style={this.props.style}>
                <div id="badge-logo" className="mx-auto">
                  <a href="/" onClick={(e) => this.handleClick(e)}>
                    <img className="img-fluid" id="badge" src={badge} alt="Quizdini badge" />
                    <img className="img-fluid" id="logo" src={logo} alt="Quizdini logo" />
                  </a>
                </div>
              </div>
            </GameTransition>);
  }
}

export default MatchSplash;