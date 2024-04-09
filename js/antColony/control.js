import {View} from "./view.js";
import {Model, step, currFPS} from "./model.js";


export let model;
export let view;
export let control;

let FPS = 40;


export let availableFields = 8;
export let rows = 650;
export let cols = 650;


export function isFieldValid(x, y) {
    return x > 0 && x < cols && y > 0 && y < rows && !model.map[y][x].wall;
}

export function getNearFields(ant, pheromones) {

    let toFoodPheromone = new Array(availableFields);

    for (let j = 0; j < toFoodPheromone.length; j++) {
        let pheromoneX;
        let pheromoneY;
        let b;
        if (j === 0) {
            pheromoneX = ant.location.x - step;
            pheromoneY = ant.location.y - step;
            b = isFieldValid(pheromoneX, pheromoneY);
        } else if (j === 1) {
            pheromoneX = ant.location.x;
            pheromoneY = ant.location.y - step;
            b = isFieldValid(pheromoneX, pheromoneY);
        } else if (j === 2) {
            pheromoneX = ant.location.x + step;
            pheromoneY = ant.location.y - step;
            b = isFieldValid(pheromoneX, pheromoneY);
        } else if (j === 3) {
            pheromoneX = ant.location.x - step;
            pheromoneY = ant.location.y;
            b = isFieldValid(pheromoneX, pheromoneY);
        } else if (j === 4) {
            pheromoneX = ant.location.x + step;
            pheromoneY = ant.location.y;
            b = isFieldValid(pheromoneX, pheromoneY);
        } else if (j === 5) {
            pheromoneX = ant.location.x - step;
            pheromoneY = ant.location.y + step;
            b = isFieldValid(pheromoneX, pheromoneY);
        } else if (j === 6) {
            pheromoneX = ant.location.x;
            pheromoneY = ant.location.y + step;
            b = isFieldValid(pheromoneX, pheromoneY);
        } else if (j === 7) {
            pheromoneX = ant.location.x + step;
            pheromoneY = ant.location.y + step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        if (!b) {
            toFoodPheromone[j] = 0;
        } else toFoodPheromone[j] = pheromones[pheromoneY][pheromoneX].toFood;
    }
    return toFoodPheromone;
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
        if (!this.pause) model.update();
        view.draw();
        FPS = currFPS;
        this.interval = setInterval(() => this.update(), 1000 / FPS);
    }

    start = (e) => {
        if(this.mouseState === 'ERASER') {
            this.eraserWorks = true;
            this.setWall = false;
        }
        if(this.mouseState === 'WALL') {
            this.eraserWorks = false;
            this.setWall = true;
        }

        this.getPosition(e);
    }

    stop = () => {
        if(this.mouseState === 'ERASER') this.eraserWorks = false;
        if(this.mouseState === 'WALL') this.setWall = false;
    }

    sketch = (e) => {
        this.getPosition(e);
        if(this.eraserWorks) model.set(this.x, this.y, false);
        if(this.setWall) model.set(this.x, this.y, true);
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
        if (this.mouseState !== 'COLONY') return;
        let x = e.clientX - view.layer1.offsetLeft;
        let y = e.clientY - view.layer1.offsetTop;
        this.initColony = true;
        model.initColony(x, y);
        view.layer1.addEventListener('click', this.setColonyFunc);
        view.layer1.addEventListener('mouseout', this.mouseOutColony);
        if (this.mouseState !== 'COLONY') {
            this.setColony = false;
            this.initColony = false;
        }
    }

    mouseOutColony = (e) => {
        this.initColony = false;
        this.setColony = false;
    }

    setColonyFunc = () => {
        view.layer1.removeEventListener('mousemove', this.mouseMoveColony, false);
        this.initColony = false;
        this.setColony = true;
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

