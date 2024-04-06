import {cols, getNearFields, rows, speed} from "./main.js";
import {Ant, Cell, Colony} from "./objects.js";

export class Model {
    ants = [];
    map = [];
    colony = new Colony(0,0);

    update() {
        // update ants locations
        for (let i = 0; i < this.ants.length; i++) {
            let delta = this.ants[i].update(getNearFields(this.ants[i], this.map));
            this.ants[i].location.x += delta.x;
            this.ants[i].location.y += delta.y;
        }

        this.colony.update();

        // update map
        // ...
        // walls locations, food locations
        // ...
    }

    initMap() {
        this.map = new Array(rows);
        for (let i = 0; i < this.map.length; i++) {
            this.map[i] = new Array(cols);
            for (let j = 0; j <this. map[i].length; j++)
                this.map[i][j] = new Cell();
        }
    }

    initColony(colonyX, colonyY) {
        this.colony = new Colony(colonyX, colonyY);
    }

    initAnts(antsNumber) {
        this.ants = new Array(antsNumber);
        let direction;

        for (let i = 0; i < this.ants.length; i++) {
            do {
                direction = Math.floor(Math.random() * 10);
            } while (direction > 7);
            this.ants[i] = new Ant(direction, this.colony);
        }
    }

    /*setWall() {
        for(let i = 0; i < ; i++) {
            for(let j = 0; j < ; j++) {
                this.map = ;
            }
        }
    }*/
}


