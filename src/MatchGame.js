import React, { Component } from 'react';
import axios from 'axios';
import { DragDropContext } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'; // or any other pipeline
import {Preview} from 'react-dnd-multi-backend';
import shortid from 'shortid';
import { shuffleArray } from './utilities.js';
import MatchSplash from './MatchSplash';
import Timer from './Timer';
import MatchBoard from './MatchBoard';
import computer from './computer.svg';
import computerStars from './computer-stars.svg';
import logo from './logo.svg';
import './normalize.css';
import './match.scss';

const API = 'http://quizdini-poc.s3.amazonaws.com/match/';

class MatchGame extends Component {

  /**
   * Initialize component, setting default values, etc.
   * @param {Object} props - Properties passed to component
   */
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      topic: null,
      author: null,
      instructions: null,
      termsPerBoard: 9,
      duration: 60,
      loading: true,
      playing: false,
      showSplash: false,
      showBoard: false,
      showResults: false,
      matchDeck: [],
      termCount: null,
      matches: [],
      termOrder: [],
      definitionOrder: [],
      unmatched: 0,
      correct: 0,
      incorrect: 0,
      score: 0
    };
  }

  /**
   * Method called once in component lifecycle after all elements of the page have been rendered
   * Grab query args from router and asynchronously grab game data
   */
  componentDidMount() {
    const { id } = this.props.match.params;
    console.log('Attempting to fetch', id, '....');
    axios.get(API + id + '.json')
      .then((response) => {
        console.log('Status',response.status);
        console.log('Payload', response.data);
        return response.data; // pass payload to next function
      })
      .then((data) => {
        console.log('Processing payload and updating state');
        const { title, topic, author, instructions, matches } = data;
        const matchDeck = this.transformData(matches);
        this.setState((state, props) => {
          return { 
            title: title,
            topic: topic,
            author: author,
            instructions: instructions,
            matchDeck: matchDeck,
            termCount: matchDeck.length,
            loading: false,
            showSplash: true
          };
        });
      })
      .catch((error) => {
        console.log('Error Status', error.response.status || error.request.status);
        console.log('Error details', error.response || error.request);
      });
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
    const colors = ['red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'blue', 'purple', 'magenta', 'navy', 'gray', 'teal'];
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
    });
  }

  /**
   * Updates value of item in state
   * @param {string} property - State item to update
   * @param {any} value - New value to assign to state item
   */
  switch = (property, value) => {
    this.setState((state, props) => {
      return { [property] : value };
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

  /**
   * Shuffle the match deck
   * Picks subset of matches
   * Randomly assign color to each term
   * Shuffle terms and definitions, i.e., generate array of random indices
   * Calculates unmatched 
   * Update related state items
   */
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

  /**
   * Reset game state
   * Hides splash screen
   * Show game board 
   */
  handleGameStart = () => {
    console.log('Handling game start...');
    this.switch('correct', 0);
    this.switch('incorrect', 0);
    this.switch('score', 0);
    this.switch('showSplash', false);
    this.switch('showBoard', true);
  }

  /**
   * Chang
   */
  handleTimerStart = () => {
    console.log('Timer started...');
    this.switch('playing', true);
  }

  /**
   * 
   */
  handleTimerEnd = () => {
    console.log('Timer ended...');
    this.switch('playing', false);
    setTimeout(() => this.handleGameOver(), 2500);
  }

  /** 
   * Change state items used to: 
   * stop the game, show the splash screen, including final results
   */
  handleGameOver = () => {
    console.log('handling game over...');
    this.switch('showSplash', true);
    this.switch('showResults', true);
  }

   /**
    * Prepares new game round
    * Deal new set of matches
    * Show matches (initiates transitions)
    */
  handleRoundStart = () => {
    console.log('starting round...');
    this.dealMatches();
    this.showMatches(true);
  }
  
  /** 
   * Hide game board then show after brief timeout
   */
  nextRound = () => {
    this.switch('showBoard', false);
    setTimeout(() => this.switch('showBoard', true), 250);
  }

  /**
   * @param {string} type - Category of source/target, i.e., "Match"
   * @param {Object} item - Data related to, e.g., props, drag source (term)
   * @param {Object} style - Style properties (to assign to parent element)
   * 
   * Generate HTML and inline style related to terms 
   * Return null if game currently is not interactive, i.e., !playing
   */
  generatePreview = (type, item, style) => {
    const { playing } = this.state;
    const classes = ['term', 'preview', 'dragging'];
    const classesString = classes.concat(...(item.color ? [item.color] : [])).join(' ');
    return (<React.Fragment>
             { playing ? 
                     (<div style={style} className={classesString}>
                        <div className="term-text">{item.term}</div>
                      </div>)
             : (null)
              
            }
            </React.Fragment>);
  } 

  /**
   * When a Term component is dropped upon a Definition
   * If dropResult.matched, incrementcorrect; decrement unmatched
   * Otherwise, decrement incorrect
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
        incorrect += 1; score = Math.max(score - 1, 0);
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
    const { title, termCount, topic, author, instructions, playing, loading, showSplash, showBoard, showResults, duration, correct, incorrect, score, matches, termOrder, definitionOrder } = this.state;
    
    if (loading) {
      return (<div>Spinner goes here...</div>);
    }
    
    return (
        <React.Fragment>
          <div id="debug" style={{ position: 'fixed', top: '0', left: '0', color: 'white', zIndex: '1000'}}>{this.props.match.params.id}</div>
          <Preview generator={this.generatePreview} />
          { showSplash
          ? (<div id="splash-container" className="scroll-container triangle dark-lavender">
               <MatchSplash 
                 title={title}
                 termCount={termCount}
                 topic={topic}
                 author={author}
                 instructions={instructions}
                 wait={100} 
                 onGameStart={this.handleGameStart} 
                 showResults={showResults}
                 score={score} />
             </div>)
          : (<div id="match-container" className="page-container triangle dark-lavender">
               <div id="match-wrapper">
                 <MatchBoard
                   wait={500}
                   show={showBoard}
                   playing={playing}
                   matches={matches}
                   termOrder={termOrder}
                   definitionOrder={definitionOrder}
                   onDrop={(dropResult) => this.handleDrop(dropResult)}
                   onExited={(id) => this.handleExited(id)}
                   onRoundStart={this.handleRoundStart} />
                 <img id="game-logo" src={logo} alt="Quizdini Logo" />
                 <img id="game-computer-stars" src={computerStars} alt="Computer Stars" />
                 <img id="game-computer" src={computer} alt="Computer" />
                 <div id="game-title">{title}</div>
                 <Timer
                     correct={correct}
                     duration={duration} 
                     incorrect={incorrect}
                     score={score}
                     onTimerStart={this.handleTimerStart}
                     onTimerEnd={this.handleTimerEnd}
                     wait={500} />
               </div>    
             </div>)
          }
        </React.Fragment>
      );
  }
}

export default DragDropContext(MultiBackend(HTML5toTouch))(MatchGame);