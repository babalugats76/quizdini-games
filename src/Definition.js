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

  toggleExpand = () => {
    this.setState((state, props) => {
      return { expand: !state.expand }
    });
  }


  render() {
    // eslint-disable-next-line
    const { isOver, canDrop, connectDropTarget, id, term, definition, show, style } = this.props;
    const { expand } = this.state;
    let parentClasses = ['definition', 'text-center'];
    //let parentClasses = ['definition', 'text-center', 'd-flex', 'flex-fill', 'p-1', 'm-1', 'p-md-2'];
    const parentClassString = parentClasses.concat(...((isOver && canDrop) ? ['is-over'] : []), ((!show) ? ['exiting'] : [])).join(' ');

    let childClasses = ['definition-text'];

    const childClassString = childClasses.concat(...((expand) ? ['expand']: []), ).join(' ');

    return connectDropTarget(
      <div style={style} className={parentClassString}>
        <div 
          className={childClassString} 
          onClick={this.toggleExpand} 
          onMouseEnter={this.toggleExpand} 
          onMouseLeave={this.toggleExpand}>
            {definition}
        </div>
      </div>
    );
  }
}

export default DropTarget("Match", definitionTarget, collect)(Definition);