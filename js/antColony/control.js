import {view, model} from "./main.js";

const FPS = 40;

export class Control {
    // control, buttons: set colony, set food, set walls, generate labyrinth, pause, clear
    constructor() {
        setInterval(() => this.update(), 1000/FPS);
    }

    update() {
        model.update();
        view.draw();
    }
}