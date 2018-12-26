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

  constructor(props) {
    super(props);
    this.state = ({
      expand: false
    });
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
    const { isDragging, connectDragSource, id, term, show, matched, color, style} = this.props;
    const { expand } = this.state;
    let parentClasses = ['term', 'text-center'];
    // eslint-disable-next-line
    const parentClassString = parentClasses.concat(...(isDragging ? ['dragging'] : []), ((!show) ? ['exiting'] : []), ((expand) ? ['expand']: []), ((matched) ? ['matched'] : []), color).join(' ');
    // eslint-disable-next-line
    let childClasses = ['term-text'];
    const childClassString = childClasses.join(' ');
  
    return connectDragSource(
      <div style={style} 
           className={parentClassString}
           onMouseEnter={(e) => this.handleMouseEnterLeave(e, true)}
           onMouseLeave={(e) => this.handleMouseEnterLeave(e, false)}
           onTouchEnd={(e) => this.handleTouchEnd(e)}>
        <div className={childClassString}>{term}</div>
      </div>
    );
  }
}

export default DragSource("Match", termSource, collect)(Term);