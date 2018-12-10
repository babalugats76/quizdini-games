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
    /**
     * Wrap splash in a #splash container to preserve background color, etc.
     * Make sure it gets style prop
     * Move splash to a div with the padding, etc.
     * Perhaps turn into jumbotron? Fluid jumbotron?
     */
    return (<GameTransition
              in={show}
              timeout={timeout}
              transitionStyles={transitionStyles}
              onExited={this.handleExited}>
              <div id="splash" className="fluid-container col-12 col-md-6 offset-md-3 d-flex flex-column align-items-start py-5" style={style}>
                <div id="badge-logo" className="mx-auto text-center jumbotron-fluid">
                  <a href="/" onClick={(e) => this.handleClick(e)} title="Click to Learn!">
                    <img className="img-fluid spin-scale" id="badge" src={badge} alt="Quizdini badge" />
                    <img className="img-fluid scale" id="logo" src={logo} alt="Quizdini logo" />
                  </a>
                </div>
                <div id="match-details">
                  <div id="match-title" className="game-title-topic">{title} {topic}</div>
                  <div id="match-author" className="game-author">{author}</div>
                  <div id="match-instructions" className="game-instructions">{instructions}</div>
                </div>
              </div>
            </GameTransition>);
  }
}

export default MatchSplash;