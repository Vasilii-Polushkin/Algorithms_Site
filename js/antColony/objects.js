import {Flyweight} from "./view.js";
import {availableFields, isFieldValid} from "./control.js";
import {step} from "./model.js";

export class Ant {
    constructor(direction, colony) {
        this.dead = false;
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
        this.location = {x: colony.x, y: colony.y};
        this.grab = false;
        this.drop = false;
        //this.turn = false;
        //this.move = false;
        //this.back = false;
        this.angle = 0;
        this.pose = 0;
        this.path = [];
        /**
         * false - food
         * true - home
         */
        this.target = false;
        this.vision = 10;
        this.stepCount = 0;
        this.prevStep = 0;
        this.step = Math.floor(Math.random() * 10) + 10;
    }

    doStep(toFoodPheromone) {
        let answerField = 0;
        if (this.target) {
            //go home
        } else {
            // find food
            if(this.stepCount === this.step || this.stepCount === 0 || toFoodPheromone[this.prevStep] === 0){
                if(this.stepCount === this.step) {
                    this.step = Math.floor(Math.random() * 10) + 10;
                    this.stepCount = 0;
                }
                else this.stepCount++;

                let desireToMove = new Array(availableFields);
                let probabilities = new Array(availableFields);
                for (let i = 0; i < desireToMove.length; i++) {
                    //if (toFoodPheromone[i] > 0) {
                        desireToMove[i] = Math.pow(toFoodPheromone[i], 1);
                    //}
                }

                const sum = desireToMove.reduce((partialSum, a) => partialSum + a, 0);
                probabilities[0] = desireToMove[0] / sum;
                for (let i = 1; i < probabilities.length; i++) {
                    probabilities[i] = desireToMove[i] / sum + probabilities[i - 1];
                }

                answerField = 0;
                let temp = Math.random();
                for (let i = 1; i < probabilities.length; i++) {
                    if (temp < probabilities[i] && temp > probabilities[i - 1]) {
                        answerField = i;
                        break;
                    }
                }

                this.prevStep = answerField;
            }
            else{
                this.stepCount++;
                answerField = this.prevStep;
            }
        }

        if (answerField === 0) {
            this.angle = -45;
            return {x: -step, y: -step};
        } else if (answerField === 1) {
            this.angle = 0;
            return {x: 0, y: -step};
        } else if (answerField === 2) {
            this.angle = 45;
            return {x: step, y: -step};
        } else if (answerField === 3) {
            this.angle = -90;
            return {x: -step, y: 0};
        } else if (answerField === 4) {
            this.angle = 90;
            return {x: step, y: 0};
        } else if (answerField === 5) {
            this.angle = -135;
            return {x: -step, y: step};
        } else if (answerField === 6) {
            this.angle = 180;
            return {x: 0, y: step};
        } else if (answerField === 7) {
            this.angle = 135;
            return {x: step, y: step};
        }
    }

    update(toFoodPheromone) {
        return this.doStep(toFoodPheromone);
    }

    draw(ctx, fw) {
        let x = this.location.x, y = this.location.y, angle = this.angle;
        if(!isFieldValid(x, y)) {
            this.dead = true;
            return;
        }

        this.roundCoordinates();

        let pose = this.pose * 0.5;
        // Смена координат для поворота
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-x, -y);
        // Цвета и линии
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#1a0505';
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

    update() {

    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#943b16';
        ctx.fill();
        ctx.closePath();
    }

    drawSilhouette(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(65,61,61,0.5)";
        ctx.fill();
        ctx.closePath();
    }
}

class Food {
    constructor(saturation, color) {
        this.saturation = saturation;
        this.color = color;
    }
}

export class Cell {
    constructor() {
        // color of food is????
        this.food = new Food(0.0,);
        this.wall = false;
        this.toHome = 0.0;
        this.toFood = 0.2;
    }
}