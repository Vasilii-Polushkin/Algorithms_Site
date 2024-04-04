import {Flyweight} from "./view.js";
import {availableFields, step} from "./main.js";

export class Ant {
    constructor(direction, colony) {
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
    }

    doStep(toFoodPheromone) {
        if(this.target){
            //go home
        }
        else {
            // find food
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

    }

    /*goStep() {
        let pos=model.roundPos(this.pos);
        model.map[pos.x][pos.y]=false;
        let angle=this.angle-Math.PI/2;
        this.pos.x+=this.speed*Math.cos(angle);
        this.pos.y+=this.speed*Math.sin(angle);
        pos=model.roundPos(this.pos);
        model.map[pos.x][pos.y]=this;
        if (this.step<=0) {
            this.pose=!this.pose;
            this.step=1/this.speed*5;
            this.score++;
            if (this.pose)
                model.newLabel(this.color, pos);
            else if (this.load instanceof Food)
                model.newLabel(Food.color, pos);
        } else
            this.step--;
    }*/

    /*leavePheromoneTrail(cell) {
        // what's wrong with path length?
        cell.toFood += alpha / this.path.length;
        //this.path[this.path.length - 1]
    }*/

    update(toFoodPheromone) {
        //this.timer--;
        //this.life -= 0.01;
        // Смена режима
        /*if (this.timer <= 0) {
            this.listTarget = this.vision();
            this.action = this.ai.select(this);
            this.action(this);
        }*/
        return this.doStep(toFoodPheromone);
    }

    draw(ctx, fw) {
        let x = this.location.x, y = this.location.y, angle = this.angle;
        let pose = this.pose;
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
    }
}

export class Colony {
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

class Food {
    constructor(saturation, color) {
        this.saturation = saturation;
        this.color = color;
    }
}

export class Cell {
    constructor() {
        // color of food is????
        this.food = new Food(0.0, );
        this.wall = false;
        this.toHome = 0.0;
        this.toFood = 0.2;
    }
}