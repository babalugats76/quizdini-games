import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

const definitionTarget = {
  drop(props, monitor, component) {
    console.log('drop...');
    const item = monitor.getItem();
    const matched = ((item.term === props.term) ? true : false);
    return { matched: matched, id: item.id, term: item.term, definition: props.definition };
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  }
}

class Definition extends Component {

  constructor(props) {
    super(props);
    this.state = ({
       expand: false
    })
  }

  handleMouseEnterLeave = (e, expand) => {
    e.preventDefault();
    this.setState((state, props) => {
      return { expand: expand }
    });
  }

  handleTouchEnd = (e) => {
    e.preventDefault();
    this.setState((state, props) => {
      return { expand: !state.expand }
    });
  }

  render() {
    // eslint-disable-next-line
    const { isOver, canDrop, connectDropTarget, id, term, definition, show, matched, style } = this.props;
    const { expand } = this.state;
    let parentClasses = ['definition', 'text-center'];
    const parentClassString = parentClasses.concat(...((isOver && canDrop) ? ['is-over'] : []), ((expand) ? ['expand']: []), ((!show) ? ['exiting'] : []), ((matched) ? ['matched'] : [])).join(' ');
    let childClasses = ['definition-text'];
    //const childClassString = childClasses.concat(...((expand) ? ['expand']: [])).join(' ');
    const childClassString = childClasses.join(' ');

    return connectDropTarget(
      <div style={style} 
           className={parentClassString}
           onMouseEnter={(e) => this.handleMouseEnterLeave(e, true)}
           onMouseLeave={(e) => this.handleMouseEnterLeave(e, false)}
           onTouchEnd={(e) => this.handleTouchEnd(e)}
      >

        <div className={childClassString}
        >{definition}</div>
      </div>
    );
  }
}

export default DropTarget("Match", definitionTarget, collect)(Definition);