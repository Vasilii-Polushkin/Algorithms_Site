export let newCSVFilename, builtInCSVFilename;
export let maxDepthInput;
export let minKnowledgeInput;
export let iterationsDelay;
export let percentToClassify;
export const NewCSV = 0;
export const BuiltInCSV = 1;
export let createTreeMethod = BuiltInCSV;
export const ClassifyBtn = document.getElementById("ClassifyBtn");
export const CreateTreeBtn = document.getElementById("CreateTreeBtn");
const ClassifiedElement = document.getElementById("Classified");
const TotalToClassify = document.getElementById("TotalToClassify");
const WrongClassifiedElement = document.getElementById("WrongClassified");
export function SetClassifiedAmount(number) {
    ClassifiedElement.value = number;
}
export function SetClassifiedWrong(number) {
    WrongClassifiedElement.value = number;
}
export function SetTotalToClassify(number) {
    TotalToClassify.value = number;
}
// create tree method radio
const CreateTreeRadioNewCSV = document.getElementById("CreateTreeRadioNewCSV");
CreateTreeRadioNewCSV.addEventListener('input', () => {
    createTreeMethod = NewCSV;
});
const CreateTreeRadioBuilInCSV = document.getElementById("CreateTreeRadioBuilInCSV");
CreateTreeRadioBuilInCSV.addEventListener('input', () => {
    createTreeMethod = BuiltInCSV;
});
// max depth range
const MaxDepthOutput = document.getElementById("MaxDepthOutput");
const MaxDepthInput = document.getElementById("MaxDepthRange");
maxDepthInput = MaxDepthInput.value;
MaxDepthOutput.textContent = maxDepthInput + ' nodes';
MaxDepthInput.addEventListener("input", () => {
    maxDepthInput = MaxDepthInput.value;
    MaxDepthOutput.textContent = maxDepthInput + ' nodes';
});
// min knowledge range
const MinKnowledgeOutput = document.getElementById("MinKnowledgeOutput");
const MinKnowledgeInput = document.getElementById("MinKnowledgeRange");
minKnowledgeInput = MinKnowledgeInput.value;
MinKnowledgeOutput.textContent = minKnowledgeInput + '%';
MinKnowledgeInput.addEventListener("input", () => {
    minKnowledgeInput = MinKnowledgeInput.value;
    MinKnowledgeOutput.textContent = minKnowledgeInput + '%';
});
// iterations delay range
const IterationsDelayOutput = document.getElementById("IterationsDelayOutput");
const IterationsDelayInput = document.getElementById("IterationsDelayRange");
iterationsDelay = IterationsDelayInput.value;
IterationsDelayOutput.textContent = iterationsDelay;
IterationsDelayInput.addEventListener("input", () => {
    iterationsDelay = IterationsDelayInput.value;
    IterationsDelayOutput.textContent = iterationsDelay;
});
// percent to classify range
const PercentToClassifyOutput = document.getElementById("PercentToClassifyOutput");
const PercentToClassifyInput = document.getElementById("PercentToClassifyRange");
percentToClassify = PercentToClassifyInput.value;
PercentToClassifyOutput.textContent = percentToClassify;
PercentToClassifyInput.addEventListener("input", () => {
    percentToClassify = PercentToClassifyInput.value;
    PercentToClassifyOutput.textContent = percentToClassify;
});
// file load
$('#chooseFile').bind('change', function () {
    newCSVFilename = $("#chooseFile").val();
    if (/^\s*$/.test(newCSVFilename)) {
        $(".file-upload").removeClass('active');
        $("#noFile").text("No file chosen...");
    }
    else {
        $(".file-upload").addClass('active');
        $("#noFile").text(newCSVFilename.replace("C:\\fakepath\\", ""));
    }
});
// movability logic
const window = document.getElementById('movable');
const movableDiv = window.lastElementChild;
let diffY, diffX, elmWidth, elmHeight, isMouseDown = false;
function mouseDown(e) {
    isMouseDown = true;
    // get initial mousedown coordinated
    const mouseY = e.clientY;
    const mouseX = e.clientX;
    // get element top and left positions
    const elmY = movableDiv.offsetTop;
    const elmX = movableDiv.offsetLeft;
    // get elm dimensions
    elmWidth = movableDiv.offsetWidth;
    elmHeight = movableDiv.offsetHeight;
    // get diff from (0,0) to mousedown point
    diffY = mouseY - elmY;
    diffX = mouseX - elmX;
}
function mouseMove(e) {
    if (!isMouseDown)
        return;
    // get new mouse coordinates
    const newMouseY = e.clientY;
    const newMouseX = e.clientX;
    // calc new top, left pos of elm
    let newElmTop = newMouseY - diffY, newElmLeft = newMouseX - diffX;
    moveElm(newElmTop, newElmLeft);
}
function moveElm(yPos, xPos) {
    movableDiv.style.top = yPos + 'px';
    movableDiv.style.left = xPos + 'px';
}
function mouseUp() {
    isMouseDown = false;
}
window.addEventListener('mousedown', mouseDown);
document.addEventListener('mousemove', mouseMove);
document.addEventListener('mouseup', mouseUp);
// scroll logic
let scale = 1;
function zoom(event) {
    event.preventDefault();
    scale += event.deltaY * -0.003;
    // Restrict scale
    scale = Math.min(Math.max(0.125, scale), 4);
    // Apply scale transform
    movableDiv.style.transform = `scale(${scale})`;
}
window.addEventListener('wheel', zoom);
// reset transformations
export function resetTreeTransformation() {
    scale = 1;
    movableDiv.style.transform = `scale(${scale})`;
    movableDiv.style.top = '0px';
    movableDiv.style.left = '0px';
}
//# sourceMappingURL=bindings.js.map