import {generateLabyrinth, getField} from "./labyrinth.js";
import {initAnts, initColony, initPheromones, getNearPheromones} from "./main.js";
import {View} from "./view.js";
import {Control} from "./control.js";

export let rows = 700;
export let cols = 700;
export let squareSide = 7;
export let squareRows = rows / squareSide;
export let squareCols = cols / squareSide;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

export let map = new Array(squareRows);

for (let i = 0; i < map.length; i++) {
    map[i] = new Array(squareCols);
    for (let j = 0; j < map[i].length; j++) {
        map[i][j] = new Array(squareSide * squareSide);
    }
}

map = generateLabyrinth();

function init() {
    canvas.width = cols * squareSide;
    canvas.height = rows * squareSide;

    context.fillStyle = 'black';
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();

    context.fillStyle = '#858080';
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
}

function drawMap() {
    for (let x = 0; x < cols; x++)
        for (let y = 0; y < rows; y++)
            if (getField(Math.floor(x / squareSide), Math.floor(y / squareSide)) === '1') {
                context.fillStyle = '#000';
                context.beginPath();
                context.rect(x * squareSide, y * squareSide, squareSide, squareSide);
                context.fill();
            }
}

//init();
//drawMap();

let colony = initColony(350, 350);
export let ants = initAnts(colony);
export let pheromones = initPheromones();

export var view;
var control;

window.onload = () => {
    view = new View();
    control = new Control();
}