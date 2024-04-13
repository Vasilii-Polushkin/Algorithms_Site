import {Flyweight} from "./view.js";
import {availableFields, getNearFields, isFieldValid, model} from "./control.js";
import {square} from "./model.js";

export let vision = 7;
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
        this.location = {x: colony.x, y: colony.y};
        this.foodPheromones = 0;
        this.homePheromones = 1;
        // в радианах
        this.angle = 0;
        /**
         * false - food
         * true - home
         */
        this.target = false;
        this.it = 0;
        this.vector = {x: 0, y: 0};
        //this.prevStep = 0;
        //this.stepIteration = 0;
        //this.interStep = {x: 0, y: 0};
        //this.step = {x: 0, y: 0};
        this.path = new Set();
    }

    doStep(pheromones) {

        if(this.it === 0/* || pheromones[this.vector.y][this.vector.x] === 0*/) {

            let desireToMove = new Array(size);
            for(let i = 0; i < desireToMove.length; i++)
                desireToMove[i] = pheromones[Math.floor(i / vision)][i % vision] ** 3;
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
        }
        else this.it--;

        if(pheromones[this.vector.y + vision][this.vector.x + (vision - 1) / 2] === 0) this.switchDirection();
        /*if (this.stepIteration === 0 || pheromones[this.location.y + this.interStep.y][this.location.x + this.interStep.x] === 0) {

            //console.log(this.location.x + this.step.x, this.location.y + this.step.y)

            let desireToMove = new Array(size);
            let probabilities = new Array(size);
            let row = -1;
            let col;
            let width = pheromones[0].length + 1;
            for (let i = 0; i < desireToMove.length; i++) {
                if (i % width === 0) {
                    width--;
                    row++;
                    col = 0;
                } else col++;

                let y = row;
                let x = col;
                desireToMove[i] = Math.pow(pheromones[y][x], 4);
            }

            if (desireToMove[this.prevStep] === 0) {
                this.switchDirection();
                this.stepIteration = 0;

                //this.direction = Math.floor(Math.random() * 10) % 4;
            }


            const sum = desireToMove.reduce((partialSum, a) => partialSum + a, 0);
            probabilities[0] = desireToMove[0] / sum;
            for (let i = 1; i < probabilities.length; i++) {
                probabilities[i] = desireToMove[i] / sum + probabilities[i - 1];
            }

            this.prevStep = 0;
            let temp = Math.random();
            for (let i = 1; i < probabilities.length; i++) {
                if (temp < probabilities[i] && temp > probabilities[i - 1]) {
                    this.prevStep = i;
                    break;
                }
            }

            for (let i = 1; i < pheromones.length; i++) {
                let leftBorder = (pheromones[0].length + 2 - i) * (i - 1);
                let rightBorder = (pheromones[0].length + 1 - i) * i;
                if (this.prevStep >= leftBorder && this.prevStep < rightBorder) {
                    this.step.y = pheromones.length - i;
                    this.step.x = (this.prevStep - leftBorder) - (rightBorder - leftBorder - 1) / 2;
                    console.log(this.step);
                    break;
                }
            }

            if (this.step.y > 0) {
                this.step.y--;
                this.interStep.y = 1;
            } else this.interStep.y = 0;
            if (this.step.x > 0) {
                this.step.x--;
                this.interStep.x = 1;
            } else if (this.step.x < 0) {
                this.step.x++;
                this.interStep.x = -1;
            } else this.interStep.x = 0;

        } else {
            this.stepIteration--;
        }*/


        this.angle = Math.atan(this.vector.x / this.vector.y);

        //let step = {x: Math.floor(Math.random() * 10) % 4, y: Math.floor(Math.random() * 10) % 4};
        //let step = {x: Math.floor(this.vector.x / 2), y: Math.floor(this.vector.y / 2)};
        let step = {x: this.vector.x, y: this.vector.y};

        switch (this.direction) {
            case 0: {
                return {x: step.x, y: step.y};
            }
            case 1: {
                if (this.angle > -Math.PI / 2) this.angle -= Math.PI / 2;
                return {x: step.y, y: -step.x};
            }
            case 2: {
                if (this.angle < Math.PI / 2) this.angle += Math.PI / 2;
                return {x: -step.y, y: step.x};
            }
            case 3: {
                this.angle -= Math.PI;
                return {x: -step.x, y: -step.y};
            }
        }
    }

    switchDirection() {
        //this.direction = Math.floor(Math.random() * 10) % 4;
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
        if (isFieldValid(this.location.x + delta.x, this.location.y + delta.y)) {
            this.location.x += delta.x;
            this.location.y += delta.y;
        }
    }

    draw(ctx, fw) {
        let x = this.location.x, y = this.location.y, angle = this.angle;
        if (!isFieldValid(x, y)) {
            this.dead = true;
            return;
        }
        x *= square;
        y *= square;

        // Смена координат для поворота
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.translate(-x, -y);
        // Цвета и линии
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#1a0505';
        // Лапки 1-4
        ctx.beginPath();
        ctx.moveTo(x - fw.size25, y - fw.size3);
        ctx.lineTo(x - fw.size2, y - fw.size15);
        ctx.lineTo(x + fw.size28, y + fw.size2);
        ctx.lineTo(x + fw.size4, y + fw.size6);
        // Лапки 2-5
        ctx.moveTo(x - fw.size35, y + fw.size);
        ctx.lineTo(x - fw.size22, y - fw.size025);
        ctx.lineTo(x + fw.size22, y + fw.size025);
        ctx.lineTo(x + fw.size35, y + fw.size15);
        // Лапки 3-6
        ctx.moveTo(x - fw.size4, y + fw.size8);
        ctx.lineTo(x - fw.size28, y + fw.size3);
        ctx.lineTo(x + fw.size2, y - fw.size2);
        ctx.lineTo(x + fw.size25, y - fw.size4);
        ctx.stroke();
        ctx.closePath();
        // Грудь
        ctx.beginPath();
        ctx.arc(x, y, fw.size, 0, Flyweight.Pi2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        // Голова
        ctx.beginPath();
        ctx.ellipse(x, y - fw.size2, fw.size125, fw.size, 0, 0, Flyweight.Pi2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        // Брюшко
        ctx.beginPath();
        ctx.ellipse(x, y + fw.size35, fw.size15, fw.size25, 0, 0, Flyweight.Pi2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        // Усики
        ctx.beginPath();
        ctx.moveTo(x - fw.size05, y - fw.size22);
        ctx.lineTo(x - fw.size15, y - fw.size45);
        ctx.moveTo(x + fw.size05, y - fw.size22);
        ctx.lineTo(x + fw.size15, y - fw.size45);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    roundCoordinates() {
        this.location.x = Math.round(this.location.x);
        this.location.y = Math.round(this.location.y);
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
        '#260b00', '#3b1500', '#6e2700',
        '#944000', '#c7571c', '#f6791f'
    ];

    addFood() {
        if (this.saturation < 5)
            this.saturation++;
    }

    drawFood(ctx, x, y) {
        ctx.beginPath();
        x = Math.floor(x / square / 2) * square * 2;
        y = Math.floor(y / square / 2) * square * 2;
        ctx.arc(x + square, y + square, square, 0, Math.PI * 2);
        ctx.fillStyle = this.colors[this.saturation];
        ctx.fill();
        ctx.closePath();
    }
}

export class Cell {
    constructor() {
        this.food = new Food();
        this.wall = false;
        this.toHome = 0.0001;
        this.toFood = 0.0001;
    }

    draw(ctx, x, y) {

        if (this.toFood > 0.001) {
            this.toFood *= 0.99;
            ctx.beginPath();
            ctx.arc(x * square, y * square, 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ef0000';
            ctx.fill();
            ctx.closePath();
        } else {
            ctx.clearRect(x * square - 0.5, y * square - 0.5, 1, 1);
        }

        if (this.toHome > 0.001) {
            this.toHome *= 0.9;
            ctx.beginPath();
            ctx.arc(x * square, y * square, 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#0800ff';
            ctx.fill();
            ctx.closePath();
        } else {
            ctx.clearRect(x * square - 0.5, y * square - 0.5, 1, 1);
        }
    }
}