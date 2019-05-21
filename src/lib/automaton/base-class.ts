export default abstract class CellAutomaton<K, V, Grid> {
    protected _grid: Grid
    private _stable: boolean

    private _rule(_: K): V {
        throw new Error('Rule is not defined');
    }

    constructor(grid: Grid, rule?: (key: K) => V) {
        this._grid = grid;
        if (rule) {
            this.rule = rule;
        }
        this._stable = false;
    }

    abstract get grid(): Grid

    get stable() {
        return this._stable;
    }

    set rule(rule: (key: K) => V) {
        this._rule = rule.bind(this);
        this._stable = false;
    }

    abstract get(key: K): V
    abstract has(key: K): boolean

    set(key: K, value: V) {
        this.inner_set(key, value);
        this._stable = false;
    }

    tick() {
        if (this._stable) {
            return;
        }
        let new_grid = this.inner_tick(this._rule);
        if (this.equal_to(new_grid)) {
            this._stable = true;
        }
        this._grid = new_grid;
    }

    protected abstract inner_set(key: K, value: V): void
    protected abstract inner_tick(rule: (key: K) => V): Grid
    protected abstract equal_to(grid: Grid): boolean
}
