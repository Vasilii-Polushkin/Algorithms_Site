import {isFieldValid} from "./control.js";
import {square} from "./model.js";

export let vision = 29;
let size = vision ** 2;
let iterationCount = Math.floor(Math.random() * 10) + 5;

export class Ant {
    constructor(direction, colony) {
        this.dead = false;
        /**
         * 0  up
         * 1  left
         * 2  right
         * 3  down
         */
        this.direction = direction;
        this.location = {x: colony.x * square, y: colony.y * square};
        this.foodPheromones = 0;
        this.homePheromones = 1;
        /**
         * false - food
         * true - home
         */
        this.target = false;
        this.it = 0;
        this.vector = {x: 0, y: 0};
        this.step = {x: 0, y: 0};
        this.path = new Set();
    }

    doStep(pheromones) {

        if (this.vector.y + vision < pheromones.length) {
            if (pheromones[this.vector.y + vision][this.vector.x + (vision - 1) / 2] === 0) {
                this.switchDirection();
                this.it = 0;
            }
        }

        if (this.it === 0) {

            let desireToMove = new Array(size);
            for (let i = 0; i < desireToMove.length; i++) {
                if(pheromones[Math.floor(i / vision)][i % vision] === -100 && this.target) desireToMove[i] = 10000;
                else if(pheromones[Math.floor(i / vision)][i % vision] === -100 && !this.target) desireToMove[i] = 10000;
                else desireToMove[i] = pheromones[Math.floor(i / vision)][i % vision] ** 2;
            }
            const sum = desireToMove.reduce((partialSum, a) => partialSum + a, 0);

            let probabilities = new Array(size);
            probabilities[0] = desireToMove[0] / sum;
            for (let i = 1; i < probabilities.length; i++)
                probabilities[i] = desireToMove[i] / sum + probabilities[i - 1];

            let temp = Math.random();
            for (let i = 1; i < probabilities.length; i++) {
                if (temp < probabilities[i] && temp > probabilities[i - 1]) {
                    this.vector = {x: i % vision - (vision - 1) / 2, y: Math.floor(i / vision) - vision};
                    break;
                }
            }

            this.it = iterationCount;
            this.step.x = Math.floor(3 * this.vector.x / (Math.sqrt(this.vector.x ** 2 + this.vector.y ** 2)));
            this.step.y = Math.floor(3 * this.vector.y / (Math.sqrt(this.vector.x ** 2 + this.vector.y ** 2)));

        } else this.it--;

        switch (this.direction) {
            case 0: {
                return {x: this.step.x, y: this.step.y};
            }
            case 1: {
                return {x: this.step.y, y: -this.step.x};
            }
            case 2: {
                return {x: -this.step.y, y: this.step.x};
            }
            case 3: {
                return {x: -this.step.x, y: -this.step.y};
            }
        }
    }

    switchDirection() {
        switch (this.direction) {
            case 0: {
                do {
                    this.direction = Math.floor(Math.random() * 10) % 4;
                } while (this.direction === 0)
                break;
            }
            case 1: {
                do {
                    this.direction = Math.floor(Math.random() * 10) % 4;
                } while (this.direction === 1)
                break;
            }
            case 2: {
                do {
                    this.direction = Math.floor(Math.random() * 10) % 4;
                } while (this.direction === 2)
                break;
            }
            case 3: {
                do {
                    this.direction = Math.floor(Math.random() * 10) % 4;
                } while (this.direction === 3)
                break;
            }
        }
    }

    switchDirectionFromFood() {
        switch (this.direction) {
            case 0: {
                this.direction = 3;
                break;
            }
            case 1: {
                this.direction = 2;
                break;
            }
            case 2: {
                this.direction = 1;
                break;
            }
            case 3: {
                this.direction = 0;
                break;
            }
        }
    }


    update(pheromones) {
        let delta = this.doStep(pheromones);
        if (isFieldValid(Math.floor((this.location.x + delta.x) / square), Math.floor((this.location.y + delta.y) / square))) {
            this.location.x += delta.x;
            this.location.y += delta.y;
        }
        else this.switchDirection();
    }

    draw(ctx) {
        let x = this.location.x, y = this.location.y;
        if (!isFieldValid(Math.floor(x / square), Math.floor(y / square))) {
            this.dead = true;
            return;
        }

        ctx.save();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

export class Colony {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x * square, this.y * square, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#943b16';
        ctx.fill();
        ctx.closePath();
    }

    drawSilhouette(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x * square, y * square, 15, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(65,61,61,0.5)";
        ctx.fill();
        ctx.closePath();
    }
}

class Food {
    saturation = 0;
    colors = [
        '#000', '#260b00', '#3b1500', '#6e2700',
        '#944000', '#c7571c', '#f6791f'
    ];

    addFood() {
        if (this.saturation < 5)
            this.saturation++;
    }

    drawFood(ctx, x, y) {
        /*x = Math.floor(x / square / 2) * square * 2;
        y = Math.floor(y / square / 2) * square * 2;*/

        if(this.saturation === 0) {
            ctx.clearRect(x, y, square, square);
            return;
        }
        ctx.beginPath();
        ctx.arc(x + square / 2, y + square / 2, square / 2 - 0.1, 0, Math.PI * 2);
        ctx.fillStyle = this.colors[this.saturation];
        ctx.fill();
        ctx.closePath();
    }
}

export class Cell {
    constructor() {
        this.colony = false;
        this.food = new Food();
        this.wall = false;
        this.toHome = 0.0001;
        this.toFood = 0.0001;
    }

    draw(ctx, x, y, mainCtx) {

        if (this.toFood > 0.0001) {
            ctx.beginPath();
            ctx.arc(x, y, 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ef0000';
            ctx.fill();
            ctx.closePath();
        } else {
            /*mainCtx.fillRect(x - 0.5, y - 0.5, 1, 1);
            ctx.clearRect(x - 0.5, y - 0.5, 1, 1);*/
            ctx.clearRect(0, 0, 640, 640);
        }

        if (this.toHome > 0.0001) {
            ctx.beginPath();
            ctx.arc(x, y, 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#0800ff';
            ctx.fill();
            ctx.closePath();
        } else {
            /*mainCtx.fillRect(x - 0.5, y - 0.5, 1, 1);
            ctx.clearRect(x - 0.5, y - 0.5, 1, 1);*/
            ctx.clearRect(0, 0, 640, 640);
        }
    }
}