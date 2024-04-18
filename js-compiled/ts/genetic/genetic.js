import { setGenerationsWithoutChanges, setPathLength, setTotalGenerations, populationSizeInput, percentToCrossInput, percentToMutateInput, maxGenerationsWithoutChangesInput } from "./bindings.js";
import { drawLines, cities } from "./visualisation.js";
export function algorithmRunner() {
    if (cities.length == 0)
        return;
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
    const newPoints = [];
    cities.forEach((city) => {
        newPoints.push(new Point(city.x, city.y));
    });
    const populationSize = populationSizeInput;
    const percentToMutate = percentToMutateInput;
    const percentToCross = percentToCrossInput;
    const MaxGenerationsWithoutChanges = maxGenerationsWithoutChangesInput;
    // кол-во городов
    const genotypeSize = newPoints.length;
    const points = newPoints;
    let currPopulation = new Array(populationSize);
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
        currPopulation.sort((crt1, crt2) => crt1.fitting - crt2.fitting);
    }
    function mutateOnce(creature) {
        let pos1 = getRandomGeneID();
        let pos2 = getRandomGeneID();
        if (pos1 > pos2)
            [pos1, pos2] = [pos2, pos1];
        creature.genotype = creature.genotype.slice(0, pos1).concat(creature.genotype.slice(pos1, pos2).reverse(), creature.genotype.slice(pos2));
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
        let id = Math.floor(Math.random() * populationSize);
        return id;
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
        let indexesToDelete = new Object;
        let totalFitting = 0;
        for (let i = 1; i < populationSize; ++i)
            totalFitting += currPopulation[i].fitting;
        for (let i = 1; i < populationSize; ++i)
            if (decide(currPopulation[i].fitting / totalFitting))
                indexesToDelete[i] = true;
        let newPopulation = [];
        for (let i = 0; i < currPopulation.length; ++i)
            if (indexesToDelete[i] != true)
                newPopulation.push(currPopulation[i]);
        newPopulation.sort((crt1, crt2) => crt1.fitting - crt2.fitting);
        while (newPopulation.length < populationSize) {
            newPopulation.push(getRandomCreature());
        }
        newPopulation.length = populationSize;
        currPopulation = newPopulation;
    }
    // algorithm itself
    fillInitualPopulation();
    let generationsWithoutChanges = 0;
    let prevBestFitting;
    let currGeneration = 0;
    function mainLoop() {
        if (generationsWithoutChanges > MaxGenerationsWithoutChanges)
            return;
        setGenerationsWithoutChanges(generationsWithoutChanges);
        setTotalGenerations(currGeneration);
        if (prevBestFitting == currPopulation[0].fitting) {
            generationsWithoutChanges++;
        }
        else {
            prevBestFitting = currPopulation[0].fitting;
            generationsWithoutChanges = 0;
        }
        visualize(currPopulation[0]);
        /*
        const canvas = document.getElementById('c');
        const context = canvas.getContext('2d');
        context.save();
        context.beginPath()
        context.moveTo(cities[currPopulation[0].genotype.at(-1)].x, cities[currPopulation[0].genotype.at(-1)].y);
        for (let i = 0, length = currPopulation[0].genotype.length; i < length; ++i)
        {
            context.lineWidth = 3;
            context.lineTo(cities[currPopulation[0].genotype[i]].x, cities[currPopulation[0].genotype[i]].y);
            context.stroke();
        }*/
        modifyPopulation();
        selectGeneration();
        currGeneration++;
        setTimeout(mainLoop, 0);
    }
    mainLoop();
    drawLines(currPopulation[0].genotype);
    function visualize(creature) {
        setPathLength(creature.fitting);
        drawLines(creature.genotype);
    }
}
//# sourceMappingURL=genetic.js.map