export default class CellAutomaton<T> {
    private rule: Rule<T>;
    grid: T[][];

    constructor(rule: Rule<T>) {
        this.rule = rule.bind(this);
        this.grid = [];
    }

    tick() {
        let new_grid = [];
        for (let i = 0; i != this.grid.length; ++i) {
            new_grid[i] = [];
            for (let j = 0; j != this.grid[i].length; ++j) {
                new_grid[i][j] = this.rule(i, j);
            }
        }
        this.grid = new_grid;
    }
}

type Rule<T> = (this: CellAutomaton<T>, i: number, j: number) => T;
