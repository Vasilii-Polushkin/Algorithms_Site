import {} from "./labyrinth.js";
import {Model} from "./model.js";
import {View} from "./view.js";
import {Control} from "./control.js";
import {Ant, Cell, Colony} from "./objects.js";



// read from control
//export let antsNumber = ;

export let availableFields = 8;
const alpha = 1;
export let step = 3;
export let speed = 1;
export let rows = 640;
export let cols = 640;





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




