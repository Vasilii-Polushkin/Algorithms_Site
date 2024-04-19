import {Cell} from "./objects.js";
import {square} from "./model.js";


let rows = 16;
let cols = 16;
let squareSide = 8 * square;


const layer1 = document.getElementById('layer1');
const layer2 = document.getElementById('layer2');
const extraLayer1 = document.getElementById('extraLayer1');
const context1 = layer1.getContext('2d');
const context2 = layer2.getContext('2d');
let extraCtx1 = extraLayer1.getContext('2d');


export class Labyrinth {
    answerMap;

    constructor() {
        this.map = new Array(rows);

        for (let i = 0; i < this.map.length; i++) {
            this.map[i] = new Array(cols);
        }

        this.generateLabyrinth();
        this.init();
        this.drawMap();
    }

    isEven(n) {
        return n % 2 === 0;
    }

    getRandomFrom(array) {
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    setField(x, y, value) {
        if (x < 0 || x >= cols || y < 0 || y >= rows)
            return null;

        this.map[y][x] = value;
    }

    getField(x, y) {
        if (x < 0 || x >= cols || y < 0 || y >= rows)
            return null;

        return this.map[y][x];
    }

    isLabyrinth() {
        for (let y = 0; y < rows; y++)
            for (let x = 0; x < cols; x++)
                if (this.isEven(x) && this.isEven(y) && this.getField(x, y) === '1')
                    return false;

        return true;
    }

    move(eraser) {
        const directs = [];

        if (eraser.x > 0)
            directs.push('left');

        if (eraser.x < cols - 2)
            directs.push('right');

        if (eraser.y > 0)
            directs.push('up');

        if (eraser.y < rows - 2)
            directs.push('down');

        const direct = this.getRandomFrom(directs);

        switch (direct) {
            case 'left':
                if (this.getField(eraser.x - 2, eraser.y) === '1') {
                    this.setField(eraser.x - 1, eraser.y, '0');
                    this.setField(eraser.x - 2, eraser.y, '0');
                }
                eraser.x -= 2;
                break;
            case 'right':
                if (this.getField(eraser.x + 2, eraser.y) === '1') {
                    this.setField(eraser.x + 1, eraser.y, '0');
                    this.setField(eraser.x + 2, eraser.y, '0');
                }
                eraser.x += 2;
                break;
            case 'up':
                if (this.getField(eraser.x, eraser.y - 2) === '1') {
                    this.setField(eraser.x, eraser.y - 1, '0');
                    this.setField(eraser.x, eraser.y - 2, '0');
                }
                eraser.y -= 2
                break;
            case 'down':
                if (this.getField(eraser.x, eraser.y + 2) === '1') {
                    this.setField(eraser.x, eraser.y + 1, '0');
                    this.setField(eraser.x, eraser.y + 2, '0');
                }
                eraser.y += 2;
                break;
        }
    }

    generateLabyrinth() {
        for (let y = 0; y < this.map.length; y++)
            for (let x = 0; x < this.map[y].length; x++)
                this.setField(x, y, '1');

        // выбираем случайным образом чётные координаты на карте с лабиринтом
        const startX = this.getRandomFrom(Array(cols).fill(0).map((item, index) => index).filter(x => this.isEven(x)));
        const startY = this.getRandomFrom(Array(rows).fill(0).map((item, index) => index).filter(y => this.isEven(y)));

        let eraser = {};
        eraser.x = startX;
        eraser.y = startY;

        this.setField(startX, startY, '0');

        while (!this.isLabyrinth())
            this.move(eraser);

        return this.map;
    }

    init() {
        layer1.width = cols * squareSide;
        layer1.height = rows * squareSide;

        context1.clearRect(0, 0, layer1.width, layer1.height);

        context1.fillStyle = 'black';
        context1.rect(0, 0, layer1.width, layer1.height);
        context1.fill();

        context1.fillStyle = '#858080';
        context1.beginPath();
        context1.rect(0, 0, layer1.width, layer1.height);
        context1.fill();
    }

    drawMap() {
        this.answerMap = new Array(128);
        for (let i = 0; i < this.answerMap.length; i++) {
            this.answerMap[i] = new Array(128);
            for (let j = 0; j < this.answerMap[i].length; j++) {
                this.answerMap[i][j] = new Cell();
            }
        }
        for (let y = 0; y < rows; y++)
            for (let x = 0; x < cols; x++)
                if (this.getField(x, y) === '1') {
                    context1.fillStyle = '#1f1f1f';
                    context1.beginPath();
                    context1.rect(x * squareSide, y * squareSide, squareSide, squareSide);
                    context1.fill();
                    for(let k = 0; k < squareSide / square; k++)
                        for(let l = 0; l < squareSide / square; l++)
                            this.answerMap[y * squareSide / square + k][x * squareSide / square + l].wall = true;
                }

        extraCtx1.clearRect(0, 0, layer1.width, layer1.height);
        extraCtx1.drawImage(layer1, 0, 0);
        //return this.answerMap;
    }
}










