import React, { Component } from 'react';
import './App.css';

import DEFAULT_GRID from './assets/mocks/example.json';

const gridStatusCls = {
    0: 'dead',
    1: 'sad',
    2: 'happy'
};

const GridState = {
    DEAD: 0,
    SAD: 1,
    HAPPY: 2
}

interface state {
    hasStarted: boolean,
    grid: any
}

type GridStates = 0 | 1 | 2;

// TODO: Update later, now used another URL because the provided URL did not work
const URL: string = 'https://my-json-server.typicode.com/ricardoorellana/demo/data';

class App extends Component<{}, state> {

    intervalId: any = 0;
    rowLen: number = 0;
    columnLen: number = 0;
    defaultEmptyArray: any;

    constructor(props: {}) {
        super(props);

        this.state = {
            hasStarted: false,
            grid: []
        };

        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    componentDidMount() {
        this.initData();
    }

    initData() {
        fetch(URL)
        .then(response => response.json())
        .then(response => {

            const defaultGrid = DEFAULT_GRID.data.state;
            const grid = response.state || defaultGrid;

            this.setState({
                grid
            });

            this.defaultEmptyArray = this.create2dArray(grid);
        });
    }

    renderActionButton() {
        const buttonText = !this.state.hasStarted ? 'Start' : 'Pause';

        return <button className='actionButton' onClick={this.handleButtonClick}>{ buttonText }</button>;
    }

    create2dArray(grid: any) {
        const rows = grid.length;
        const columns = grid[0].length;

        return [...Array(rows).keys()].map(i => Array(columns).fill(0));
    }

    get defaultGrid() {
        // avoid to mutate the state
        return this.defaultEmptyArray;
    }

    handleButtonClick() {
        this.setState({
            hasStarted: !this.state.hasStarted
        });

        if (this.state.hasStarted) {
            clearInterval(this.intervalId);

            return;
        }

        this.intervalId = setInterval(() => {
            const grid = this.updateCells();

            this.setState({
                grid
            });
        }, 1000);
    }

    renderGrid() {
        if (!this.state.grid.length) {
            return;
        }

        const rowLen: number = this.state.grid.length;
        const colLen: number = this.state.grid[0].length;

        const trs = [];
 
        for (let i = 0; i < rowLen; i++) {
            const tds = [];

            for (let j = 0; j < colLen; j++) {
                const cellValue: GridStates = this.state.grid[i][j] as GridStates;
                const cellStatusCls = gridStatusCls[cellValue];

                const tdKey = `${i}-${j}`;
                tds.push(<td key={tdKey} className={cellStatusCls}>{ cellValue }</td>);
            }

            trs.push(<tr key={i}>{ tds }</tr>);
        }

        return (
            <table className='gridTable'>
                <tbody>
                    { trs }
                </tbody>
            </table>
        );
    }

    updateCells() {
        const rowLen: number = this.state.grid.length;
        const colLen: number = this.state.grid[0].length;

        const newGrid = this.defaultGrid;
 
        for (let i = 0; i < rowLen; i++) {
            for (let j = 0; j < colLen; j++) {
                const cellValue: GridStates = this.state.grid[i][j];
                const cellFrequencies = this.countNeighbours(i, j);

                newGrid[i][j] = this.statusToUpdate(cellValue, cellFrequencies);
            }
        }

        return newGrid;
    }

    countNeighbours(row: number, column: number): object {
        let cellFrequencies = {
            [0 as GridStates]: 0,
            [1 as GridStates]: 0,
            [2 as GridStates]: 0
        };

        // A cell might have 8 neighbors
        // top-left - top-center - top-right and so on
        const rowDirection = [-1, -1, -1, 0, 0, +1, +1, +1];
        const colDirection = [-1, 0, +1, -1, +1, -1, 0, +1];
        
        const directionsLen = 8;

        for (let i = 0; i < directionsLen; i++) {
            const currentRow = row + rowDirection[i];
            const currentColumn = column + colDirection[i];

            if (!this.state.grid[currentRow]) {
                continue;
            }

            cellFrequencies[this.state.grid[currentRow][currentColumn]]++;
        }

        return cellFrequencies;
    }

    statusToUpdate(cell: GridStates, cellFrequencies: any) {
        // - Any sad or happy cell with two or three sad or happy neighbours survives.
        if (cell === GridState.SAD || cell === GridState.HAPPY) {
            if (cellFrequencies[GridState.SAD] === 2 || cellFrequencies[GridState.SAD] === 3
            || cellFrequencies[GridState.HAPPY] === 2 || cellFrequencies[GridState.HAPPY] === 3) {
               return cell;
            }
        }

        if (cell === GridState.DEAD) {
            // - Any dead cell with exactly three sad neighbors becomes a sad cell.
            if (cellFrequencies[GridState.SAD] === 3) {
                return GridState.SAD;
            }

            // - Any dead cell with exactly two sad neighbors and 1 happy neighbor becomes a sad cell.
            if (cellFrequencies[GridState.SAD] === 2 && cellFrequencies[GridState.HAPPY] === 1) {
                return GridState.SAD;
            }

            // - Any dead cell with exactly one sad neighbor and 2 happy neighbors becomes a happy cell.
            if (cellFrequencies[GridState.SAD] === 1 && cellFrequencies[GridState.HAPPY] === 2) {
                return GridState.HAPPY;
            }

            // - Any dead cell with exactly 3 happy neighbors becomes a happy cell.
            if (cellFrequencies[GridState.HAPPY] === 3) {
                return GridState.HAPPY;
            }

        }

        // - All other cells become or remain dead. 
        return GridState.DEAD;
    }

    render() {
        return (
        <div className="App">
            { this.renderGrid() }
            { this.renderActionButton() }
        </div>
        );
    }
}

export default App;
