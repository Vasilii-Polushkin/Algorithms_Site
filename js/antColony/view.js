import {rows, cols} from "./main.js"
import {generateLabyrinth, init, drawMap, map} from "./labyrinth.js";
import {control, model} from "./control.js";

let copyMap = map;

export class View {
    constructor() {
        this.layer1 = document.getElementById('layer1');
        this.layer2 = document.getElementById('layer2');
        this.onResize();
        window.addEventListener('resize', this.onResize);
    }

    init(){
        if (control.setLabyrinth) {
            copyMap = generateLabyrinth();
            init();
            drawMap();
        }
        else {
            this.ctx1.fillStyle = '#047344';
            this.ctx1.fillRect(0, 0, this.layer1.width, this.layer1.height);
        }
    }

    draw() {

        /*for (let food of model.listFood)
            food.draw(this.ctx);*/

        if (control.initColony) {
            model.colony.drawSilhouette(this.ctx1);
        }
        if (control.setColony) {
            for (let ant of model.ants) {
                ant.draw(this.ctx1, this.fw);
            }
            model.colony.draw(this.ctx1);
        }
        if(control.setWall) {
            this.ctx2.height = rows;
            this.ctx2.width = cols;
            this.ctx2.beginPath();

            this.ctx2.lineWidth = 20;

            this.ctx2.lineCap = 'square';
            this.ctx2.strokeStyle = '#1f1f1f';

            this.ctx2.moveTo(control.x, control.y);

            this.ctx2.lineTo(control.x, control.y);
            this.ctx2.stroke();
            this.ctx2.closePath();

        }
    }

    onResize() {
        this.layer1.height = rows;
        this.layer1.width = cols;
        this.layer2.height = rows;
        this.layer2.width = cols;
        this.ctx1 = this.layer1.getContext('2d');
        this.ctx2 = this.layer2.getContext('2d');
        this.ctx1.shadowColor = 'Black';
        this.ctx1.textBaseline = "middle";
        this.ctx1.textAlign = "center";
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