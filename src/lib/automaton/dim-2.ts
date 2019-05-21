import CellAutomaton from './base-class';

export class CellAutomaton2D<T> extends CellAutomaton<Position2D, T, T[][]> {
    get dims() {
        return [this._grid.length, this._grid[0].length];
    }
    
    get grid() {
        return this._grid.map(row => [...row]);
    }

    get(key: Position2D): T {
        return this._grid[key[0]][key[1]];
    }

    has(key: Position2D): boolean {
        let n = this._grid.length;
        let m = this._grid[0].length;
        let [i, j] = key;
        return 0 <= i && i < n && 0 <= j && j < m;
    }

    protected inner_set(key: [number, number], value: T): void {
        this._grid[key[0]][key[1]] = value;
    }

    protected inner_tick(rule: (key: [number, number]) => T): T[][] {
        let result = [];
        for (let i = 0; i != this._grid.length; ++i) {
            result[i] = [];
            for (let j = 0; j != this._grid[i].length; ++j) {
                result[i][j] = rule([i, j]);
            }
        }
        return result;
    }

    protected equal_to(grid: T[][]): boolean {
        if (this._grid == grid) {
            return true;
        }
        for (let i = 0; i != this._grid.length; ++i) {
            for (let j = 0; j != this._grid[i].length; ++j) {
                if (this._grid[i][j] != grid[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
}

export type Position2D = [number, number];
