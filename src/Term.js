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

export function generatePreview (type, item, style) {
  const classes = ['term', 'text-center', 'dragging'];
  const classesString = classes.concat(...(item.color ? [item.color] : [])).join(' ');
  return (<div style={style} className={classesString}>
            <div className="term-text">{item.term}</div>
          </div>);
} 

class Term extends Component {

  render() {
    // eslint-disable-next-line
    const { isDragging, connectDragSource, id, term, show, matched, color, style} = this.props;
    let classes = ['term', 'text-center'];
    // eslint-disable-next-line
    const classesString = classes.concat(...(isDragging ? ['dragging'] : []), ((!show) ? ['exiting'] : []), ((matched) ? ['matched'] : []), color).join(' ');
    // eslint-disable-next-line
  
    return connectDragSource(
      <div style={style} className={classesString}>
        <div className="term-text">{term}</div>
      </div>
    );
  }
}

export default DragSource("Match", termSource, collect)(Term);