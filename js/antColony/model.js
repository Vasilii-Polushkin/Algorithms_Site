import {cols, control, getNearFields, rows} from "./control.js";
import {Ant, Cell, Colony} from "./objects.js";

export let step;
export let currFPS;

export class Model {
    ants = [];
    map = [];
    colony = new Colony(0, 0);

    update() {
        //step = parseInt(control.antsSpeed.textContent);
        currFPS = parseInt(control.antsSpeed.textContent);

        step = 3;
        for (let i = 0; i < this.ants.length; i++) {
            let delta = this.ants[i].update(getNearFields(this.ants[i], this.map));
            this.ants[i].location.x += delta.x;
            this.ants[i].location.y += delta.y;
        }

        this.colony.update();

        // update map
        // ...
        // walls locations, food locations
        // ...
    }

    initMap() {
        this.map = new Array(rows);
        for (let i = 0; i < this.map.length; i++) {
            this.map[i] = new Array(cols);
            for (let j = 0; j < this.map[i].length; j++)
                this.map[i][j] = new Cell();
        }
    }

    initColony(colonyX, colonyY) {
        this.colony = new Colony(colonyX, colonyY);
    }

    initAnts(antsNumber) {
        this.ants = new Array(antsNumber);
        let direction;

        for (let i = 0; i < this.ants.length; i++) {
            do {
                direction = Math.floor(Math.random() * 10);
            } while (direction > 7);
            this.ants[i] = new Ant(direction, this.colony);
        }
    }

    setWall(x, y) {
        //TODO REDO
        let brushSize = parseInt(control.brushSize.textContent);
        let sy = 0;
        let sx = 0;
        if(y - brushSize / 2 > 0 && y - brushSize / 2 < this.map.length) {
            sy = y - brushSize / 2;
        }
        else if(x - brushSize / 2 > this.map.length) sy = this.map.length;

        if(x - brushSize / 2 > 0 && x - brushSize / 2 < this.map.length) {
            sx = x - brushSize / 2;
        }
        else if(x - brushSize / 2 > this.map.length) sx = this.map.length;

        let dy = Math.min(this.map.length, sy + brushSize);
        let dx = Math.min(this.map.length, sx + brushSize);
        for(let i = sy; i < dy; i++) {
            for(let j = sx; j < dx; j++) {
                this.map[i][j].wall = true;
            }
        }
    }
}


