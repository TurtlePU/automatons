import * as PIXI from 'pixi.js';

import { CellAutomaton2D } from '../lib/automaton/dim-2';
import * as Rules from '../util/rules';

const ticks_per_second = 10;

window.onload = async () => {
    init_automaton();
    init_app();
    init_ui();
    window.setInterval(tick, 1000 / ticks_per_second);
}

const cell_size = 9;
const app_width = window.innerWidth;
const app_height = window.innerHeight;

const width = Math.floor(app_width / cell_size);
const height = Math.floor(app_height / cell_size);

var automaton: CellAutomaton2D<number>;

function init_automaton() {
    automaton = new CellAutomaton2D(
        new Array(width).fill([]).map((_, i) =>
            new Array(height).fill(0).map((_, j) => {
                let val = Math.pow(i / 10, j / 10);
                return (val - Math.floor(val))// * Math.random();
            })
        ),
        Rules.id
    );
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
        automaton.set([i, j], 1);
        draw();
    }
}

function tick() {
    automaton.tick();
//    if (automaton.stable) {
//        automaton.rule = Rules.sand;
//    }
    draw();
}

function draw() {
    graphics.clear();
    automaton.grid.forEach((row, i) => {
        row.forEach((val, j) => {
            graphics.beginFill(0xFFFFFF, val);
            graphics.drawRect(
                i * cell_size,
                j * cell_size,
                cell_size,
                cell_size
            );
            graphics.endFill();
        });
    });
}
