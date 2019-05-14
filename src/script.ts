import * as PIXI from 'pixi.js';

const STATE_ZERO = 0;
const STATE_READY = 1;

var state = STATE_ZERO;

window.onload = () => {
    init_grid();
    state = STATE_READY;
}

var app: PIXI.Application;

function init_grid() {
    app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0
    });
    document.body.appendChild(app.view);
}
