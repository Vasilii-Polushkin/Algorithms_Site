import { setGenerationsWithoutChanges, setPathLength, setTotalGenerations } from "./bindings.js";
import { drawLines } from "./visualisation.js";

const populationSize = 90;
const percentToMutate = 30;
const percentToCross = 40;
// кол-во городов
const genotypeSize = 40;

const points: Point[] = new Array(genotypeSize);
const currPopulation: Creature[] = new Array(populationSize);

class Point
{
    x:number;
    y:number;
    constructor(x:number, y:number)
    {
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

function distance(p1: Point, p2: Point): number
{
    return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
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
}

function mutateOnce(creature: Creature): void
{
    const pos1 = getRandomGeneID();
    const pos2 = getRandomGeneID();

    const temp = creature.genotype[pos1];
    creature.genotype[pos1] = creature.genotype[pos2];
    creature.genotype[pos2] = temp;
}

function mutateNth(creature: Creature, n: number): void
{
    for (let i = 0; i < n; ++i)
        mutateOnce(creature);
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
    return Math.floor(Math.random() * populationSize);
}

function modifyPopulationOnce(): void
{
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

function modifyPopulation(): void
{
    for (let i = 0; i < populationSize * percentToCross / 100; ++i)
        modifyPopulationOnce();
}

function selectGeneration():void
{
    currPopulation.sort((crt1, crt2) => crt1.fitting - crt2.fitting);
    currPopulation.length = populationSize;
}

function generatePoints(): void
{
    for (let i = 0; i < genotypeSize; ++i)
        points[i] = new Point(Math.random()*100, Math.random()*100);
}

// algorithm itself
generatePoints();
fillInitualPopulation();

let generationsWithoutChanges = 0;
let prevBestFitting: number;
let currGeneration = 0;

while (generationsWithoutChanges < 150)
{
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

    selectGeneration();
    visualize(currPopulation[0]);
    console.log(currPopulation[0].fitting);
    modifyPopulation();

    currGeneration++;
}

function visualize(creature: Creature)
{
    setPathLength(creature.fitting);
    drawLines(creature.genotype);
}