import {init, drawMap} from "./labyrinth.js";
import {View} from "./view.js";
import {Colony} from "./objects.js";
import {Model} from "./model.js";

const FPS = 40;


export let model;
export let view;
export let control;


export class Control {
    // control, buttons: set colony, set food, set walls, generate labyrinth, pause, clear
    constructor() {
        this.initColony = false;
        this.setColony = false;
        this.setLabyrinth = false;

        this.ERASEbtn = document.getElementById('ERASEbtn');
        this.WALLbtn = document.getElementById('WALLbtn');
        this.COLONYbtn = document.getElementById('COLONYbtn');
        this.FOODbtn = document.getElementById('FOODbtn');

        this.antsNumber = document.getElementById('antsNumber');

        this.CreateLabyrinth = document.getElementById('CreateLabyrinth');
        this.RestartBtn = document.getElementById('RestartBtn');
        this.PauseBtn = document.getElementById('PAUSEbtn');

        this.createHandlers();


        setInterval(() => this.update(), 1000 / FPS);
    }

    update() {
        model.update();
        view.draw();
    }

    wallBtnFunc = () => {
        view.layer1.addEventListener('mousedown', this.startWall);
        view.layer1.addEventListener('mouseup', this.stopWall);
        view.layer1.addEventListener('mousemove', this.sketchWall);
    }

    startWall = (e) => {
        this.setWall = true;
        this.getPositionWall(e);
    }

    getPositionWall = (e) => {
        this.x = e.clientX - view.layer2.offsetLeft;
        this.y = e.clientY - view.layer2.offsetTop;
    }

    sketchWall = (e) => {
        this.getPositionWall(e);
    }

    stopWall = () => {
        this.setWall = false;
    }

    colonyBtnFunc = () => {
        view.layer1.addEventListener('mousemove', this.mouseMoveColony);
    }

    mouseMoveColony = (e) => {
        let x = e.clientX - view.layer1.offsetLeft;
        let y = e.clientY - view.layer1.offsetTop;
        this.initColony = true;
        model.initColony(x, y);
        view.layer1.addEventListener('click', this.setColonyFunc);
    }

    setColonyFunc = () => {
        view.layer1.removeEventListener('mousemove', this.mouseMoveColony, false);
        this.COLONYbtn.removeEventListener('click', this.colonyBtnFunc, false);
        this.setColony = true;
        model.initAnts(parseInt(this.antsNumber.textContent));
        view.layer1.removeEventListener('click', this.setColonyFunc, false);
    }

    createHandlers() {
        this.WALLbtn.addEventListener('click', this.wallBtnFunc);
        this.COLONYbtn.addEventListener('click', this.colonyBtnFunc);


        let antsNumberInput = document.getElementById('antsNumberRange');
        this.antsNumber.textContent = antsNumberInput.value;

        antsNumberInput.addEventListener('input', (e) => {
            this.antsNumber.textContent = e.target.value;
        });


        this.CreateLabyrinth.addEventListener('click', e => {
            this.setLabyrinth = true;
            view.init();
        }, false);

        this.RestartBtn.addEventListener('click', e => {
            this.initColony = false;
            this.setColony = false;
            this.setLabyrinth = false;
            model = new Model();
            model.initMap();
            view = new View();
            view.init();
            this.createHandlers();
        }, false);
    }
}


window.onload = () => {
    model = new Model();
    model.initMap();
    control = new Control();
    view = new View();
    view.init();
}