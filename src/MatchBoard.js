import React, { Component } from 'react';

import GameTransition from './GameTransition';

import Definition from './Definition';
import Term from './Term';

class MatchBoard extends Component {

  /*componentDidMount() {
    setTimeout(() => this.props.onRoundStart(), this.props.wait);
  } */

  renderTerms(termOrder, matches) {
    
    return termOrder.map((matchIdx, idx) => {

      const match = matches[matchIdx];

      /* Dynamically determine enter/exit transition times, i.e., achieve brick-laying effect */
      const timeout = {
        enter: (idx * (this.props.wait / 5 )),
        exit: this.props.wait
      };

      /* Define object for the following states: 'default', 'entering', 'entered', 'exiting', 'exited' */
      const transitionStyles = {
        default: { opacity: 0, visibility: 'hidden' },
        entering: { opacity: 0, visibility: 'hidden' },
        entered: { transition: `visibility 0ms linear ${timeout.enter}ms, opacity ${timeout.enter}ms linear`, opacity: 1.0, visibility: 'visible' },
        exiting: { transition: `opacity ${timeout.exit}ms ease-in-out`, opacity: 1.0, visibility: 'visible' },
        exited: { opacity: 0, 'color': '#FFFFFF', 'borderColor': '#FFFFFF' }
      };

      /* Return the terms, wrapped in transitions */
      return (
        <GameTransition
          mountOnEnter={true}
          unmountOnExit={false}
          appear={true}
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
            matched={match.matched}
            onDrop={this.props.onDrop} />
        </GameTransition>);
    });
  }

  renderDefinitions(definitionOrder, matches) {

    return definitionOrder.map((matchIdx, idx) => {

      const match = matches[matchIdx];

      /* Set transition times */
      const timeout = {
        enter: (matches.length * this.props.wait / 5),
        exit: this.props.wait
      };

      /* Define object for the following states: 'default', 'entering', 'entered', 'exiting', 'exited' */
      const transitionStyles = {
        default: { opacity: 0 },
        entering: { opacity: 0 },
        entered: { transition: `opacity ${timeout.enter}ms cubic-bezier(1,.01,.7,.84)`, opacity: 1.0, visibility: 'visible'},
        exiting: { transition: `opacity ${timeout.exit}ms ease-in-out`, opacity: 1.0, visibility: 'visible'},
        exited: { opacity: 0, 'color': '#FFFFFF', 'borderColor': '#FFFFFF'}
      };

      /* Return the terms, wrapped in transitions */
      return (
        <GameTransition 
          mountOnEnter={true}
          unmountOnExit={false}
          appear={true}
          key={match.id} 
          in={match.show} 
          timeout={timeout} 
          transitionStyles={transitionStyles}
          >
            <Definition 
              id={match.id} 
              definition={match.definition} 
              term={match.term}
              show={match.show}
              matched={match.matched}>
            </Definition>
        </GameTransition>);
    });
  }

  render() {

    // eslint-disable-next-line
    const { style, show, matches, termOrder, definitionOrder, onRoundStart } = this.props;
    const terms = this.renderTerms(termOrder, matches);
    const definitions = this.renderDefinitions(definitionOrder, matches);

    /* Transition timeouts */
    const timeout = {
      enter: this.props.wait / 10,
      exit: this.props.wait / 10
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
              mountOnEnter={false}
              unmountOnExit={true}
              appear={true}
              in={show}
              timeout={timeout}
              transitionStyles={transitionStyles}
              onEnter={onRoundStart}>
                <div id="match-board">
                  <div id="term-container">{terms}</div>
                  <div id="definition-container">{definitions}</div>
                </div>
            </GameTransition>);
  }

}

export default MatchBoard;