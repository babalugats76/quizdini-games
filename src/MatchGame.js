import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'; // or any other pipeline
import shortid from 'shortid';
import data from './match2.json';
import './match.scss';

import MatchBoard from './MatchBoard';
import MatchSplash from './MatchSplash';

class MatchGame extends Component {

  constructor(props) {
   
    super(props);
   
    let matchDeck = this.transformData(data.matches);

    this.state = {
      termsPerBoard: 5,
      playing: false,
      matchDeck: matchDeck,
      matches: [],
      unmatched: 0,
      score: 0,
      elapsedTime: 0,
      totalTime: 0
    };
  }

  shuffle(array) {
    console.log('shuffling...');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  transformData(matches) {
    return matches.map((match) => {
      return {
        ...match,
        id: shortid.generate(),
        show: false,
        correct: 0,
        incorrect: 0
      }
    })
  }

  togglePlaying = () => {
    this.setState({ playing: !this.state.playing });
  }

  dealMatches = () => {
    console.log('dealing...')
    const matchDeck = this.shuffle(this.state.matchDeck);
    const matches = matchDeck.slice(0, Math.min(this.state.termsPerBoard, matchDeck.length));
    const unmatched = matches.reduce((total, match) => { return (match.definition ? total + 1 : total) }, 0);

    this.setState({
      matchDeck: matchDeck,
      matches: matches,
      unmatched: unmatched
    });
  }

  toggleMatches = () => {
    console.log('toggling matches...which begins game');
    const matches = this.state.matches.map((match) => { match.show = !match.show; return match; })
    this.setState({
      matches: matches
    });
  }

  toggleMatch = (id) => {
    console.log('toggling match with id', id);
    const matches = this.state.matches.map((match) => {
      if (match.id === id) {
        match.show = !match.show
      };
      return match;
    })
    this.setState({ matches: matches })
  }

  handleGameStart = () => {
    console.log('handle game start fired');
    this.togglePlaying();
  }

  nextRound = () => {
    this.dealMatches();
    this.toggleMatches();
  }

  handleDrop = (props, dropResult) => {
    console.log('handle drop called');
    console.log('matched:', dropResult.matched)
    if (dropResult.matched) {
      return this.toggleMatch(dropResult.id);
    }
  }

  /**
   * Applies to descriptions exiting only
   * This is because we support non-matching terms
   */
  handleExited = (id) => {
    console.log('removing..', id);
    const matches = this.state.matches.filter((match) => { return match.id !== id; });
    const unmatched = this.state.unmatched - 1;
    const score = this.state.score + 1;
    this.setState({ matches: matches, 
                    unmatched: unmatched, 
                    score: score });
    console.log('There are', unmatched, 'unmatched terms');
    console.log('The new score is', score);
    if(unmatched < 1) {
       this.nextRound();
    }
  }

  renderGame() {
    return (<div id="match-game">
      <div id="scoreboard" className="fixed-top"></div>
      <MatchBoard
        wait={1000}
        matches={this.state.matches}
        onDrop={(props, dropResult) => this.handleDrop(props, dropResult)}
        onExited={(id) => this.handleExited(id)}
        onGameStart={this.toggleMatches} />
    </div>);
  }

  renderSplash() {
    return (<MatchSplash wait={1000} onGameStart={this.handleGameStart} />);
  }

  render() {
    if (this.state.playing) {
      return (this.renderGame());
    } else {
      return (this.renderSplash());
    }
  }
}

export default DragDropContext(MultiBackend(HTML5toTouch))(MatchGame);