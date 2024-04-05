import {} from "./labyrinth.js";
import {Model} from "./model.js";
import {View} from "./view.js";
import {Control} from "./control.js";
import {Ant, Cell, Colony} from "./objects.js";

// read coordinates from control
let colonyX = 500;
let colonyY = 500;

// read from control
let antsCount = 100;

export let availableFields = 8;
const alpha = 1;
export let step = 3;
export let speed = 1;
export let rows = 640;
export let cols = 640;



export function initMap() {
    let map = new Array(rows);
    for (let i = 0; i < map.length; i++) {
        map[i] = new Array(cols);
        for (let j = 0; j < map[i].length; j++)
            map[i][j] = new Cell();
    }
    return map;
}

export function getNearFields(ant, pheromones) {

    function isFieldValid(x, y) {
        return x > 0 && x < cols && y > 0 && y < rows;
    }

    let toFoodPheromone = new Array(availableFields);

    for (let j = 0; j < toFoodPheromone.length; j++) {
        let pheromoneX;
        let pheromoneY;
        let b;
        if(j === 0) {
            pheromoneX = ant.location.x - step;
            pheromoneY = ant.location.y - step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 1) {
            pheromoneX = ant.location.x;
            pheromoneY = ant.location.y - step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 2) {
            pheromoneX = ant.location.x + step;
            pheromoneY = ant.location.y - step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 3) {
            pheromoneX = ant.location.x - step;
            pheromoneY = ant.location.y;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 4) {
            pheromoneX = ant.location.x + step;
            pheromoneY = ant.location.y;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 5) {
            pheromoneX = ant.location.x - step;
            pheromoneY = ant.location.y + step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 6) {
            pheromoneX = ant.location.x;
            pheromoneY = ant.location.y + step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        else if(j === 7) {
            pheromoneX = ant.location.x + step;
            pheromoneY = ant.location.y + step;
            b = isFieldValid(pheromoneX, pheromoneY);
        }
        if(!b) {
            toFoodPheromone[j] = 0;
        }
        else toFoodPheromone[j] = pheromones[pheromoneY][pheromoneX].toFood;
    }
    return toFoodPheromone;
}

export function initColony(colonyX, colonyY) {
    return new Colony(colonyX, colonyY);
}

export function initAnts(colony) {
    let ants = new Array(antsCount);
    let direction;

    for (let i = 0; i < ants.length; i++) {
        do {
            direction = Math.floor(Math.random() * 10);
        } while (direction > 7);
        ants[i] = new Ant(direction, colony);
    }
    return ants;
}



export let map = initMap();

// if user pressed button read from control
export let colony = initColony(colonyX, colonyY);
export let ants = initAnts(colony);

export var view;
export var model;
let control;

window.onload = () => {
    model = new Model();
    view = new View();
    control = new Control();
}
