import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    let className = 'square';
    if (this.props.hilight) {
      className += ' square-hilight';
    }

    return (
      <button
        className={className}
        onClick={this.props.onClick}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        hilight={this.props.hilightLocations.includes(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(y) {
    let columns = [];
    for (let x = 0; x < 3; x++) {
      columns.push(
        this.renderSquare(y * 3 + x)
      );
    }
    return columns;
  }

  render() {
    let rows = [];
    for (let y = 0; y < 3; y++) {
      rows.push(
        <div key={y} className="board-row">
          {this.renderRow(y)}
        </div>
      );
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null,
      }],
      historyOrderDesc: false,
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const [winner,] = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  renderHistory() {
    let moves = this.state.history.map((step, idx) => {
      return ({
        step: step,
        stepNumber: idx,
      });
    });
    if (this.state.historyOrderDesc) {
      moves.reverse();
    }

    return moves.map((move) => {
      const step = move.step;
      const stepNumber = move.stepNumber;

      let desc = stepNumber ?
        `Go to move #${stepNumber} (${Math.trunc(step.location / 3)}, ${step.location % 3})` :
        'Go to game start';
      if (stepNumber === this.state.stepNumber) {
        desc = <b>{desc}</b>;
      }

      return (
        <li key={stepNumber}>
          <button onClick={() => this.jumpTo(stepNumber)}>{desc}</button>
        </li>
      );
    });
  }

  render() {
    const current = this.state.history[this.state.stepNumber];
    const [winner, line] = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      if (current.squares.every((s) => s !== null)) {
        status = 'Draw';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            hilightLocations={line}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.renderHistory()}</ol>
          <div>
            <button
              onClick={() => this.setState({historyOrderDesc: !this.state.historyOrderDesc})}
            >
              Reverse the history order
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return [null, []];
}
