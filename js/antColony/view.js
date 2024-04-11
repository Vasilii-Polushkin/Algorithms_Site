import {generateLabyrinth, init, drawMap, map} from "./labyrinth.js";
import {control, model, rows, cols, isFieldValid} from "./control.js";
import {square} from "./model.js";


export class View {
    constructor() {
        this.layer1 = document.getElementById('layer1');
        this.layer2 = document.getElementById('layer2');
        this.extraLayer1 = document.getElementById('extraLayer1');
        this.onResize();
        window.addEventListener('resize', this.onResize);
    }

    init() {
        if (control.setLabyrinth) {
            this.style = '#858080';
            generateLabyrinth();
            init();
            model.map = drawMap();
        } else {
            this.style = '#047344';
            this.ctx1.fillStyle = '#047344';
            this.ctx1.fillRect(0, 0, this.layer1.width, this.layer1.height);
        }
    }

    draw() {
        let brushSize = parseInt(control.brushSize.textContent);
        let x = Math.floor(control.x / square) * square;
        let y = Math.floor(control.y / square) * square;

        if (control.setLabyrinth) {
            this.ctx1.clearRect(0, 0, this.layer1.width, this.layer1.height);
            this.ctx1.drawImage(this.extraLayer1, 0, 0);

        } else {
            this.ctx1.clearRect(0, 0, this.layer1.width, this.layer1.height);
            this.ctx1.fillStyle = '#047344';
            this.ctx1.fillRect(0, 0, this.layer1.width, this.layer1.height);

            this.extraCtx1.drawImage(this.layer1, 0, 0);
        }

        if (control.mouseState === 'FOOD' && control.setFood) {
            for (let i = 0; i < brushSize; i += square * 2) {
                for (let j = 0; j < brushSize; j += square * 2) {
                    let _x = (x - brushSize / 2 + j) / square;
                    let _y = (y - brushSize / 2 + i) / square;
                    if (isFieldValid(_x, _y)) {
                        model.map[_y][_x].food.addFood();
                        model.map[_y][_x].food.drawFood(this.ctx2, _x * square, _y * square);
                    }
                }
            }
        }

        if (control.mouseState === 'WALL' && control.setWall) {
            this.ctx2.fillStyle = '#1f1f1f';
            this.ctx2.fillRect(Math.floor(x / square / 2) * square * 2 - brushSize / 2,
                Math.floor(y / square / 2) * square * 2 - brushSize / 2, brushSize, brushSize);
        }
        this.ctx1.drawImage(this.layer2, 0, 0);

        if (control.mouseState === 'ERASER' && control.eraserWorks) {
            this.ctx2.fillStyle = this.style;
            this.ctx2.fillRect(Math.floor(x / square / 2) * square * 2 - brushSize / 2,
                Math.floor(y / square / 2) * square * 2 - brushSize / 2, brushSize, brushSize);
        }

        if (control.mouseState === 'COLONY' && control.initColony) {
            model.colony.drawSilhouette(this.ctx1, control.x, control.y);
        }

        if (control.setColony) {
            for (let ant of model.ants) {
                if (!ant.dead) ant.draw(this.ctx1, this.fw);
            }
            model.colony.draw(this.ctx1);
        }
    }

    onResize() {
        this.layer1.height = rows;
        this.layer1.width = cols;
        this.layer2.height = rows;
        this.layer2.width = cols;
        this.extraLayer1.height = rows;
        this.extraLayer1.width = cols;
        this.ctx1 = this.layer1.getContext('2d');
        this.ctx2 = this.layer2.getContext('2d');
        this.extraCtx1 = this.extraLayer1.getContext('2d');
        this.fw = new Flyweight();
    }
}

export class Flyweight {
    static Pi05 = Math.PI / 2;
    static Pi2 = Math.PI * 2;

    // Статичные данные
    constructor() {
        this.size = 2;
        this.line = this.size * 0.2;
        this.size025 = this.size * 0.25;
        this.size05 = this.size * 0.5;
        this.size125 = this.size * 1.25;
        this.size15 = this.size * 1.5;
        this.size2 = this.size * 2;
        this.size22 = this.size * 2.2;
        this.size25 = this.size * 2.5;
        this.size28 = this.size * 2.8;
        this.size3 = this.size * 3;
        this.size35 = this.size * 3.5;
        this.size4 = this.size * 4;
        this.size45 = this.size * 4.5;
        this.size6 = this.size * 6;
        this.size8 = this.size * 8;
    }
}