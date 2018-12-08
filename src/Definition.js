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
  render() {
    // eslint-disable-next-line
    const { isOver, canDrop, connectDropTarget, id, term, definition, style } = this.props;
    let classes = ['definition', 'd-flex', 'text-center', 'justify-content-center', 'align-items-center', 'col-md-4', 'col-lg-3', 'p-1', 'm-1', 'p-md-2', 'm-md-2'];
    const classString = classes.concat(...((isOver && canDrop) ? [' is-over'] : [])).join(' ');

    return connectDropTarget(
      <div style={style} className={classString}>
        {definition}
      </div>
    );
  }
}

export default DropTarget("Match", definitionTarget, collect)(Definition);