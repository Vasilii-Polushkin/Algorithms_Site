import {view, model} from "./main.js";

const FPS = 40;

export class Control {
    // control, buttons: set colony, set food, set walls, generate labyrinth, pause, clear
    constructor() {
        this.ERASEbtn = document.getElementById('ERASEbtn');
        this.WALLbtn = document.getElementById('WALLbtn');
        this.COLONYbtn = document.getElementById('COLONYbtn');
        this.FOODbtn = document.getElementById('FOODbtn');
        this.PAUSEbtn = document.getElementById('PAUSEbtn');

        //this.ERASEbtn.addEventListener('click', );
        this.CreateLabyrinth = document.getElementById('CreateLabyrinth');
        this.RestartBtn = document.getElementById('RestartBtn');

        //this.CreateLabyrinth.addEventListener('click', this.CreateLabyrinth.bind(this));
        onclick=(e) => this.onClick(e);
        setInterval(() => this.update(), 1000/FPS);
    }

    update() {
        model.update();
        view.draw();
    }

    onClick() {

    }
}