import {getNearPheromones} from "./main.js";
import {ants, pheromones} from "./draw.js";
import {view} from "./draw.js";

const FPS = 40;

export class Control {
    constructor() {
        setInterval(() => this.update(), 1000/FPS);
    }

    update() {
        for (let i = 0; i < ants.length; i++) {
            let delta = ants[i].update(getNearPheromones(ants[i], pheromones));
            ants[i].location.x = ants[i].location.x + delta.x;
            ants[i].location.y = ants[i].location.y + delta.y;
        }
        view.draw();
    }
}