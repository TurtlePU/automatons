import { CellAutomaton2D, Position2D } from "../lib/automaton/dim-2";

export function id(this: CellAutomaton2D<number>, pos: Position2D) {
    return this.get(pos);
}

export function sand(this: CellAutomaton2D<number>, pos: Position2D) {
    let up_pos = [pos[0], pos[1] - 1] as Position2D;
    let down_pos = [pos[0], pos[1] + 1] as Position2D;

    let old = this.get(pos);
    let plus = this.has(up_pos) && Math.min(1 - old, this.get(up_pos));
    let minus = this.has(down_pos) && Math.min(old, 1 - this.get(down_pos));

    return Math.max(0, Math.min(old + plus - minus, 1));
}

function abs(vec: number[]) {
    return Math.sqrt(
        vec
            .map(x => x * x)
            .reduce((sum, x) => sum + x)
    );
}

function norm(vec: number[]) {
    let mod = abs(vec);
    return vec.map(x => x / mod);
}

const eighth = Math.PI / 8;

export function gravity(this: CellAutomaton2D<number>, pos: Position2D) {
    let dim = this.dims;
    let diff = norm([dim[0] / 2 - pos[0], dim[1] / 2 - pos[1]]);
    let angle = Math.atan2(diff[1], diff[0]);

    let shift = [0, 0];
    if (-eighth < angle && angle <= eighth) {
        shift = [1, 0];
    } else if (eighth < angle && angle <= 3 * eighth) {
        shift = [1, 1];
    } else if (3 * eighth < angle && angle <= 5 * eighth) {
        shift = [0, 1];
    } else if (5 * eighth < angle && angle <= 7 * eighth) {
        shift = [-1, 1];
    } else if (7 * eighth < angle || angle <= -7 * eighth) {
        shift = [-1, 0];
    } else if (-7 * eighth < angle && angle <= -5 * eighth) {
        shift = [-1, -1];
    } else if (-5 * eighth < angle && angle <= -3 * eighth) {
        shift = [0, -1];
    } else if (-3 * eighth < angle && angle <= -eighth) {
        shift = [1, -1];
    }

    let here = this.get(pos);

    let from_pos = [pos[0] - shift[0], pos[1] - shift[1]] as Position2D;
    if (this.has(from_pos)) {
        let from = this.get(from_pos);
        if (from > here) {
            return from;
        }
    }

    let to_pos = [pos[0] + shift[0], pos[1] + shift[1]] as Position2D;
    if (this.has(to_pos)) {
        let to = this.get(to_pos);
        if (to < here) {
            return to;
        }
    }

    return here;
}
