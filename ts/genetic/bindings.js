import { startPathFinding, abortPathFinding } from "./genetic.js";
import { setRandomSities, clearSities, startAnimating, stopAnimating } from "./visualisation.js";

/* --------------------------------------------------------------------------------- *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT VARIABLES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ *
 * --------------------------------------------------------------------------------- */

// Main page
export let currGenerationInput;

// Offcanvas
export let populationSizeInput;
export let percentToMutateInput;
export let percentToCrossInput;
export let maxGenerationsWithoutChangesInput;

/* --------------------------------------------------------------------------------- *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ MAIN PAGE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ *
 * --------------------------------------------------------------------------------- */

// Run button
const RunBtn = document.getElementById("RunBtn");
RunBtn.addEventListener('click', () => {
    stopAnimating();
    startPathFinding();
})

// Randomize cities button
const RandomizeCitiesBtn = document.getElementById("RandomizeCitiesBtn");
RandomizeCitiesBtn.addEventListener('click', () => {
    abortPathFinding();
    setRandomSities();
    startAnimating();
})

// Clear cities button
const ClearCitiesBtn = document.getElementById("ClearCitiesBtn");
ClearCitiesBtn.addEventListener('click', () => {
    abortPathFinding();
    clearSities();
    startAnimating();
})

// Generations without changes output
const GenerationsWithoutChangesOutput = document.getElementById("GenerationsWithoutChangesOutput");
export function setGenerationsWithoutChanges(number)
{
    GenerationsWithoutChangesOutput.value = number;
}

// Path length output
const PathLengthOutput = document.getElementById("PathLengthOutput");
export function setPathLength(number)
{
    PathLengthOutput.value = number.toFixed(3);
}

// Total generations output
const TotalGenerationOutput = document.getElementById("TotalGenerationOutput");
export function setTotalGenerations(number)
{
    TotalGenerationOutput.value = number;
}

// Generations range form
const CurrGenerationOutput = document.getElementById("CurrGenerationOutput");
const CurrGenerationInput = document.getElementById("CurrGenerationRange");
currGenerationInput = parseInt(CurrGenerationInput.value);
CurrGenerationOutput.textContent = currGenerationInput;

CurrGenerationInput.addEventListener("input", () => {
    currGenerationInput = parseInt(CurrGenerationInput.value);
    CurrGenerationOutput.textContent = currGenerationInput;
});

/* --------------------------------------------------------------------------------- *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ OFFCANVAS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ *
 * --------------------------------------------------------------------------------- */

// Population size range form
const PopulationSizeOutput = document.getElementById("PopulationSizeOutput");
const PopulationSizeInput = document.getElementById("PopulationSizeRange");
populationSizeInput = parseInt(PopulationSizeInput.value);
PopulationSizeOutput.textContent = populationSizeInput;

PopulationSizeInput.addEventListener("input", () => {
    populationSizeInput = parseInt(PopulationSizeInput.value);
    PopulationSizeOutput.textContent = populationSizeInput;
});

// Percent to mutate range form
const PercentToMutateOutput = document.getElementById("PercentToMutateOutput");
const PercentToMutateInput = document.getElementById("PercentToMutateRange");
percentToMutateInput = parseInt(PercentToMutateInput.value);
PercentToMutateOutput.textContent = percentToMutateInput;

PercentToMutateInput.addEventListener("input", () => {
    percentToMutateInput = parseInt(PercentToMutateInput.value);
    PercentToMutateOutput.textContent = percentToMutateInput;
});

// Percent to cross range form
const PercentToCrossOutput = document.getElementById("PercentToCrossOutput");
const PercentToCrossInput = document.getElementById("PercentToCrossRange");
percentToCrossInput = parseInt(PercentToCrossInput.value);
PercentToCrossOutput.textContent = percentToCrossInput;

PercentToCrossInput.addEventListener("input", () => {
    percentToCrossInput = parseInt(PercentToCrossInput.value);
    PercentToCrossOutput.textContent = percentToCrossInput;
});

// Generations without changes range form
const MaxGenerationsWithoutChangesOutput = document.getElementById("MaxGenerationsWithoutChangesOutput");
const MaxGenerationsWithoutChangesInput = document.getElementById("MaxGenerationsWithoutChangesRange");
maxGenerationsWithoutChangesInput = parseInt(MaxGenerationsWithoutChangesInput.value);
MaxGenerationsWithoutChangesOutput.textContent = maxGenerationsWithoutChangesInput;

MaxGenerationsWithoutChangesInput.addEventListener("input", () => {
    maxGenerationsWithoutChangesInput = parseInt(MaxGenerationsWithoutChangesInput.value);
    MaxGenerationsWithoutChangesOutput.textContent = maxGenerationsWithoutChangesInput;
});