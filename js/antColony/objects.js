import {Flyweight} from "./view.js";
import {availableFields, isFieldValid} from "./control.js";
import {square} from "./model.js";

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
        this.location = {x: Math.floor(colony.x / square), y: Math.floor(colony.y / square)};
        this.colonyLocation = {x: Math.floor(colony.x / square), y: Math.floor(colony.y / square)};
        this.grab = false;
        this.drop = false;
        this.angle = 0;
        this.pose = 0;
        /**
         * false - food
         * true - home
         */
        this.target = false;
        this.vision = 10;
        this.prevStep = 0;
        this.step = 0;
    }

    doStep(pheromones) {

        if (this.step === 0 || pheromones[this.prevStep] === 0) {

            this.step = Math.floor(Math.random() * 10 + 5);

            let maxDesire = 0;
            let desireToMove = new Array(availableFields);
            let probabilities = new Array(availableFields);
            for (let i = 0; i < desireToMove.length; i++) {
                desireToMove[i] = Math.pow(pheromones[i], 2);
                if(desireToMove[i] > maxDesire){
                    maxDesire = desireToMove[i];
                    this.prevStep = i;
                }
            }

            if(!this.target){
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
            }



        } else {
            this.step--;
        }

        switch(this.prevStep){
            case 0: {
                this.angle = -45;
                return {x: -1, y: -1};
            }
            case 1: {
                this.angle = 0;
                return {x: 0, y: -1};
            }
            case 2: {
                this.angle = 45;
                return {x: 1, y: -1};
            }
            case 3: {
                this.angle = -90;
                return {x: -1, y: 0};
            }
            case 4: {
                this.angle = 90;
                return {x: 1, y: 0};
            }
            case 5: {
                this.angle = -135;
                return {x: -1, y: 1};
            }
            case 6: {
                this.angle = 180;
                return {x: 0, y: 1};
            }
            case 7: {
                this.angle = 135;
                return {x: 1, y: 1};
            }
        }
    }

    update(pheromones) {
        let delta = this.doStep(pheromones);
        if(isFieldValid(this.location.x + delta.x, this.location.y + delta.y)){
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

        //this.roundCoordinates();

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

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#943b16';
        ctx.fill();
        ctx.closePath();
    }

    drawSilhouette(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
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
        this.toHome = 0.01;
        this.toFood = 0.01;
    }
}