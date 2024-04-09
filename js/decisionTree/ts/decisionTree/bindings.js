export let selectedFilename;
export let maxDepthInput;
export let minKnowledgeInput;
export let iterationsDelay;
export const ClassifiedElement = document.getElementById("Classified");
export const WrongClassifiedElement = document.getElementById("WrongClassified");
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
// classify btn
export const ClassifyBtn = document.getElementById("ClassifyBtn");
//ClassifyBtn.addEventListener("click", runAstar);
// file load
$('#chooseFile').bind('change', function () {
    selectedFilename = $("#chooseFile").val();
    if (/^\s*$/.test(selectedFilename)) {
        $(".file-upload").removeClass('active');
        $("#noFile").text("No file chosen...");
    }
    else {
        $(".file-upload").addClass('active');
        $("#noFile").text(selectedFilename.replace("C:\\fakepath\\", ""));
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
//# sourceMappingURL=bindings.js.map