import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'; // or any other pipeline
import {generatePreview} from './Term';
import {Preview} from 'react-dnd-multi-backend';
import shortid from 'shortid';

import { shuffleArray } from './utilities.js';
import data from './match2.json';
import './match.scss';

import MatchSplash from './MatchSplash';
import Scoreboard from './Scoreboard';
import MatchBoard from './MatchBoard';

class MatchGame extends Component {

  /**
   * Initialize component, setting default values, etc.
   * @param {Object} props - Properties passed to component
   */
  constructor(props) {
    super(props);
    let matchDeck = this.transformData(data.matches);
    const {title, topic, author, instructions} = data;
    this.state = {
      title: title,
      topic: topic,
      author: author,
      instructions: instructions,
      termsPerBoard: 9,
      duration: 600,
      playing: false,
      showSplash: true,
      showBoard: true,
      showScore: true,
      matchDeck: matchDeck,
      matches: [],
      termOrder: [],
      definitionOrder: [],
      unmatched: 0,
      score: 0,
      correct: 0,
      incorrect: 0
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
        show: false,
        ...match.definition && { matched: false }
      }
    })
  }

  /**
   * Assign random application color to each match
   * @param {Array} matches - Array of match objects to assign color
   */
  addColor(matches) {
    const colors = ['red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'blue', 'purple', 'magenta', 'gray', 'navy', 'teal'];
    return matches.map((match) => {
      return { ...match, color: colors[Math.floor(Math.random() * (colors.length))] }
    });
  }

  /**
   * Get key (index) of each match and shuffle
   * Used in randomizing display of terms
   * @param {Array} matches 
   */
  getTermOrder = (matches) => {
    return shuffleArray([...matches.keys()]);
  }

  /**
   * Get key (index) of each match, filter out dummy terms, and shuffle
   * Used in randomizing display of definitions
   * @param {Array} matches 
   */
  getDefinitionOrder = (matches) => {
    // Add index to each item (order); filter out non-matches, i.e., match.definition; limit to order and shuffle
    return shuffleArray(matches.map((match, index) => { return { definition: match.definition, order: index } })
                               .filter((match) => { return match.definition })
                               .map((match) => { return match.order }));
  }

  /**
   * Toggles boolean state properties
   * @param {string} property - Property in the state object to toggle
   */
  toggle = (property) => {
    this.setState((state, props) => {
      return { [property] : !state[property]};
    })
  }

  /**
   * Updates value of item in state
   * @param {string} property - State item to update
   * @param {any} value - New value to assign to state item
   */
  switch = (property, value) => {
    this.setState((state, props) => {
      return { [property] : value };
    })
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
   * Updates state of matched term/definition combo
   * For matched id:
   *   Set show to false, triggering transition
   *   Set matched to true, facilitates exiting styling, etc.
   * @param {string} id - Match id that 
   */
  handleMatched = (id) => {
    this.setState((state, props) => {
      const matches = state.matches.map((match) => {
        if (match.id === id) {
          match.show = false;
          match.matched = true;
        }
        return match;
      })
      return { matches }
    });
  }

  /* Shuffles the match deck, picks subset, calculates unmatched */
  dealMatches = () => {
    this.setState((state, props) => {
      const matchDeck = shuffleArray(state.matchDeck);
      let matches = matchDeck.slice(0, Math.min(state.termsPerBoard, matchDeck.length));
      matches = this.addColor(matches);
      const termOrder = this.getTermOrder(matches);
      const definitionOrder = this.getDefinitionOrder(matches);
      const unmatched = definitionOrder.length;
      return { matchDeck, matches, termOrder, definitionOrder, unmatched };
    })
  }

  /* Hides splash screen and shows the game board */
  handleGameStart = () => {
    this.switch('showSplash', false);
    this.switch('playing', true);
    /*this.switch('showBoard', true); */
  }

  /* When timer runs out */
  handleGameOver = () => {
    this.switch('playing', false);
    this.switch('showSplash', true);
  }

   /* Prepares new game round */
  handleRoundStart = () => {
    console.log('starting round..')
    this.dealMatches();
    this.showMatches(true);
  }
  
  /* Starts a new round; after brief timeout */
  nextRound = () => {
    this.switch('showBoard', false);
    setTimeout(() => this.switch('showBoard', true), 250);
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

    if (dropResult.matched) this.handleMatched(dropResult.id);
    if (unmatched < 1) this.showMatches(false);
  }

  /**
   * Removes id from matches
   * Recreate shuffled arrays specifying the rendor order of terms and defs
   * If board has been cleared, start next round, i.e., nextRound()
   * @param {string} id - Match id to remove from matches
   */
  handleExited = (id) => {
    const matches = this.state.matches.filter((match) => { return match.id !== id; });
    const termOrder = this.getTermOrder(matches);
    const definitionOrder = this.getDefinitionOrder(matches);
    this.setState({ matches, termOrder, definitionOrder });
    // If all data has been removed, proceed to next round 
    if (matches.length === 0) return this.nextRound();
  }

  /* Conditionally render splash, scoreboard, and game board */
  render() {
    const { title, topic, author, instructions, playing, showSplash, showScore, showBoard, duration, score, correct, incorrect, matches, termOrder, definitionOrder } = this.state;
    return (
      showSplash
        ? (<div id="splash-container" class="page-container">
              <MatchSplash 
                title={title}
                topic={topic}
                author={author}
                instructions={instructions}
                wait={250} 
                onGameStart={this.handleGameStart} />
           </div>)
        : (<div id="match-container" class="page-container">
             <Preview generator={generatePreview} />
             {playing && (<Scoreboard 
                              wait={500}
                              show={showScore}
                              duration={duration} 
                              score={score} 
                              correct={correct} 
                              incorrect={incorrect}
                              onGameOver={this.handleGameOver} />)
             }
             {playing && (<MatchBoard
                              wait={500}
                              show={showBoard}
                              matches={matches}
                              termOrder={termOrder}
                              definitionOrder={definitionOrder}
                              onDrop={(dropResult) => this.handleDrop(dropResult)}
                              onExited={(id) => this.handleExited(id)}
                              onRoundStart={this.handleRoundStart} />)
             }
           </div>)
    );
  }
}

export default DragDropContext(MultiBackend(HTML5toTouch))(MatchGame);