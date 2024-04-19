import { setGenerationsWithoutChanges, setPathLength, setTotalGenerations,
    populationSizeInput,percentToCrossInput,percentToMutateInput,maxGenerationsWithoutChangesInput
    } from "./bindings.js";
import { drawLines, cities } from "./visualisation.js";

export class algorithmRunner
{
isRunning = true;
stopRunning()
{
    this.isRunning = false;
}
constructor()
{

this.isRunning = true;

if (cities.length == 0)
    return;
class Point
{
    x:number;
    y:number;
    radius:number;
    constructor(x:number, y:number, radius:number)
    {
        this.radius = radius;
        this.x = x;
        this.y = y;
    }
}
class Creature
{
    genotype: number[];
    fitting: number;

    constructor(genotype: number[])
    {
        this.genotype = genotype;
        this.fitting = calcFittingFunction(genotype);
    }
}

const newPoints: Point[] = [];
cities.forEach((city) => {
    newPoints.push(new Point(city.x, city.y, city.radius));
})

const populationSize = populationSizeInput;
const percentToMutate = percentToMutateInput;
const percentToCross = percentToCrossInput;
const MaxGenerationsWithoutChanges = maxGenerationsWithoutChangesInput;
// кол-во городов
const genotypeSize = newPoints.length;
const points: Point[] = newPoints;

let currPopulation: Creature[] = new Array(populationSize);

function distance(p1: Point, p2: Point): number
{
    return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2) - p1.radius - p2.radius + 14;
}

function calcFittingFunction(genotype: number[]): number
{
    let res = distance(points[genotype[0]], points[genotype.at(-1)]);
    for (let i = 0; i < genotypeSize - 1; ++i)
        res += distance(points[genotype[i]], points[genotype[i + 1]]);
    return res;
}

function decide(probability: number): boolean
{
    return probability > Math.random() * 100;
}

function getRandomGeneID(): number
{
    return Math.floor(Math.random() * genotypeSize);
}

function shuffle(array: any): void
{
    for (let i = array.length - 1; i > 0; i--)
    {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomGenotype(): number[]
{
    let genotype = new Array(genotypeSize);
    for (let i = 0; i < genotypeSize; ++i)
        genotype[i] = i;
    shuffle(genotype);
    return genotype;
}

function getRandomCreature(): Creature
{
    return new Creature(getRandomGenotype());
}

function fillInitualPopulation(): void
{
    for (let i = 0; i < populationSize; ++i)
        currPopulation[i] = getRandomCreature();
    currPopulation.sort((crt1, crt2) => crt1.fitting - crt2.fitting);
}

function getMutatedCreature(creature: Creature): Creature
{
    let pos1 = getRandomGeneID();
    let pos2 = getRandomGeneID();

    if (pos1 > pos2) [pos1, pos2] = [pos2, pos1];
    return new Creature(creature.genotype.slice(0, pos1).concat(creature.genotype.slice(pos1, pos2).reverse(), creature.genotype.slice(pos2)));
}

function getCrossedCreature(creature1: Creature, creature2: Creature, pivotIndex: number): Creature
{
    const usedGenes: boolean[] = new Array(genotypeSize).fill(false);
    const newGenotype: number[] = [];

    for (let i = 0; i < pivotIndex; ++i)
    {
        const currGene = creature1.genotype[i];
        newGenotype.push(currGene);
        usedGenes[currGene] = true;
    }

    for (let i = pivotIndex; i < genotypeSize; ++i)
    {
        const currGene = creature2.genotype[i];
        if (!usedGenes[currGene])
        {
            newGenotype.push(currGene);
            usedGenes[currGene] = true;
        }
    }

    for (let i = pivotIndex; i < genotypeSize; ++i)
    {
        const currGene = creature1.genotype[i];
        if (!usedGenes[currGene])
        {
            newGenotype.push(currGene);
            usedGenes[currGene] = true;
        }
    }

    return new Creature(newGenotype);
}

function getRandomCreatureID(): number
{
    let id = Math.floor(Math.random() * populationSize);
    return id;
}

function modifyPopulationOnce(): void
{
    const creature1 = currPopulation[getRandomCreatureID()];
    const creature2 = currPopulation[getRandomCreatureID()];

    const pivotIndex = 1 + Math.floor(Math.random() * (genotypeSize - 1));
    let newCreature1 = getCrossedCreature(creature1, creature2, pivotIndex);
    let newCreature2 = getCrossedCreature(creature2, creature1, pivotIndex);

    if (decide(percentToMutate))
        newCreature1 = getMutatedCreature(newCreature1);
    
    if (decide(percentToMutate))
        newCreature2 = getMutatedCreature(newCreature2);

    currPopulation.push(newCreature1);
    currPopulation.push(newCreature2);
}

function modifyPopulation(): void
{
    for (let i = 0; i < populationSize * percentToCross / 100; ++i)
        modifyPopulationOnce();
}

function selectGeneration():void
{
    /*
    let indexesToDelete = new Object;
    let totalFitting = 0;

    for (let i = 1; i < populationSize; ++i)
        totalFitting += currPopulation[i].fitting;

    for (let i = 1; i < populationSize; ++i)
        if (decide(currPopulation[i].fitting/totalFitting * 100))
            indexesToDelete[i] = true;

    let newPopulation: Creature[] = [];

    for (let i = 0; i < currPopulation.length; ++i)
        if (indexesToDelete[i] != true)
            newPopulation.push(currPopulation[i]);

    newPopulation.sort((crt1, crt2) => crt1.fitting - crt2.fitting);

    while (newPopulation.length < populationSize)
    {
        newPopulation.push(getRandomCreature());
        console.log("Better Set More Cross Percenage")
    }
    newPopulation.length = populationSize;
    currPopulation = newPopulation;*/

    
    //simpler selector
    
    currPopulation.sort((crt1, crt2) => crt1.fitting - crt2.fitting);
    currPopulation.length = populationSize;
}

// algorithm itself
fillInitualPopulation();

let generationsWithoutChanges = 0;
let prevBestFitting: number;
let currGeneration = 0;

function mainLoop()
{
    if (generationsWithoutChanges > MaxGenerationsWithoutChanges)
    {
        drawLines(currPopulation[0].genotype, "rgb(226, 147, 3)");
        return;
    }

    if (this.isRunning == false)
        return;

    setGenerationsWithoutChanges(generationsWithoutChanges);
    setTotalGenerations(currGeneration);

    if (prevBestFitting == currPopulation[0].fitting)
    {
        generationsWithoutChanges++;
    }
    else
    {
        prevBestFitting = currPopulation[0].fitting;
        generationsWithoutChanges = 0;
    }

    visualize(currPopulation[0]);

    modifyPopulation();
    selectGeneration();

    currGeneration++;
    setTimeout(mainLoop, 0);
}
setTimeout(mainLoop, 1000/60);

function visualize(creature: Creature)
{
    setPathLength(creature.fitting);
    drawLines(creature.genotype);
}

}
}