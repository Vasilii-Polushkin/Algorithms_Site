import {View} from "./view.js";
import {vision} from "./objects.js";
import {Model, currFPS, square} from "./model.js";


export let model;
export let view;
export let control;

let FPS = 40;


export let rows = 640;
export let cols = 640;


export function isFieldValid(x, y) {
    return x >= 0 && x < (cols / square) && y >= 0 && y < (rows / square) && !model.map[y][x].wall;
}

export function getNearFields(ant, allPheromones) {

    let pheromones = new Array(vision);
    for (let i = 0; i < pheromones.length; i++) {
        pheromones[i] = new Array(vision);
    }

    for (let i = 0; i < pheromones.length; i++) {

        for (let j = 0; j < pheromones[i].length; j++) {
            let pheromoneY = i - pheromones.length;
            let pheromoneX = j - (pheromones[i].length - 1) / 2;

            switch (ant.direction) {
                case 0: {
                    break;
                }
                case 1: {
                    let temp = pheromoneX;
                    pheromoneX = pheromoneY;
                    pheromoneY = -temp;
                    break;
                }
                case 2: {
                    let temp = pheromoneY;
                    pheromoneY = pheromoneX;
                    pheromoneX = -temp;
                    break;
                }
                case 3: {
                    pheromoneX *= -1;
                    pheromoneY *= -1;
                    break;
                }
            }

            let x = Math.floor(ant.location.x / square);
            let y = Math.floor(ant.location.y / square);

            if (!isFieldValid(x + pheromoneX, y + pheromoneY)) {
                pheromones[i][j] = 0;
            } else {
                if (!ant.target) {
                    if(allPheromones[y + pheromoneY][x + pheromoneX].food.saturation !== 0) pheromones[i][j] = -100;
                    else pheromones[i][j] = allPheromones[y + pheromoneY][x + pheromoneX].toFood;
                }
                else {
                    if(allPheromones[y + pheromoneY][x + pheromoneX].colony) pheromones[i][j] = -100;
                    else pheromones[i][j] = allPheromones[y + pheromoneY][x + pheromoneX].toHome;
                }
            }
        }
    }

    return pheromones;
}


export class Control {
    interval;

    constructor() {
        this.mouseState = 'ERASER';
        this.pause = false;

        this.initColony = false;
        this.setColony = false;
        this.setLabyrinth = false;
        this.setWall = false;
        this.eraserWorks = false;
        this.setFood = false;
        this.x = 0;
        this.y = 0;

        this.ERASEbtn = document.getElementById('ERASEbtn');
        this.WALLbtn = document.getElementById('WALLbtn');
        this.COLONYbtn = document.getElementById('COLONYbtn');
        this.FOODbtn = document.getElementById('FOODbtn');

        this.antsNumber = document.getElementById('antsNumber');
        this.brushSize = document.getElementById('brushSize');
        this.antsSpeed = document.getElementById('antsSpeed');

        this.CreateLabyrinth = document.getElementById('CreateLabyrinth');
        this.RestartBtn = document.getElementById('RestartBtn');
        this.PauseBtn = document.getElementById('PauseBtn');
        this.PauseBtn.innerHTML = 'Pause';

        this.createHandlers();
    }

    update() {
        clearInterval(this.interval);
        if (!this.pause)
            model.update();
        view.draw();
        FPS = currFPS;
        this.interval = setInterval(() => this.update(), 1000 / FPS);
    }

    start = (e) => {
        if (this.mouseState === 'ERASER') {
            this.eraserWorks = true;
            this.setWall = false;
            this.setFood = false;
        }
        if (this.mouseState === 'WALL') {
            this.eraserWorks = false;
            this.setWall = true;
            this.setFood = false;
        }
        if (this.mouseState === 'FOOD') {
            this.eraserWorks = false;
            this.setWall = false;
            this.setFood = true;
        }

        this.getPosition(e);

        let x = Math.floor(this.x / square);
        let y = Math.floor(this.y / square);
        if (this.eraserWorks) model.set(x, y, false, false);
        if (this.setWall) model.set(x, y, true, false);
        if (this.setFood) model.set(x, y, false, true);
    }

