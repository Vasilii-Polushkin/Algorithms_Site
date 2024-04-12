import {cols, control, getNearFields, isFieldValid, rows} from "./control.js";
import {Ant, Cell, Colony} from "./objects.js";

export let step = 1;
export let currFPS;
export let square = 5;

export class Model {
    ants = [];
    map = [];
    colony = new Colony(0, 0);

    update() {
        currFPS = parseInt(control.antsSpeed.textContent);

        for (let i = 0; i < this.ants.length; i++) {
            if(!this.ants[i].dead) {
                this.ants[i].update(getNearFields(this.ants[i], this.map));

                if (!isFieldValid(this.ants[i].location.x, this.ants[i].location.y)) {
                    this.dead = true;
                    continue;
                }

                if (!this.ants[i].target && this.map[this.ants[i].location.y][this.ants[i].location.x].food.saturation !== 0) {
                    this.ants[i].target = true;
                    this.ants[i].length = 0;
                }
                if (this.ants[i].target) {
                    if(this.ants[i].location.x <= this.colony.x + 3 && this.ants[i].location.x >= this.colony.x - 3 &&
                        this.ants[i].location.y <= this.colony.y + 3 && this.ants[i].location.y >= this.colony.y - 3){
                        this.ants[i].target = false;
                        this.ants[i].length = 0;
                    }
                }

                if (!this.ants[i].target) this.map[this.ants[i].location.y][this.ants[i].location.x].toHome += 0.01;
                else this.map[this.ants[i].location.y][this.ants[i].location.x].toFood += 0.01;


            }
        }

        // update map
        // ...
        // walls locations, food locations
        // ...
    }

    initMap() {
        this.map = new Array(rows / square);
        for (let i = 0; i < this.map.length; i++) {
            this.map[i] = new Array(cols / square);
            for (let j = 0; j < this.map[i].length; j++) {
                this.map[i][j] = new Cell();
            }
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
            } while (direction > 3);
            this.ants[i] = new Ant(direction, this.colony);
        }
    }

    set(x, y, state, food) {
        let brushSize = parseInt(control.brushSize.textContent) / square;
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
                if(!food) this.map[i][j].wall = state;
                else this.map[i][j].food.addFood();
            }
        }
    }
}


