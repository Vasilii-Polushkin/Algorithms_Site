import { setGenerationsWithoutChanges, setPathLength, setTotalGenerations, populationSizeInput, percentToCrossInput, percentToMutateInput, maxGenerationsWithoutChangesInput } from "./bindings.js";
import { drawLines, cities } from "./visualisation.js";
/* --------------------------------------------------------------------------------- *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UTILS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ *
 * --------------------------------------------------------------------------------- */
const FINAL_PATH_ORANGE = "rgb(226, 147, 3)";
function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2) - p1.radius - p2.radius + 14;
}
function calcFittingFunction(genotype, points) {
    let res = distance(points[genotype[0]], points[genotype.at(-1)]);
    for (let i = 0; i < points.length - 1; ++i)
        res += distance(points[genotype[i]], points[genotype[i + 1]]);
    return res;
}
function decide(probability) {
    return probability > Math.random() * 100;
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function visualize(creature) {
    setPathLength(creature.fitting);
    drawLines(creature.genotype);
}
class Point {
    x;
    y;
    radius;
    constructor(x, y, radius) {
        this.radius = radius;
        this.x = x;
        this.y = y;
    }
}
class Creature {
    genotype;
    fitting;
    constructor(genotype, points) {
        this.genotype = genotype;
        this.fitting = calcFittingFunction(genotype, points);
    }
}
/* --------------------------------------------------------------------------------- *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~ ALGORITHM IMPLEMENTATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ *
 * --------------------------------------------------------------------------------- */
class algorithmRunner {
    populationSize;
    percentToMutate;
    percentToCross;
    MaxGenerationsWithoutChanges;
    genotypeSize;
    points;
    currPopulation;
    isRunning = true;
    bestCreaturesBuffer = [];
    constructor() {
        if (cities.length === 0)
            return;
        const newPoints = [];
        cities.forEach((city) => {
            newPoints.push(new Point(city.x, city.y, city.radius));
        });
        this.populationSize = populationSizeInput;
        this.percentToMutate = percentToMutateInput;
        this.percentToCross = percentToCrossInput;
        this.MaxGenerationsWithoutChanges = maxGenerationsWithoutChangesInput;
        this.genotypeSize = newPoints.length;
        this.points = newPoints;
        this.currPopulation = this.getInitialPopulation(this.populationSize);
        this.RunAlgorithm();
    }
    stopRunning() {
        this.points = [];
        this.isRunning = false;
    }
    getRandomGeneID() {
        return Math.floor(Math.random() * this.genotypeSize);
    }
    getRandomGenotype() {
        let genotype = new Array(this.genotypeSize);
        for (let i = 0; i < this.genotypeSize; ++i)
            genotype[i] = i;
        shuffle(genotype);
        return genotype;
    }
    getRandomCreature() {
        return new Creature(this.getRandomGenotype(), this.points);
    }
    getMutatedCreature(creature) {
        let pos1 = this.getRandomGeneID();
        let pos2 = this.getRandomGeneID();
        if (pos1 > pos2)
            [pos1, pos2] = [pos2, pos1];
        return new Creature(creature.genotype.slice(0, pos1).concat(creature.genotype.slice(pos1, pos2).reverse(), creature.genotype.slice(pos2)), this.points);
    }
    getCrossedCreature(creature1, creature2, pivotIndex) {
        const usedGenes = new Array(this.genotypeSize).fill(false);
        const newGenotype = [];
        for (let i = 0; i < pivotIndex; ++i) {
            const currGene = creature1.genotype[i];
            newGenotype.push(currGene);
            usedGenes[currGene] = true;
        }
        for (let i = pivotIndex; i < this.genotypeSize; ++i) {
            const currGene = creature2.genotype[i];
            if (!usedGenes[currGene]) {
                newGenotype.push(currGene);
                usedGenes[currGene] = true;
            }
        }
        for (let i = pivotIndex; i < this.genotypeSize; ++i) {
            const currGene = creature1.genotype[i];
            if (!usedGenes[currGene]) {
                newGenotype.push(currGene);
                usedGenes[currGene] = true;
            }
        }
        return new Creature(newGenotype, this.points);
    }
    getRandomCreatureID() {
        let id = Math.floor(Math.random() * this.populationSize);
        return id;
    }
    modifyPopulationOnce() {
        const creature1 = this.currPopulation[this.getRandomCreatureID()];
        const creature2 = this.currPopulation[this.getRandomCreatureID()];
        const pivotIndex = 1 + Math.floor(Math.random() * (this.genotypeSize - 1));
        let newCreature1 = this.getCrossedCreature(creature1, creature2, pivotIndex);
        let newCreature2 = this.getCrossedCreature(creature2, creature1, pivotIndex);
        if (decide(this.percentToMutate))
            newCreature1 = this.getMutatedCreature(newCreature1);
        if (decide(this.percentToMutate))
            newCreature2 = this.getMutatedCreature(newCreature2);
        this.currPopulation.push(newCreature1);
        this.currPopulation.push(newCreature2);
    }
    modifyPopulation() {
        for (let i = 0; i < this.populationSize * this.percentToCross / 100; ++i)
            this.modifyPopulationOnce();
    }
    selectGeneration() {
        this.currPopulation.sort((crt1, crt2) => crt1.fitting - crt2.fitting);
        this.currPopulation.length = this.populationSize;
    }
    getInitialPopulation(length) {
        let newPopulation = new Array(length);
        for (let i = 0; i < length; ++i)
            newPopulation[i] = this.getRandomCreature();
        newPopulation.sort((crt1, crt2) => crt1.fitting - crt2.fitting);
        return newPopulation;
    }
    RunAlgorithm() {
        let generationsWithoutChanges = 0;
        let prevBestFitting = 0;
        let currGeneration = 0;
        const algorithmLoop = function (owner) {
            if (generationsWithoutChanges > owner.MaxGenerationsWithoutChanges) {
                drawLines(owner.currPopulation[0].genotype, FINAL_PATH_ORANGE);
                return;
            }
            if (owner.isRunning === false)
                return;
            setGenerationsWithoutChanges(generationsWithoutChanges);
            setTotalGenerations(currGeneration);
            if (prevBestFitting === owner.currPopulation[0].fitting) {
                generationsWithoutChanges++;
            }
            else {
                prevBestFitting = owner.currPopulation[0].fitting;
                generationsWithoutChanges = 0;
            }
            visualize(owner.currPopulation[0]);
            owner.modifyPopulation();
            owner.selectGeneration();
            currGeneration++;
            owner.bestCreaturesBuffer.push(structuredClone(owner.currPopulation[0]));
            setTimeout(algorithmLoop, 0, owner);
        };
        algorithmLoop(this);
    }
}
/* --------------------------------------------------------------------------------- *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ALGORITHM RUNNER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ *
 * --------------------------------------------------------------------------------- */
let runner;
export function startPathFinding() {
    if (runner !== undefined)
        runner.stopRunning();
    runner = new algorithmRunner();
}
export function abortPathFinding() {
    if (runner !== undefined)
        runner.stopRunning();
    runner = undefined;
}
export function visualizeNthGenerationBestCreature(n) {
    if (runner !== undefined)
        visualize(runner.bestCreaturesBuffer[n]);
}
//# sourceMappingURL=genetic.js.map