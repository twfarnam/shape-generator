import React from 'react';

export default class Shape extends React.Component {


  constructor() {
    super();
    this.move = this.move.bind(this);
    this.moveEnd = this.moveEnd.bind(this);
    let height = 747;
    let width = 500;
    let r = 1.5;
    this.state = {
      side: 'left',
      height,
      width,
      points: [
        {x: r, y: r},
        {x: width - r, y: r},
        {x: width - r, y: height - r},
        {x: r, y: height - r},
      ]
    };
  }


  render() {
    return (
      <div
        ref={ el => this.el = el }
        className={ 'Shape' + (this.state.moving >= 0 ? ' moving' : '') }
        style={ {
          float: this.state.side,
          width: this.state.width,
          height: this.state.height,
        } } >

        <svg
          viewBox={
            `0 0 ${ this.state.width + 10 } ${ this.state.height + 10 }`
          }
          onMouseMove={ e => this.move(e) }
        >

          {
            this.state.points.map((p,i,points) => {
              let p2 = i === points.length - 1 ? points[0] : points[i+1];
              return (
                <g key={ p.x + '|' + p.y }>
                  <line
                    className="outline"
                    x1={ p.x } y1={ p.y } x2={ p2.x } y2={ p2.y }
                  />
                  <line 
                    className="handler"
                    x1={ p.x } y1={ p.y } x2={ p2.x } y2={ p2.y }
                    onMouseDown={ e => this.add(e, i) }
                  />
                </g>
              );
            })
          }

          { this.state.points.map((p,i) =>
            <g key={ p.x + '|' + p.y }>
              <circle
                className="point"
                cx={ p.x }
                cy={ p.y }
                r="3"
              />
              <circle
                className="handler"
                cx={ p.x }
                cy={ p.y }
                r="8"
                onDoubleClick={ e => this.remove(e,i) }
                onMouseDown={ e => this.moveStart(i) }
              />
            </g>)
          }
        </svg>

        <img src="/rabbit.jpg" />

        <div className="config">

          <button
            className={ this.state.side === 'left' ? ' on' : false }
            onClick={ e => this.setState({side: 'left'}) } >
            Left
          </button>
          {' '}
          <button
            className={ this.state.side === 'right' ? ' on' : false }
            onClick={ e => this.setState({side: 'right'}) } >
            Right
          </button>

          <pre className="output">
            <code>
              <span className="prop">shape-outside:</span>
              {' '}
              <span className="value">{ this.shape() }</span>
            </code>
          </pre>

        </div>

      </div>
    )
  }



  componentDidMount() {
    document.addEventListener('mousemove', this.move);
    document.addEventListener('mouseup', this.moveEnd);
  }


  componentWillUnmount() {
    document.removeEventListener('mousemove', this.move);
    document.removeEventListener('mouseup', this.moveEnd);
  }


  componentWillUpdate() {
    this.el.style.shapeOutside = this.shape();
  }


  shape() {
    let points = this.state.points.map(p => `${p.x}px ${p.y}px`).join(', ');
    return `polygon(${points})`;
  }


  moveStart(i) {
    this.setState({moving: i});
  }


  move(e) {
    if (this.state.moving >= 0) {
      e.preventDefault();
      let i = this.state.moving;
      let rect = this.el.getBoundingClientRect();
      let points = this.state.points.slice();
      points[i].x = clamp(e.clientX - rect.left, 0, this.state.width);
      points[i].y = clamp(e.clientY - rect.top, 0, this.state.height);
      this.setState({points});
    }
  }


  moveEnd() {
    this.setState({moving: undefined});
  }


  add(e, i) {
    let points = this.state.points.slice();
    let rect = this.el.getBoundingClientRect();
    let x = e.clientX - rect.left + 5;
    let y = e.clientY - rect.top + 5;
    points.splice(i+1, 0, {x, y});
    this.setState({points, moving: i+1});
  }


  remove(e, i) {
    e.preventDefault();
    window.getSelection().removeAllRanges();
    if (this.state.points.length <= 3)
      return;
    let points = this.state.points.slice();
    points.splice(i, 1);
    this.setState({points});
  }

}


function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}