    stop = () => {
        if (this.mouseState === 'ERASER') this.eraserWorks = false;
        if (this.mouseState === 'WALL') this.setWall = false;
        if (this.mouseState === 'FOOD') this.setFood = false;
    }

    sketch = (e) => {
        this.getPosition(e);
        let x = Math.floor(this.x / square);
        let y = Math.floor(this.y / square);
        if (this.eraserWorks) model.set(x, y, false, false);
        if (this.setWall) model.set(x, y, true, false);
        if (this.setFood) model.set(x, y, false, true);
    }

    eraserState = () => {
        this.mouseState = 'ERASER';
    }

    wallState = () => {
        this.mouseState = 'WALL';
    }

    foodState = () => {
        this.mouseState = 'FOOD';
    }

    getPosition = (e) => {
        this.x = e.clientX - view.layer1.offsetLeft;
        this.y = e.clientY - view.layer1.offsetTop;
    }

    colonyBtnFunc = () => {
        this.mouseState = 'COLONY';
        if (!this.setColony)
            view.layer1.addEventListener('mousemove', this.mouseMoveColony);
    }

    mouseMoveColony = (e) => {
        //if (this.mouseState !== 'COLONY') return;
        this.initColony = true;
        view.layer1.addEventListener('click', this.setColonyFunc);
        view.layer1.addEventListener('mouseout', this.mouseOutColony);
        /* if (this.mouseState !== 'COLONY') {
             this.setColony = false;
             this.initColony = false;
         }*/
    }

    mouseOutColony = (e) => {
        this.initColony = false;
        this.setColony = false;
    }

    setColonyFunc = (e) => {
        if (this.mouseState !== 'COLONY') return;
        view.layer1.removeEventListener('mousemove', this.mouseMoveColony, false);
        this.initColony = false;
        this.setColony = true;
        model.initColony(Math.floor(this.x / square), Math.floor(this.y / square));
        model.initAnts(parseInt(this.antsNumber.textContent));
        view.layer1.removeEventListener('click', this.setColonyFunc, false);
        view.layer1.removeEventListener('mouseout', this.mouseOutColony, false);
    }

    createHandlers() {
        document.addEventListener('mousedown', this.start);
        document.addEventListener('mouseup', this.stop);
        document.addEventListener('mousemove', this.sketch);

        this.ERASEbtn.onclick = this.eraserState;
        this.WALLbtn.onclick = this.wallState;
        this.COLONYbtn.addEventListener('click', this.colonyBtnFunc);
        this.FOODbtn.onclick = this.foodState;

        let brushSizeInput = document.getElementById('brushSizeRange');
        this.brushSize.textContent = brushSizeInput.value;

        brushSizeInput.addEventListener('input', (e) => {
            this.brushSize.textContent = e.target.value;
        });


        let antsNumberInput = document.getElementById('antsNumberRange');
        this.antsNumber.textContent = antsNumberInput.value;

        antsNumberInput.addEventListener('input', (e) => {
            this.antsNumber.textContent = e.target.value;
        });

        let antsSpeedInput = document.getElementById('antsSpeedRange');
        this.antsSpeed.textContent = antsSpeedInput.value;

        antsSpeedInput.addEventListener('input', (e) => {
            this.antsSpeed.textContent = e.target.value;
        });


        this.CreateLabyrinth.addEventListener('click', e => {
            this.initColony = false;
            this.setColony = false;
            this.setLabyrinth = true;
            model = new Model();
            model.initMap();
            view = new View();
            view.init();
            this.PauseBtn.innerHTML = 'Pause';
            this.pause = false;
        }, false);

        this.RestartBtn.addEventListener('click', e => {
            this.initColony = false;
            this.setColony = false;
            this.setLabyrinth = false;
            model = new Model();
            model.initMap();
            view = new View();
            view.init();
            this.PauseBtn.innerHTML = 'Pause';
            this.pause = false;
        }, false);

        this.PauseBtn.addEventListener('click', e => {
            if (this.PauseBtn.innerHTML === 'Pause') {
                this.PauseBtn.innerHTML = 'Start';
                this.pause = true;
            } else {
                this.PauseBtn.innerHTML = 'Pause';
                this.pause = false;
            }
        }, false);
    }
}


window.onload = () => {
    model = new Model();
    model.initMap();
    control = new Control();
    view = new View();
    view.init();
    control.update();
}

