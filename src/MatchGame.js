import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'; // or any other pipeline
import shortid from 'shortid';

import { shuffle } from './utilities.js';
import data from './match2.json';
import './match.scss';

import MatchBoard from './MatchBoard';
import MatchSplash from './MatchSplash';

class MatchGame extends Component {

  /**
   * Initialize component, setting default values, etc.
   * @param {Object} props - Properties passed to component
   */
  constructor(props) {
    super(props);
    let matchDeck = this.transformData(data.matches);
    this.state = {
      termsPerBoard: 30,
      showSplash: true,
      showBoard: false,
      matchDeck: matchDeck,
      matches: [],
      unmatched: 0,
      score: 0,
      correct: 0,
      incorrect: 0,
      elapsedTime: 0,
      totalTime: 0
    };
  }

  /**
   * Augments each object within additional info (needed by game)
   * @param {Array} matches - Array of match objects to augment
   */
  transformData(matches) {
    return matches.map((match) => {
      return {
        ...match,
        id: shortid.generate(),
        show: false
      }
    })
  }

  /**
   * Shows or hides splash screen
   * @param {bool} show - Whether to show splash
   */
  showSplash = (show) => {
    this.setState((state, props) => {
      return { showSplash: show }
    });
  }

  /**
   * Shows or hides game board
   * @param {bool} show - Whether to show board
   */
  showBoard = (show) => {
    this.setState((state, props) => {
      return { showBoard: show }
    });
  }

  /**
   * Shows or hides all match objects, triggering transitions
   * @param {bool} show - Whether to show matches
   */
  showMatches = (show) => {
    this.setState((state, props) => {
      const matches = state.matches.map((match) => { match.show = show; return match; })
      return { matches };
    });
  }

  /**
   * Toggles, i.e., shows/hides match, triggering transitions
   * @param {string} id - Match id to toggle visibility
   */
  toggleMatch = (id) => {
    const matches = this.state.matches.map((match) => {
      if (match.id === id) match.show = !match.show
      return match;
    })
    this.setState({ matches })
  }

  /* Shuffles the match deck, picks subset, calculates unmatched */
  dealMatches = () => {
    this.setState((state, props) => {
      const matchDeck = shuffle(state.matchDeck);
      const matches = matchDeck.slice(0, Math.min(state.termsPerBoard, matchDeck.length));
      const unmatched = matches.reduce((total, match) => { return (match.definition ? total + 1 : total) }, 0);
      return { matchDeck, matches, unmatched };
    })
  }

  /* Hides splash screen and shows the game board */
  handleGameStart = () => {
    this.showSplash(false);
    this.showBoard(true);
  }

  /* Begins the round */
  handleRoundStart = () => { this.beginRound(); }

  /* Prepares new game round */
  beginRound = () => {
    this.dealMatches();
    this.showMatches(true);
  }

  /* Starts a new round; after brief timeout */
  nextRound = () => {
    this.showBoard(false);
    setTimeout(() => this.showBoard(true), 250);
  }

  /**
   * When a Term component is dropped upon a Definition
   * If dropResult.matched, increment score, correct; decrement unmatched
   * Otherwise, decrement increment
   * 
   * @param {object} dropResult - Results of drag-and-drop operation
   */
  handleDrop = (dropResult) => {
    
    let unmatched; // needed beyond state settings
    
    this.setState((state, props) => {
      let { correct, incorrect, score } = state;
      unmatched = state.unmatched;
      if (dropResult.matched) {
        correct += 1; unmatched -= 1; score += 1;
      } else {
        incorrect += 1;
      }
      return { correct, incorrect, score, unmatched };
    });
   
    if (dropResult.matched) this.toggleMatch(dropResult.id);
    if (unmatched < 1) this.showMatches(false);
  }

  /**
   * Removes id from matches
   * If board has been cleared, start next round, i.e., nextRound()
   * @param {string} id - Match id to remove from matches
   */
  handleExited = (id) => {
    const matches = this.state.matches.filter((match) => { return match.id !== id; });
    this.setState({ matches });
    // If all data has been removed, proceed to next round 
    if (matches.length === 0) return this.nextRound();
  }

  /* Conditionally render splash, scoreboard, and game board */
  render() {
    const { showSplash, showBoard } = this.state;
    return (
      showSplash
        ? (<MatchSplash wait={500} onGameStart={this.handleGameStart} />)
        : (<div id="match-game">
            <div id="scoreboard" className="fixed-top"></div>
            {showBoard &&
              (<MatchBoard
                 wait={1000}
                 matches={this.state.matches}
                 onDrop={(dropResult) => this.handleDrop(dropResult)}
                 onExited={(id) => this.handleExited(id)}
                 onRoundStart={this.handleRoundStart} />)
            }
          </div>)
    ); 
  }
}

export default DragDropContext(MultiBackend(HTML5toTouch))(MatchGame);