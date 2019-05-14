///<reference path='png.d.ts'/>

import * as PIXI from 'pixi.js';
import CellAutomaton from './lib/automaton';

import cell_path from '../assets/cell.png';

const ticks_per_second = 60;

window.onload = async () => {
    init_automaton();
    await init_app();
    init_ui();
    window.setInterval(tick, 1000 / ticks_per_second);
}

const cell_size = 25;
const app_width = window.innerWidth;
const app_height = window.innerHeight;

const width = Math.floor(app_width / cell_size);
const height = Math.floor(app_height / cell_size);

var automaton: CellAutomaton<boolean>;

function init_automaton() {
    automaton = new CellAutomaton(rule);
    automaton.grid = new Array(width).fill(
        new Array(height).fill(false)
    );
}

function rule(this: CellAutomaton<boolean>, i: number, j: number) {
    if (this.grid[i][j]) {
        if (j + 1 < this.grid[i].length && !this.grid[i][j + 1]) {
            return false;
        }
    } else {
        if (j - 1 >= 0 && this.grid[i][j - 1]) {
            return true;
        }
    }
    return this.grid[i][j];
}

var app: PIXI.Application;

async function init_app() {
    app = new PIXI.Application({
        width: app_width,
        height: app_height,
        backgroundColor: 0
    });
    document.body.appendChild(app.view);

    return new Promise((resolve, reject) => {
        app.loader
        .add(cell_path)
        .once('error', reject)
        .load(resolve);
    });
}

function init_ui() {
    app.view.onclick = (event: MouseEvent) => {
        let x = Math.floor(event.clientX / cell_size);
        let y = Math.floor(event.clientY / cell_size);

        console.log(event.clientX, event.clientY);
        console.log(x, y);

        if (automaton.grid[x][y]) {
            return;
        }
        automaton.grid[x][y] = true;

        let sprite = new PIXI.Sprite(
            app.loader.resources[cell_path].texture
        );
        sprite.anchor = new PIXI.Point(0.5, 0.5);
        sprite.x = (x + 0.5) * cell_size;
        sprite.y = (y + 0.5) * cell_size;
        sprite.width = cell_size;
        sprite.height = cell_size;
        app.stage.addChild(sprite);
    }
}

function tick() {
    automaton.tick();
    let coords = automaton.grid.map((col, i) => {
        return {
            i,
            col: col.map(
                (val, j) => val ? j : -1
            ).filter(val => val != -1)
        };
    }).filter(val => val.col.length != 0);
    if (coords.length == 0) {
        return;
    }

    let i = 0, j = 0;
    for (let child of app.stage.children) {
        child.x = (coords[i].i + 0.5) * cell_size;
        child.y = (coords[i].col[j] + 0.5) * cell_size;
        ++j;
        if (j == coords[i].col.length) {
            ++i;
            j = 0;
            if (i == coords.length) {
                break;
            }
        }
    }
}
