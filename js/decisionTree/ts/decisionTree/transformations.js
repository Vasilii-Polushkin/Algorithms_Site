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
    movableDiv.style.scale = scale;
}
window.addEventListener('wheel', zoom);
// reset transformations
export function resetTreeTransformation() {
    scale = 1;
    movableDiv.style.scale = scale;
    scale = window.clientWidth / movableDiv.clientWidth * 0.7;
    movableDiv.style.scale = scale;
    movableDiv.style.top = '50%';
    movableDiv.style.left = '50%';
}
//# sourceMappingURL=transformations.js.map