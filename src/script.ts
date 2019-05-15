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

const cell_size = 30;
const app_width = window.innerWidth;
const app_height = window.innerHeight;

const width = Math.floor(app_width / cell_size);
const height = Math.floor(app_height / cell_size);

var automaton: CellAutomaton2D<number>;

function init_automaton() {
    let grid = new Grid2D<number>(
        new Array(width).fill([])
        .map(() =>
            new Array(height).fill(0)
            .map(() => Math.random())
        )
    );
    console.log(grid);
    automaton = new CellAutomaton2D(grid, rule);
}

const directions = [
    [-1, -1],
    [-1,  0],
    [-1,  1],
    [ 0,  1],
    [ 1,  1],
    [ 1,  0],
    [ 1, -1],
    [ 0, -1],
];

function rule(this: CellAutomaton2D<number>, pos: Position2D) {
    return directions.map(shift => {
        let tpos = { i: pos.i + shift[0], j: pos.j + shift[1] };
        return this.grid.has(tpos) && this.grid.get(tpos);
    }).reduce((sum, val) => sum + val) / directions.length;
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
    app.stage.addChild(graphics);
}

function init_ui() {
    app.view.onclick = (event: MouseEvent) => {
        let i = Math.floor(event.clientX / cell_size);
        let j = Math.floor(event.clientY / cell_size);

        console.log(event.clientX, event.clientY);
        console.log(i, j);

        automaton.grid.set({ i, j }, 1);
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
            graphics.beginFill(0xFFFFFF, val);
            graphics.drawRect(
                i * cell_size,
                j * cell_size,
                cell_size,
                cell_size
            );
        });
    });
}
