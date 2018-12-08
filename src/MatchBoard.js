import React, { Component } from 'react';
import GameTransition from './GameTransition';
import Term from './Term';
import Definition from './Definition';

class MatchBoard extends Component {

  constructor(props) {
    super(props);
    console.log(props.matches);
  }

  componentDidMount() {
    console.log('component mounted...');
    setTimeout(() => this.props.onGameStart(), this.props.wait);
  }

  termEntered(term) {
    console.log(term + " entered");
  }

  termExited(term) {
    console.log(term + " exited!");
  }

  renderTerms(matches) {

    return matches.map((match, idx) => {

      /* Dynamically determine enter/exit transition times, i.e., achieve brick-laying effect */
      const timeout = {
        enter: (idx * 100),
        exit: 1000
      };

      /* Define object for the following states: 'default', 'entering', 'entered', 'exiting', 'exited' */
      const transitionStyles = {
        default: { opacity: 0, visibility: 'hidden' },
        entering: { opacity: 0, visibility: 'hidden' },
        entered: { transition: `visibility 0ms linear ${timeout.enter}ms, opacity ${timeout.enter}ms linear`, opacity: 1.0, visibility: 'visible' },
        exiting: { transition: `opacity ${timeout.exit}ms ease-in-out`, opacity: 0, visibility: 'visible' },
        exited: { opacity: 0, display: 'none'}
      };

      /* Return the terms, wrapped in transitions */
      return (
        <GameTransition
          key={match.id}
          in={match.show}
          timeout={timeout}
          transitionStyles={transitionStyles}
        >
          <Term id={match.id} term={match.term} onDrop={this.props.onDrop}></Term>
        </GameTransition>);
    });
  }

  renderDefinitions(matches) {

    /* Filter out non-matching terms by using .filter() */
    return matches.filter((match, idx) => { return match.definition }).map((match, idx) => {

      /* Set transition times */
      const timeout = {
        enter: (matches.length * 100),
        exit: 1000
      };

      /* Define object for the following states: 'default', 'entering', 'entered', 'exiting', 'exited' */
      const transitionStyles = {
        default: { opacity: 0 },
        entering: { opacity: 0 },
        entered: { transition: `opacity ${timeout.enter}ms cubic-bezier(1,.01,.7,.84)`, opacity: 1.0, visibility: 'visible'},
        exiting: { transition: `opacity ${timeout.exit}ms ease-in-out`, opacity: 0, visibility: 'visible' },
        exited: { opacity: 0, display: 'none'}
      };

      /* Return the terms, wrapped in transitions */
      return (
        <GameTransition 
          key={match.id} 
          in={match.show} 
          timeout={timeout} 
          transitionStyles={transitionStyles}
          onExited={(id) => this.props.onExited(match.id)}
          >
          <Definition 
           id={match.id} definition={match.definition} term={match.term}></Definition>
        </GameTransition>);
    });
  }

  render() {

    const { matches } = this.props;
    const terms = this.renderTerms(matches);
    const definitions = this.renderDefinitions(matches);

    return (
      <div id="match-board" className="fluid-container">
        <div id="term-container" className="d-flex flex-row flex-wrap justify-content-center align-content-center align-items-center mt-2 offset-md-1 col-md-10">
          {terms}
        </div>
        <div id="definition-container" className="d-flex flex-column flex-md-row flex-wrap flex-fill justify-content-center align-items-stretch mt-3 col-md-12">
          {definitions}
        </div>
      </div>);
  }

}

export default MatchBoard;