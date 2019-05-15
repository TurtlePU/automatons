export class CellAutomaton<K, V, Grid extends BaseGrid<K, V>> {
    readonly grid: Grid;

    constructor(grid: Grid, rule: (key: K) => V) {
        this.grid = grid;
        this.rule = rule.bind(this);
    }

    protected rule(_: K): V {
        throw new Error('Rule is not defined');
    }

    tick() {
        this.grid.apply((key: K) => this.rule(key));
    }
}

export interface BaseGrid<K, V> {
    apply(callback: (key: K) => V): void
    get(key: K): V
    set(key: K, value: V): void
}
