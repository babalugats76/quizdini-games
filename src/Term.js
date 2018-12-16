import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const termSource = {

  beginDrag(props) {
    console.log('begin drag...');
    return { ...props };
  },

  endDrag(props, monitor) {
    console.log('end drag...');
    if (monitor.didDrop()) { 
      return props.onDrop(monitor.getDropResult());
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

class Term extends Component {
  render() {
    // eslint-disable-next-line
    const { isDragging, connectDragSource, id, term, show, color, style} = this.props;
    let parentClasses = ['term', 'text-center'];
    // eslint-disable-next-line
    const parentClassString = parentClasses.concat(...(isDragging ? ['dragging'] : []), ((!show) ? ['exiting'] : []) , color).join(' ');
    // eslint-disable-next-line
  
    return connectDragSource(
      <div style={style} className={parentClassString}>
        <div className="term-text">{term}</div>
      </div>
    );
  }
}

export default DragSource("Match", termSource, collect)(Term);