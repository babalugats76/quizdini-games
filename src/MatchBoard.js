import React, { Component } from 'react';

import { shuffle } from './utilities.js';
import GameTransition from './GameTransition';
import Term from './Term';
import Definition from './Definition';

class MatchBoard extends Component {

  componentDidMount() {
    setTimeout(() => this.props.onRoundStart(), this.props.wait);
  }

  renderTerms(matches) {

    return matches.map((match, idx) => {

      /* Dynamically determine enter/exit transition times, i.e., achieve brick-laying effect */
      const timeout = {
        enter: (idx * (this.props.wait/5)),
        exit: 1500
      };

      /* Define object for the following states: 'default', 'entering', 'entered', 'exiting', 'exited' */
      const transitionStyles = {
        default: { opacity: 0, visibility: 'hidden' },
        entering: { opacity: 0, visibility: 'hidden' },
        entered: { transition: `visibility 0ms linear ${timeout.enter}ms, opacity ${timeout.enter}ms linear`, opacity: 1.0, visibility: 'visible' },
        exiting: { transition: `opacity ${timeout.exit}ms ease-in-out`, opacity: 1.0, visibility: 'visible', 'background-color': '#FFFFFF', 'border-color': '#1FE73F', 'color': '#1FE73F' },
        exited: { opacity: 0, 'color': '#FFFFFF', 'border-color': '#FFFFFF' }
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
          <Term 
            id={match.id} 
            color={match.color}
            term={match.term} 
            show={match.show}
            onDrop={this.props.onDrop} />
        </GameTransition>);
    });
  }

  renderDefinitions(matches) {

    /* Filter out non-matching terms by using .filter() */
    return shuffle(matches).filter((match, idx) => { return match.definition }).map((match, idx) => {

      /* Set transition times */
      const timeout = {
        enter: (matches.length * (this.props.wait/5)),
        exit: 1500
      };

      /* Define object for the following states: 'default', 'entering', 'entered', 'exiting', 'exited' */
      const transitionStyles = {
        default: { opacity: 0 },
        entering: { opacity: 0 },
        entered: { transition: `opacity ${timeout.enter}ms cubic-bezier(1,.01,.7,.84)`, opacity: 1.0, visibility: 'visible'},
        exiting: { transition: `opacity ${timeout.exit}ms ease-in-out`, opacity: 1.0, visibility: 'visible',  'background-color': '#FFFFFF', 'border-color': '#1FE73F', 'color': '#1FE73F' },
        exited: { opacity: 0, 'color': '#FFFFFF', 'border-color': '#FFFFFF' }
      };

      /* Return the terms, wrapped in transitions */
      return (
        <GameTransition 
          key={match.id} 
          in={match.show} 
          timeout={timeout} 
          transitionStyles={transitionStyles}
          >
            <Definition 
              id={match.id} 
              definition={match.definition} 
              term={match.term}
              show={match.show}>
            </Definition>
        </GameTransition>);
    });
  }

  render() {

    const { matches } = this.props;
    const terms = this.renderTerms(matches);
    const definitions = this.renderDefinitions(matches);

    return (
      <div id="match-board">
        <div id="term-container">
          {terms}
        </div>
        <div id="definition-container">
          {definitions}
        </div>
      </div>);
  }

}

export default MatchBoard;