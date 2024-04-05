import {ants, colony, getNearFields, map, speed} from "./main.js";

export class Model {
    /*constructor() {

    }*/

    update() {
        // update ants locations
        for (let i = 0; i < ants.length; i++) {
            let delta = ants[i].update(getNearFields(ants[i], map));
            ants[i].location.x += delta.x;
            ants[i].location.y += delta.y;
        }

        colony.update();

        // update map
        // ...
        // walls locations, food locations
        // ...
    }
}
