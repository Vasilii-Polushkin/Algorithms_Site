import { setGenerationsWithoutChanges, setPathLength, setTotalGenerations,
    populationSizeInput,percentToCrossInput,percentToMutateInput,maxGenerationsWithoutChangesInput
    } from "./bindings.js";
import { drawLines, cities } from "./visualisation.js";


function distance(p1: Point, p2: Point): number
{
    return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2) - p1.radius - p2.radius + 14;
}
function calcFittingFunction(genotype: number[], points:Point[]): number
{
    let res = distance(points[genotype[0]], points[genotype.at(-1)]);
    for (let i = 0; i < points.length - 1; ++i)
        res += distance(points[genotype[i]], points[genotype[i + 1]]);
    return res;
}
function decide(probability: number): boolean
{
    return probability > Math.random() * 100;
}
function shuffle(array: any): void
{
    for (let i = array.length - 1; i > 0; i--)
    {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}
function visualize(creature: Creature)
{
    setPathLength(creature.fitting);
    drawLines(creature.genotype);
}
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

    constructor(genotype: number[], points: Point[])
    {
        this.genotype = genotype;
        this.fitting = calcFittingFunction(genotype, points);
    }
}
class algorithmRunner
{
    populationSize: number;
    percentToMutate: number;
    percentToCross: number;
    MaxGenerationsWithoutChanges: number;
    genotypeSize: number;
    points: Point[];
    currPopulation: Creature[];
    isRunning = true;
    
    constructor()
    {
        if (cities.length === 0)
            return;

        const newPoints: Point[] = [];
        cities.forEach((city) => {
            newPoints.push(new Point(city.x, city.y, city.radius));
        })

        this.populationSize = populationSizeInput;
        this.percentToMutate = percentToMutateInput;
        this.percentToCross = percentToCrossInput;
        this.MaxGenerationsWithoutChanges = maxGenerationsWithoutChangesInput;
        this.genotypeSize = newPoints.length;
        this.points = newPoints;
        this.currPopulation = this.getInitialPopulation(this.populationSize);

        this.RunAlgorithm();
    }
    stopRunning()
    {
        this.points = [];
        this.isRunning = false;
    }
    getRandomGeneID(): number
    {
        return Math.floor(Math.random() * this.genotypeSize);
    }
    getRandomGenotype(): number[]
    {
        let genotype = new Array(this.genotypeSize);
        for (let i = 0; i < this.genotypeSize; ++i)
            genotype[i] = i;
        shuffle(genotype);
        return genotype;
    }
    getRandomCreature(): Creature
    {
        return new Creature(this.getRandomGenotype(), this.points);
    }
    getMutatedCreature(creature: Creature): Creature
    {
        let pos1 = this.getRandomGeneID();
        let pos2 = this.getRandomGeneID();

        if (pos1 > pos2) [pos1, pos2] = [pos2, pos1];
        return new Creature(creature.genotype.slice(0, pos1).concat(creature.genotype.slice(pos1, pos2).reverse(), creature.genotype.slice(pos2)), this.points);
    }
    getCrossedCreature(creature1: Creature, creature2: Creature, pivotIndex: number): Creature
    {
        const usedGenes: boolean[] = new Array(this.genotypeSize).fill(false);
        const newGenotype: number[] = [];

        for (let i = 0; i < pivotIndex; ++i)
        {
            const currGene = creature1.genotype[i];
            newGenotype.push(currGene);
            usedGenes[currGene] = true;
        }

        for (let i = pivotIndex; i < this.genotypeSize; ++i)
        {
            const currGene = creature2.genotype[i];
            if (!usedGenes[currGene])
            {
                newGenotype.push(currGene);
                usedGenes[currGene] = true;
            }
        }

        for (let i = pivotIndex; i < this.genotypeSize; ++i)
        {
            const currGene = creature1.genotype[i];
            if (!usedGenes[currGene])
            {
                newGenotype.push(currGene);
                usedGenes[currGene] = true;
            }
        }

        return new Creature(newGenotype, this.points);
    }
    getRandomCreatureID(): number
    {
        let id = Math.floor(Math.random() * this.populationSize);
        return id;
    }
    modifyPopulationOnce(): void
    {
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
    modifyPopulation(): void
    {
        for (let i = 0; i < this.populationSize * this.percentToCross / 100; ++i)
            this.modifyPopulationOnce();
    }
    selectGeneration():void
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
        
        this.currPopulation.sort((crt1, crt2) => crt1.fitting - crt2.fitting);
        this.currPopulation.length = this.populationSize;
    }
    getInitialPopulation(length: number): Creature[]
    {
        let newPopulation:Creature[] = new Array(length);
        for (let i = 0; i < length; ++i)
            newPopulation[i] = this.getRandomCreature();
        newPopulation.sort((crt1, crt2) => crt1.fitting - crt2.fitting);
        return newPopulation;
    }
    
    RunAlgorithm()
    {
        let generationsWithoutChanges:number = 0;
        let prevBestFitting:number = 0;
        let currGeneration:number = 0;

        const mainLoop = function(owner: algorithmRunner)
        {
            if (generationsWithoutChanges > owner.MaxGenerationsWithoutChanges)
            {
                drawLines(owner.currPopulation[0].genotype, "rgb(226, 147, 3)");
                return;
            }

            if (owner.isRunning === false)
                return;

            setGenerationsWithoutChanges(generationsWithoutChanges);
            setTotalGenerations(currGeneration);

            if (prevBestFitting === owner.currPopulation[0].fitting)
            {
                generationsWithoutChanges++;
            }
            else
            {
                prevBestFitting = owner.currPopulation[0].fitting;
                generationsWithoutChanges = 0;
            }

            visualize(owner.currPopulation[0]);

            owner.modifyPopulation();
            owner.selectGeneration();

            currGeneration++;
            setTimeout(mainLoop, 0, owner);
        }
        mainLoop(this);
    }
}

let runner: algorithmRunner;
export function startPathFinding()
{
    if (runner !== undefined)
        runner.stopRunning();
    runner = new algorithmRunner();
}

export function abortPathFinding()
{
    if (runner !== undefined)
        runner.stopRunning();
    runner = undefined;
}