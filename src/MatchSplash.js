import React, { Component } from 'react';
// eslint-disable-next-line
import badge from './badge.svg';
import logo from './logo.svg';
import GameTransition from './GameTransition';

class MatchSplash extends Component {

  constructor(props) {
    super(props);
    this.state = ({ show: false });
  }

  componentDidMount() {
    console.log('component mounted...');
    setTimeout(() => this.toggleShow(), this.props.wait);
  }

  toggleShow = () => {
    this.setState({
      show: !this.state.show
    })
  }

  handleClick = (e) => {
    console.log('handling click...')
    e.preventDefault();
    this.toggleShow();
  }

  handleExit = () => {
    console.log('handling exit...');
    this.props.onGameStart();
  }

  render() {

    /* Dynamically determine enter/exit transition times, i.e., achieve brick-laying effect */
    const timeout = {
      enter: 500,
      exit: 500
    };

    /* Define object for the following states: 'default', 'entering', 'entered', 'exiting', 'exited' */
    const transitionStyles = {
      default: { opacity: 0 },
      entering: { opacity: 0 },
      entered: { transition: `opacity ${timeout.enter}ms ease-in-out`, opacity: 1.0 },
      exiting: { transition: `opacity ${timeout.exit}ms ease-in-out`, opacity: 0.1 },
      exited: { opacity: 0 }
    };

    return (<GameTransition
      in={this.state.show}
      timeout={timeout}
      transitionStyles={transitionStyles}
      onExited={this.handleExit}
    >
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