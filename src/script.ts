///<reference path='png.d.ts'/>

import * as PIXI from 'pixi.js';
import { CellAutomaton2D, Grid2D, Position2D } from './lib/automaton/export';

const ticks_per_second = 5;

window.onload = async () => {
    init_automaton();
    init_app();
    init_ui();
    window.setInterval(tick, 1000 / ticks_per_second);
}

const cell_size = 25;
const app_width = window.innerWidth;
const app_height = window.innerHeight;

const width = Math.floor(app_width / cell_size);
const height = Math.floor(app_height / cell_size);

var automaton: CellAutomaton2D<boolean>;

function init_automaton() {
    let grid = new Grid2D<boolean>(
        new Array(width).fill([])
        .map(() =>
            new Array(height).fill(false)
            .map(() => Math.random() < 0.3)
        )
    );
    automaton = new CellAutomaton2D<boolean>(grid, rule);
}

function rule(this: CellAutomaton2D<boolean>, pos: Position2D) {
    if (this.grid.get(pos)) {
        let below = { i: pos.i, j: pos.j + 1 };
        if (this.grid.has(below) && !this.grid.get(below)) {
            return false;
        }
    } else {
        let above = { i: pos.i, j: pos.j - 1 };
        if (this.grid.has(above) && this.grid.get(above)) {
            return true;
        }
    }
    return this.grid.get(pos);
}

var app: PIXI.Application;
var graphics: PIXI.Graphics;

function init_app() {
    app = new PIXI.Application({
        width: app_width,
        height: app_height,
        backgroundColor: 0
    });
    document.body.appendChild(app.view);

    graphics = new PIXI.Graphics();
    graphics.beginFill(0xFFFFFF);
    app.stage.addChild(graphics);
}

function init_ui() {
    app.view.onclick = (event: MouseEvent) => {
        let i = Math.floor(event.clientX / cell_size);
        let j = Math.floor(event.clientY / cell_size);

        console.log(event.clientX, event.clientY);
        console.log(i, j);

        automaton.grid.set({ i, j }, true);
        draw();
    }
}

function tick() {
    automaton.tick();
    draw();
}

function draw() {
    graphics.clear();
    automaton.grid.data.forEach((row, i) => {
        row.forEach((val, j) => {
            if (val) {
                graphics.drawRect(
                    i * cell_size,
                    j * cell_size,
                    cell_size,
                    cell_size
                );
            }
        });
    });
}
