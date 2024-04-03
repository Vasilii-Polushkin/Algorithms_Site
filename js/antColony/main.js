import {rows, cols} from "./draw.js"
import {Flyweight} from "./view.js"

let antsCount = 50;
export let availableFields = 8;
const alpha = 1;
let step = 5;

export class Ant {
    constructor(direction, colonyX, colonyY) {
        /**
         * 0  up-left
         * 1  up
         * 2  up-right
         * 3  left
         * 4  right
         * 5  down-left
         * 6  down
         * 7  down-right
         */
        this.direction = direction;
        this.location = {x: colonyX, y: colonyY};
        this.path = [];
        //this.run = false;
        this.angle = 0;
        this.pose = 0;
    }

    doStep(toFoodPheromone) {
        let desireToMove = new Array(availableFields);
        let probabilities = new Array(availableFields);
        for (let i = 0; i < desireToMove.length; i++)
            if(toFoodPheromone[i] > 0) desireToMove[i] = Math.pow(toFoodPheromone[i], 1);

        const sum = desireToMove.reduce((partialSum, a) => partialSum + a, 0);
        probabilities[0] = desireToMove[0] / sum;
        for (let i = 1; i < probabilities.length; i++) {
            probabilities[i] = desireToMove[i] / sum + probabilities[i - 1];
        }

        let temp = Math.random();
        let answerField = 0;
        for (let i = 1; i < probabilities.length; i++) {
            if (temp < probabilities[i] && temp > probabilities[i - 1]) {
                answerField = i;
                break;
            }
        }

        if(answerField === 0) return {x: -step, y: -step};
        if(answerField === 1) return {x: 0, y: -step};
        if(answerField === 2) return {x: step, y: -step};
        if(answerField === 3) return {x: -step, y: 0};
        if(answerField === 4) return {x: step, y: 0};
        if(answerField === 5) return {x: -step, y: step};
        if(answerField === 6) return {x: 0, y: step};
        if(answerField === 7) return {x: step, y: step};
    }

    leavePheromoneTrail(cell) {
        // what's wrong with path length?
        cell.toFood += alpha / this.path.length;
        //this.path[this.path.length - 1]
    }

    update(toFoodPheromone) {
        //this.timer--;
        //this.life -= 0.01;
        // Смена режима
        /*if (this.timer <= 0) {
            this.listTarget = this.vision();
            this.action = this.ai.select(this);
            this.action(this);
        }*/
        // Движение муравья
        //if (this.run)
        return this.doStep(toFoodPheromone);
    }

    draw(ctx, fw) {
        let x = this.location.x, y = this.location.y, angle = this.angle;
        let pose = this.pose * 0.5;
        // Смена координат для поворота
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.translate(-x, -y);
        // Корм
        /*if (this.load) {
            this.load.pos = {x: x, y: y - fw.size4};
            this.load.draw(ctx);
        }*/
        // Цвета и линии
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'Black';
        ctx.fillStyle = '#1a0505';
        /*// Тени
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 1;*/
        // Лапки 1-4
        ctx.beginPath();
        ctx.moveTo(x - fw.size25, y - fw.size3 - pose * 2);
        ctx.lineTo(x - fw.size2, y - fw.size15 - pose);
        ctx.lineTo(x + fw.size28, y + fw.size2 + pose * 2);
        ctx.lineTo(x + fw.size4, y + fw.size6 + pose * 4);
        // Лапки 2-5
        ctx.moveTo(x - fw.size35, y + fw.size + pose);
        ctx.lineTo(x - fw.size22, y - fw.size025 + pose);
        ctx.lineTo(x + fw.size22, y + fw.size025 - pose);
        ctx.lineTo(x + fw.size35, y + fw.size15 - pose);
        // Лапки 3-6
        ctx.moveTo(x - fw.size4, y + fw.size8 - pose * 4);
        ctx.lineTo(x - fw.size28, y + fw.size3 - pose * 2);
        ctx.lineTo(x + fw.size2, y - fw.size2 + pose);
        ctx.lineTo(x + fw.size25, y - fw.size4 + pose * 2);
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
        ctx.lineTo(x - fw.size15 + pose * 0.5, y - fw.size45);
        ctx.moveTo(x + fw.size05, y - fw.size22);
        ctx.lineTo(x + fw.size15 - pose * 0.5, y - fw.size45);
        ctx.stroke();
        ctx.closePath();
        // Сброс координат
        //ctx.restore();
        /*ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;*/
    }
}

class Cell {
    constructor() {
        this.food = 0.0;
        this.toHome = 0.0;
        this.toFood = 0.2;
    }
}

class Colony {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

export function initPheromones() {
    let pheromones = new Array(rows);
    for (let i = 0; i < pheromones.length; i++) {
        pheromones[i] = new Array(cols);
        for (let j = 0; j < pheromones[i].length; j++)
            pheromones[i][j] = new Cell();
    }
    return pheromones;
}

function isFieldValid(x, y) {
    return x >= 0 && x < cols && y >= 0 && y < rows;
}

export function getNearPheromones(ant, pheromones) {
    let toFoodPheromone = new Array(availableFields);
    for (let j = 0; j < toFoodPheromone.length; j++) {
        let pheromoneX;
        let pheromoneY;
        let b;
        if(j === 0) {
            pheromoneX = ant.location.x - step;
            pheromoneY = ant.location.y - step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 1) {
            pheromoneX = ant.location.x;
            pheromoneY = ant.location.y - step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 2) {
            pheromoneX = ant.location.x + step;
            pheromoneY = ant.location.y - step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 3) {
            pheromoneX = ant.location.x - step;
            pheromoneY = ant.location.y;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 4) {
            pheromoneX = ant.location.x + step;
            pheromoneY = ant.location.y;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 5) {
            pheromoneX = ant.location.x - step;
            pheromoneY = ant.location.y + step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 6) {
            pheromoneX = ant.location.x;
            pheromoneY = ant.location.y + step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 7) {
            pheromoneX = ant.location.x + step;
            pheromoneY = ant.location.y + step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        if(!b) {
            toFoodPheromone[j] = 0;
            return toFoodPheromone;
        }
        toFoodPheromone[j] = pheromones[pheromoneY][pheromoneX].toFood;
    }
    return toFoodPheromone;
}

export function initColony(colonyX, colonyY) {
    return new Colony(colonyX, colonyY);
}

export function initAnts(colony) {
    let ants = new Array(antsCount);
    let direction;

    for (let i = 0; i < ants.length; i++) {
        do {
            direction = Math.floor(Math.random() * 10);
        } while (direction > 7);
        ants[i] = new Ant(direction, colony.x, colony.y);
    }
    return ants;
}