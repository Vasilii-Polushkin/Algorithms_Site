import {generateLabyrinth, init, drawMap, map} from "./labyrinth.js";
import {control, model, rows, cols} from "./control.js";


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
        let x = control.x;
        let y = control.y;

        if (control.setLabyrinth) {
            this.ctx1.clearRect(0, 0, this.layer1.width, this.layer1.height);
            /*init();
            drawMap();*/
            this.ctx1.drawImage(this.extraLayer1, 0, 0);

        } else {
            this.ctx1.clearRect(0, 0, this.layer1.width, this.layer1.height);
            this.ctx1.fillStyle = '#047344';
            this.ctx1.fillRect(0, 0, this.layer1.width, this.layer1.height);

            this.extraCtx1.drawImage(this.layer1, 0, 0);
        }

        if(control.mouseState === 'FOOD' && control.setFood) {
            //...
        }

        if (control.mouseState === 'WALL' && control.setWall) {
            this.ctx2.beginPath();

            this.ctx2.lineWidth = brushSize;

            this.ctx2.lineCap = 'square';
            this.ctx2.strokeStyle = '#1f1f1f';

            this.ctx2.moveTo(x, y);

            this.ctx2.lineTo(x, y);
            this.ctx2.stroke();
            this.ctx2.closePath();
        }
        this.ctx1.drawImage(this.layer2, 0, 0);

        if (control.mouseState === 'ERASER' && control.eraserWorks) {
            this.ctx2.fillStyle = this.style;
            this.ctx2.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
        }

        if (control.mouseState === 'COLONY' && control.initColony) {
            model.colony.drawSilhouette(this.ctx1);
        }

        if (control.setColony) {
            for (let ant of model.ants) {
                if(!ant.dead) ant.draw(this.ctx1, this.fw);
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