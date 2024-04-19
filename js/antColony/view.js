import {Labyrinth} from "./labyrinth.js";
import {control, model, rows, cols, isFieldValid} from "./control.js";
import {square} from "./model.js";


export class View {
    constructor() {
        this.labyrinth = new Labyrinth();
        this.layer1 = document.getElementById('layer1');
        this.layer2 = document.getElementById('layer2');
        this.layer3 = document.getElementById('layer3');
        this.extraLayer1 = document.getElementById('extraLayer1');
        this.onResize();
        window.addEventListener('resize', this.onResize);
    }

    init() {
        if (control.setLabyrinth) {
            this.style = '#858080';
            this.labyrinth.init();
            this.labyrinth.drawMap();
            model.map = this.labyrinth.answerMap;
        } else {
            this.style = '#047344';
            this.ctx1.fillStyle = this.style;
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
            for (let i = 0; i < brushSize; i += square) {
                for (let j = 0; j < brushSize; j += square) {
                    let _x = (x - brushSize / 2 + j) / square;
                    let _y = (y - brushSize / 2 + i) / square;
                    if (isFieldValid(_x, _y)) {
                        model.map[_y][_x].food.drawFood(this.ctx2, _x * square, _y * square);
                    }
                }
            }
        }

        for(let pair of model.food){
            model.map[pair.y][pair.x].food.drawFood(this.ctx2, pair.x * square, pair.y * square);
        }
        model.food.clear();

        if (control.mouseState === 'WALL' && control.setWall) {
            this.ctx2.fillStyle = '#1f1f1f';
            this.ctx2.fillRect(Math.floor(x / square) * square - brushSize / 2,
                Math.floor(y / square) * square - brushSize / 2, brushSize, brushSize);
        }
        this.ctx1.drawImage(this.layer2, 0, 0);

        if (control.mouseState === 'ERASER' && control.eraserWorks) {
            this.ctx2.fillStyle = this.style;
            this.ctx2.fillRect(Math.floor(x / square) * square - brushSize / 2,
                Math.floor(y / square) * square - brushSize / 2, brushSize, brushSize);
        }

        if (control.mouseState === 'COLONY' && control.initColony) {
            model.colony.drawSilhouette(this.ctx1, Math.floor(control.x / square), Math.floor(control.y / square));
        }

        if (control.setColony) {
            for (let ant of model.ants) {
                if (!ant.dead) {
                    ant.draw(this.ctx1);
                    ant.path.add({x: ant.location.x, y: ant.location.y});
                }
                for(let pair of ant.path){
                    model.map[Math.floor(pair.y / square)][Math.floor(pair.x / square)].draw(this.ctx3, pair.x, pair.y, this.ctx1);
                }
            }
            this.ctx1.drawImage(this.layer3, 0, 0);
            model.colony.draw(this.ctx1);
        }
    }

    onResize() {
        this.layer1.height = rows;
        this.layer1.width = cols;
        this.layer2.height = rows;
        this.layer2.width = cols;
        this.layer3.height = rows;
        this.layer3.width = cols;
        this.extraLayer1.height = rows;
        this.extraLayer1.width = cols;
        this.ctx1 = this.layer1.getContext('2d');
        this.ctx2 = this.layer2.getContext('2d');
        this.ctx3 = this.layer3.getContext('2d');
        this.extraCtx1 = this.extraLayer1.getContext('2d');
    }
}

