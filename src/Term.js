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
    const { isDragging, connectDragSource, id, term, style } = this.props;
    let classes = ['term', 'text-center', 'my-2', 'mx-2', 'mr-md-4', 'ml-md-0', 'py-2', 'px-2', 'px-md-4', 'px-lg-5'];
    // eslint-disable-next-line
    const classString = classes.concat(...(isDragging ? [' dragging'] : [])).join(' ');
    // eslint-disable-next-line
  
    return connectDragSource(
      <div style={style} className={classString}>
        {term}
      </div>
    );
  }
}

export default DragSource("Match", termSource, collect)(Term);