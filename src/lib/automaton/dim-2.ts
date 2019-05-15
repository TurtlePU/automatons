import { CellAutomaton, BaseGrid } from './base-class';

export class CellAutomaton2D<T> extends CellAutomaton<Position2D, T, Grid2D<T>> {}

export type Position2D = {
    i: number
    j: number
};

export class Grid2D<T> implements BaseGrid<Position2D, T> {
    protected grid: T[][];

    constructor(grid: T[][]) {
        this.grid = grid;
    }

    apply(callback: (key: Position2D) => T): void {
        this.grid = this.grid.map((row, i) => {
            return row.map((_, j) => callback({ i, j }));
        });
    }

    get data() {
        return this.grid.map(row => [...row]);
    }

    get(key: Position2D): T {
        return this.grid[key.i][key.j];
    }

    has(key: Position2D): boolean {
        let n = this.grid.length;
        let m = this.grid[0].length;
        let { i, j } = key;
        return 0 <= i && i < n && 0 <= j && j < m;
    }

    set(key: Position2D, value: T): void {
        this.grid[key.i][key.j] = value;
    }
}
