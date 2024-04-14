import {cols, control, getNearFields, isFieldValid, rows} from "./control.js";
import {Ant, Cell, Colony} from "./objects.js";

export let step = 1;
export let currFPS;
export let square = 5;
const CONST = 4;

export class Model {
    ants = [];
    map = [];
    food = new Set();
    colony = new Colony(0, 0);

    update() {
        currFPS = parseInt(control.antsSpeed.textContent);

        for (let i = 0; i < this.ants.length; i++) {

            for (let pair of this.ants[i].path) this.map[Math.floor(pair.y / square)][Math.floor(pair.x / square)].toHome *= 0.8;
            for (let pair of this.ants[i].path) this.map[Math.floor(pair.y / square)][Math.floor(pair.x / square)].toFood *= 0.9;

            //this.ants[i].path.clear();

            /*for(let j = 0; j < this.map.length; j++) {
                for(let k = 0; k < this.map[i].length; k++){
                    if (this.map[i][j].toHome > 0.001) this.map[i][j].toHome *= 0.8;
                    if (this.map[i][j].toFood > 0.001) this.map[i][j].toFood *= 0.9;
                }
            }*/

            if (!this.ants[i].dead) {
                this.ants[i].update(getNearFields(this.ants[i], this.map));

                let x = Math.floor(this.ants[i].location.x / square);
                let y = Math.floor(this.ants[i].location.y / square);


                if (!isFieldValid(x, y)) {
                    this.dead = true;
                    continue;
                }

                switch (this.ants[i].target) {
                    case false: {
                        this.map[y][x].toHome += this.ants[i].homePheromones;

                        if (this.map[y][x].food.saturation !== 0) {
                            this.ants[i].target = true;
                            this.map[y][x].food.saturation--;
                            this.food.add({x: x, y: y});
                            this.ants[i].switchDirectionFromFood();
                            this.ants[i].foodPheromones = this.map[y][x].food.saturation / 3;
                        }
                        break;
                    }
                    case true: {
                        this.map[y][x].toFood += this.ants[i].foodPheromones;

                        if (x <= this.colony.x + 3 && x >= this.colony.x - 3 &&
                            y <= this.colony.y + 3 && y >= this.colony.y - 3) {
                            this.ants[i].target = false;
                            this.ants[i].homePheromones = 1;
                            this.ants[i].switchDirectionFromFood();
                        }
                    }
                }



            }
        }
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
        this.map[colonyY][colonyX].colony = true;
        for(let i = -14; i < 14; i++){
            for(let j = -14; j < 14; j++)
                if(isFieldValid(colonyX + j, colonyY + i)) this.map[colonyY + i][colonyX + j].colony = true;
        }
    }

    initAnts(antsNumber) {
        this.ants = new Array(antsNumber);

        for (let i = 0; i < this.ants.length; i++) {
            let direction = Math.floor(Math.random() * 10) % 4;
            this.ants[i] = new Ant(direction, this.colony);
        }
    }

    set(x, y, wall, food) {
        let brushSize = parseInt(control.brushSize.textContent) / square;
        let sy = 0;
        let sx = 0;
        if (y - brushSize / 2 > 0 && y - brushSize / 2 < this.map.length) {
            sy = y - brushSize / 2;
        } else if (x - brushSize / 2 > this.map.length) sy = this.map.length;

        if (x - brushSize / 2 > 0 && x - brushSize / 2 < this.map.length) {
            sx = x - brushSize / 2;
        } else if (x - brushSize / 2 > this.map.length) sx = this.map.length;

        let dy = Math.min(this.map.length, sy + brushSize);
        let dx = Math.min(this.map.length, sx + brushSize);
        for (let i = sy; i < dy; i++) {
            for (let j = sx; j < dx; j++) {
                if(!wall && !food) {
                    this.map[i][j].food.saturation = 0;
                    this.map[i][j].wall = false;
                }
                else if (wall && !food) this.map[i][j].wall = wall;
                else this.map[i][j].food.addFood();
            }
        }
    }
}


