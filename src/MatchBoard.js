import React, { Component } from 'react';

//import { shuffleArray } from './utilities.js';
import GameTransition from './GameTransition';
import Term from './Term';
import Definition from './Definition';

class MatchBoard extends Component {

  componentDidMount() {
    setTimeout(() => this.props.onRoundStart(), this.props.wait);
  }

  renderTerms(termOrder, matches) {
    
    return termOrder.map((matchIdx, idx) => {

      const match = matches[matchIdx];

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
        exiting: { transition: `opacity ${timeout.exit}ms ease-in-out`, opacity: 1.0, visibility: 'visible', 'backgroundColor': '#FFFFFF', 'borderColor': '#1FE73F', 'color': '#1FE73F' },
        exited: { opacity: 0, 'color': '#FFFFFF', 'borderColor': '#FFFFFF' }
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

  renderDefinitions(definitionOrder, matches) {

    return definitionOrder.map((matchIdx, idx) => {

      const match = matches[matchIdx];

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
        exiting: { transition: `opacity ${timeout.exit}ms ease-in-out`, opacity: 1.0, visibility: 'visible', 'backgroundColor': '#FFFFFF', 'borderColor': '#1FE73F', 'color': '#1FE73F' },
        exited: { opacity: 0, 'color': '#FFFFFF', 'borderColor': '#FFFFFF' }
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

    const { matches, termOrder, definitionOrder } = this.props;
    const terms = this.renderTerms(termOrder, matches);
    const definitions = this.renderDefinitions(definitionOrder, matches);

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