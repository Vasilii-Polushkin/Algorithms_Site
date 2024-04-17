import { setGenerationsWithoutChanges, setPathLength, setTotalGenerations } from "./bindings.js";
import { drawLines } from "./visualisation.js";
const populationSize = 90;
const percentToMutate = 30;
const percentToCross = 40;
// кол-во городов
const genotypeSize = 40;
const points = new Array(genotypeSize);
const currPopulation = new Array(populationSize);
class Point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Creature {
    genotype;
    fitting;
    constructor(genotype) {
        this.genotype = genotype;
        this.fitting = calcFittingFunction(genotype);
    }
}
function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}
function calcFittingFunction(genotype) {
    let res = distance(points[genotype[0]], points[genotype.at(-1)]);
    for (let i = 0; i < genotypeSize - 1; ++i)
        res += distance(points[genotype[i]], points[genotype[i + 1]]);
    return res;
}
function decide(probability) {
    return probability > Math.random() * 100;
}
function getRandomGeneID() {
    return Math.floor(Math.random() * genotypeSize);
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function getRandomGenotype() {
    let genotype = new Array(genotypeSize);
    for (let i = 0; i < genotypeSize; ++i)
        genotype[i] = i;
    shuffle(genotype);
    return genotype;
}
function getRandomCreature() {
    return new Creature(getRandomGenotype());
}
function fillInitualPopulation() {
    for (let i = 0; i < populationSize; ++i)
        currPopulation[i] = getRandomCreature();
}
function mutateOnce(creature) {
    const pos1 = getRandomGeneID();
    const pos2 = getRandomGeneID();
    const temp = creature.genotype[pos1];
    creature.genotype[pos1] = creature.genotype[pos2];
    creature.genotype[pos2] = temp;
}
function mutateNth(creature, n) {
    for (let i = 0; i < n; ++i)
        mutateOnce(creature);
}
function getCrossedCreature(creature1, creature2, pivotIndex) {
    const usedGenes = new Array(genotypeSize).fill(false);
    const newGenotype = [];
    for (let i = 0; i < pivotIndex; ++i) {
        const currGene = creature1.genotype[i];
        newGenotype.push(currGene);
        usedGenes[currGene] = true;
    }
    for (let i = pivotIndex; i < genotypeSize; ++i) {
        const currGene = creature2.genotype[i];
        if (!usedGenes[currGene]) {
            newGenotype.push(currGene);
            usedGenes[currGene] = true;
        }
    }
    for (let i = pivotIndex; i < genotypeSize; ++i) {
        const currGene = creature1.genotype[i];
        if (!usedGenes[currGene]) {
            newGenotype.push(currGene);
            usedGenes[currGene] = true;
        }
    }
    return new Creature(newGenotype);
}
function getRandomCreatureID() {
    return Math.floor(Math.random() * populationSize);
}
function modifyPopulationOnce() {
    const creature1 = currPopulation[getRandomCreatureID()];
    const creature2 = currPopulation[getRandomCreatureID()];
    const pivotIndex = 1 + Math.floor(Math.random() * (genotypeSize - 1));
    let newCreature1 = getCrossedCreature(creature1, creature2, pivotIndex);
    let newCreature2 = getCrossedCreature(creature2, creature1, pivotIndex);
    if (decide(percentToMutate))
        mutateOnce(newCreature1);
    if (decide(percentToMutate))
        mutateOnce(newCreature2);
    currPopulation.push(newCreature1);
    currPopulation.push(newCreature2);
}
function modifyPopulation() {
    for (let i = 0; i < populationSize * percentToCross / 100; ++i)
        modifyPopulationOnce();
}
function selectGeneration() {
    currPopulation.sort((crt1, crt2) => crt1.fitting - crt2.fitting);
    currPopulation.length = populationSize;
}
function generatePoints() {
    for (let i = 0; i < genotypeSize; ++i)
        points[i] = new Point(Math.random() * 100, Math.random() * 100);
}
// algorithm itself
generatePoints();
fillInitualPopulation();
let generationsWithoutChanges = 0;
let prevBestFitting;
let currGeneration = 0;
while (generationsWithoutChanges < 150) {
    setGenerationsWithoutChanges(generationsWithoutChanges);
    setTotalGenerations(currGeneration);
    if (prevBestFitting == currPopulation[0].fitting) {
        generationsWithoutChanges++;
    }
    else {
        prevBestFitting = currPopulation[0].fitting;
        generationsWithoutChanges = 0;
    }
    selectGeneration();
    visualize(currPopulation[0]);
    console.log(currPopulation[0].fitting);
    modifyPopulation();
    currGeneration++;
}
function visualize(creature) {
    setPathLength(creature.fitting);
    drawLines(creature.genotype);
}
//# sourceMappingURL=genetic.js.map