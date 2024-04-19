import { startPathFinding, abortPathFinding } from "./genetic.js";
import { setRandomSities, clearSities, startAnimating, stopAnimating } from "./visualisation.js";
// main page
export let currGenerationInput = 0;
// offcanvas
export let populationSizeInput = 90;
export let percentToMutateInput = 30;
export let percentToCrossInput = 40;
export let maxGenerationsWithoutChangesInput = 30;
/**
 * ----------------------- MAIN PAGE ------------------------
 */
const RunBtn = document.getElementById("RunBtn");
RunBtn.addEventListener('click', () => {
    stopAnimating();
    startPathFinding();
});
const Toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast'));
export function showToast() {
    Toast.show();
}
const RandomizeCitiesBtn = document.getElementById("RandomizeCitiesBtn");
RandomizeCitiesBtn.addEventListener('click', () => {
    abortPathFinding();
    setRandomSities();
    startAnimating();
});
const ClearCitiesBtn = document.getElementById("ClearCitiesBtn");
ClearCitiesBtn.addEventListener('click', () => {
    abortPathFinding();
    clearSities();
    startAnimating();
});
const GenerationsWithoutChangesOutput = document.getElementById("GenerationsWithoutChangesOutput");
export function setGenerationsWithoutChanges(number) {
    GenerationsWithoutChangesOutput.value = number;
}
const PathLengthOutput = document.getElementById("PathLengthOutput");
export function setPathLength(number) {
    PathLengthOutput.value = number.toFixed(3);
}
// Generations range form
const TotalGenerationOutput = document.getElementById("TotalGenerationOutput");
export function setTotalGenerations(number) {
    TotalGenerationOutput.value = number;
}
const CurrGenerationOutput = document.getElementById("CurrGenerationOutput");
const CurrGenerationInput = document.getElementById("CurrGenerationRange");
currGenerationInput = CurrGenerationInput.value;
CurrGenerationOutput.textContent = currGenerationInput;
CurrGenerationInput.addEventListener("input", () => {
    currGenerationInput = CurrGenerationInput.value;
    CurrGenerationOutput.textContent = currGenerationInput;
});
/**
 * ----------------------- OFFCANVAS ------------------------
 */
// Generations range form
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
//# sourceMappingURL=bindings.js.map