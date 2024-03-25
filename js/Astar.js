//import {PriorityQueue} from "./PriorityQueue.mjs";

//global variables, shoud be editable only using functions

let windowHeight = 660;
let windowWidth = 660;

let cellsWidth = 10;
let cellsHeight = 10;

let isRunning = 0;

// new width & height
const outputGridSizeValue = document.getElementById("gridValue");
const outputWindowSizeValue = document.getElementById("windowValue");

// new brush size
const outputBrushSizeValue = document.getElementById("brushValue");

// new iterations value
let iterationsDelay = 0;
const outputIterationsDelayValue = document.getElementById("delayValue");

// selected cell types
const cellsTypes = { BLANK: 0, WALL: 1, START: 2, END: 3, SLOW: 4, BOOST: 5};
const cellsTypesColours = { BLANK_COLOUR: '', WALL_COLOUR: `rgb(20, 18, 17)`, START_COLOUR: `rgb(245, 238, 235)`, END_COLOUR: `rgb(226, 147, 3)`, SLOW_COLOUR: `brown`, BOOST_COLOUR: `green`};
let selectedCellType = cellsTypes.BLANK;

//start & end cells

let startCell = null;
let endCell = null;

//---------------------init grid as AstarGrid child ----------------------//
const AstarGrid = document.getElementById('AstarGrid');

//grid in a seperate div
const grid = document.createElement('div');
grid.classList.add('grid');
AstarGrid.appendChild(grid);

//---------------------appending visual grid with cells----------------------//
function makeVisualGrid()
{
    isRunning = 0;
    grid.innerHTML = '';

    startCell = null;
    endCell = null;

    let cellWidthPixels = windowWidth / cellsWidth ;
    let cellHeightPixels = windowHeight / cellsHeight ;

    grid.style.gridTemplateColumns = `repeat(${cellsWidth}, ${cellWidthPixels}px)`;
    grid.style.gridTemplateRows = `repeat(${cellsHeight}, ${cellHeightPixels}px)`; // наоборот

    for(let i = 0; i < cellsHeight; i++)
    {
        for(let j = 0; j < cellsWidth; j++)
        {
          const cell = document.createElement('div');

          if (Math.min(cellsWidth, cellsHeight) <= 30)
            cell.classList.add('cell-div-big');
          else cell.classList.add('cell-div-small');

          cell.id = i * cellsWidth + j;
          //cell.style.

          cell.addEventListener('mouseover', updateCellVisuals);
          cell.addEventListener('mousedown', updateCellVisuals);

          cell.addEventListener('mouseenter', EnterHoverHandling);
          cell.addEventListener('mouseleave', leaveHoverHandling);

          grid.appendChild(cell);
        }
    }
}

function EnterHoverHandling(event)
{
  if (selectedCellType == cellsTypes.START || selectedCellType == cellsTypes.END)
    event.target.classList.add("cell-hover");

  else
  {
    getValidCells(event.target.id).forEach((index)=>{
      document.getElementById(index).classList.add("cell-hover");
    });
  }
}

function leaveHoverHandling(event)
{
  if (selectedCellType == cellsTypes.START || selectedCellType == cellsTypes.END)
    event.target.classList.remove("cell-hover");

  else
  {
    getValidCells(event.target.id).forEach((index)=>{
      document.getElementById(index).classList.remove("cell-hover");
    });
  }
}

function updateWindowWidthHeight()
{
  windowHeight = windowWidth = parseInt(outputWindowSizeValue.value);
}
function updateGridWidthHeight()
{
  cellsHeight = cellsWidth = parseInt(outputGridSizeValue.value);
}

function updateWindowSize()
{
    updateWindowWidthHeight();

    let cellWidthPixels = windowWidth / cellsWidth ;
    let cellHeightPixels = windowHeight / cellsHeight ;

    grid.style.gridTemplateColumns = `repeat(${cellsWidth}, ${cellWidthPixels}px)`;
    grid.style.gridTemplateRows = `repeat(${cellsHeight}, ${cellHeightPixels}px)`; // наоборот
}

window.onload = () => {makeVisualGrid(cellsHeight, cellsWidth)};
//---------------------appending vilual cells to grid----------------------//

function getValidCells(cellIndex)
{
  let diametr = parseInt(outputBrushSizeValue.textContent);

  cellJ = cellIndex % cellsWidth;
  cellI = Math.floor(cellIndex / cellsWidth);

  let result = [];

  for (let i = - Math.floor(diametr / 2); i < Math.ceil(diametr / 2); ++i)
  {
    for (let j = - Math.floor(diametr / 2); j < Math.ceil(diametr / 2); ++j)
    {
      let newI = cellI + i;
      let newJ = cellJ + j;

      if (newI >= 0 && newI < cellsHeight &&
        newJ >= 0 && newJ < cellsWidth)
      {
        result.push(newI * cellsWidth + newJ);
      }
    }
  }

  return result;
}
//cell activation function
function updateCellVisuals(event)
{
  if (event.buttons === 1)
  {
    if (event.target.id == startCell)
      startCell = null;

    if (event.target.id == endCell)
      endCell = null;

      resetCellClasses(event.target);

    switch (selectedCellType)
    {
      case cellsTypes.BLANK:
        getValidCells(event.target.id).forEach((cell)=>{
          cellElement = document.getElementById(cell);
          resetCellClasses(cellElement);
          cellElement.style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        });
        break;
      case cellsTypes.WALL:
        getValidCells(event.target.id).forEach((cell)=>{
          cellElement = document.getElementById(cell);
          resetCellClasses(cellElement);
          cellElement.style.backgroundColor = cellsTypesColours.WALL_COLOUR;
        }); 
        break;
      case cellsTypes.START:
        event.target.style.backgroundColor = cellsTypesColours.START_COLOUR;
        if (startCell != null)
        {
          resetCellClasses(document.getElementById(startCell));
          document.getElementById(startCell).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        }
        startCell = event.target.id;
        //event.target.classList.add('confirm_selection');
        break;
      case cellsTypes.END:
        event.target.style.backgroundColor = cellsTypesColours.END_COLOUR;
        if (endCell != null)
        {
          resetCellClasses(document.getElementById(endCell));
          document.getElementById(endCell).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        }
        endCell = event.target.id;
        break;
      case cellsTypes.SLOW:
        getValidCells(event.target.id).forEach((cell)=>{
          cellElement = document.getElementById(cell);
          resetCellClasses(cellElement);
          cellElement.style.backgroundColor = cellsTypesColours.SLOW_COLOUR;
        }); 
        break;
      case cellsTypes.BOOST:
        getValidCells(event.target.id).forEach((cell)=>{
          cellElement = document.getElementById(cell);
          resetCellClasses(cellElement);
          cellElement.style.backgroundColor = cellsTypesColours.BOOST_COLOUR;
        }); 
        break;
    }
  }
  //event.target.
}

function resetCellClasses(cell)
{
  cell.textContent = "";
  cell.classList.remove("open-list");
  cell.classList.remove("closed-list");
  cell.classList.remove("final-path");
}

function changeCellType(type)
{
  selectedCellType = type;
}

function AddToClosedListVisual(id)
{
  document.getElementById(id).classList.add("closed-list");
}
function RemoveFromClosedListVisual(id)
{
  document.getElementById(id).classList.remove("closed-list");
}

function AddToOpenListVisual(id)
{
  document.getElementById(id).classList.add("open-list");
}
function RemoveFromOpenListVisual(id)
{
  document.getElementById(id).classList.remove("open-list");
}
//------------------------------- interface interaction ----------------------------------//

// cell types btns
document.getElementById("WALLbtn").addEventListener("click", function (){
  changeCellType(cellsTypes.WALL);
})

document.getElementById("BLANKbtn").addEventListener("click", function (){
  changeCellType(cellsTypes.BLANK);
})
document.getElementById("STARTbtn").addEventListener("click", function (){
  changeCellType(cellsTypes.START);
})

document.getElementById("ENDbtn").addEventListener("click", function (){
  changeCellType(cellsTypes.END);
})

document.getElementById("SLOWbtn").addEventListener("click", function (){
  changeCellType(cellsTypes.SLOW);
})

document.getElementById("BOOSTbtn").addEventListener("click", function (){
  changeCellType(cellsTypes.BOOST);
})

// restart btn
document.getElementById("RestartBtn").addEventListener("click", function (){
  updateGridWidthHeight();
  makeVisualGrid();
})


//labyrinth btn
document.getElementById("CreateLabyrinth").addEventListener("click", function (){
  createLabyrinth();
})

// grid size range
const gridSizeInput = document.getElementById("gridSizeRange");
outputGridSizeValue.textContent = gridSizeInput.value;

gridSizeInput.addEventListener("input", (event) => {
  outputGridSizeValue.textContent = event.target.value;
});

// window size range
const windowSizeInput = document.getElementById("windowSizeRange");
outputWindowSizeValue.textContent = windowSizeInput.value;

windowSizeInput.addEventListener("input", (event) => {
  outputWindowSizeValue.textContent = event.target.value;
  updateWindowSize();
});

// iterations delay size range
const iterationsDelayInput = document.getElementById("IterationsDelayRange");
iterationsDelay = iterationsDelayInput.value;
outputIterationsDelayValue.textContent = iterationsDelayInput.value;

iterationsDelayInput.addEventListener("input", (event) => {
  outputIterationsDelayValue.textContent = event.target.value;
  iterationsDelay = event.target.value;
});

// brush size range
const brushSizeInput = document.getElementById("BrushSizeRange");
outputBrushSizeValue.textContent = brushSizeInput.value;

brushSizeInput.addEventListener("input", (event) => {
  outputBrushSizeValue.textContent = event.target.value;
});

// run algorithm btn
document.getElementById("RunBtn").addEventListener("click", runAlgorithm);

// alert
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible alert-light" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper);
    }
//---------------------------------------- REALIZATION ----------------------------------------------//

// ---------------------------------------  queue  --------------------------------------------------//
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[0];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > 0) {
      this._swap(0, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[0] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > 0 && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = 0;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}
// ---------------------------------------  queue  --------------------------------------------------//

// cell: [weight, position(i * height + j)]

let weights = [];
let path = [];
let ancestors = [];
const closedList = new Set();
let openList = new PriorityQueue((a, b) => a[0] < b[0]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getLeftAdjustCell(cellId){
  return (cellId % cellsWidth != 0)? cellId - 1: null;
}
function getRightAdjustCell(cellId){
  return (cellId % cellsWidth != cellsWidth - 1)? cellId + 1: null;
}
function getTopAdjustCell(cellId){
  return (cellId - cellsWidth >= 0)? cellId - cellsWidth: null;
}
function getBottomAdjustCell(cellId){
  return (cellId + cellsWidth < cellsWidth * cellsHeight)? cellId + cellsWidth: null;
}

function getAdjustCells(cellId)
{
  const res = [];

  if (cellId - cellsWidth >= 0) res.push(cellId - cellsWidth);
  if (cellId + cellsWidth <= cellsWidth * cellsHeight) res.push(cellId + cellsWidth);
  if (cellId % cellsWidth != 0) res.push(cellId - 1);
  if (cellId % cellsWidth != cellsWidth - 1) res.push(cellId + 1);

  return res;
}

function getRandomKey(collection) {
  let index = Math.floor(Math.random() * collection.size);
  let cntr = 0;
  for (let key of collection.keys()) {
      if (cntr++ === index) {
          return key;
      }
  }
}

async function createLabyrinth()
{
  updateGridWidthHeight();
  makeVisualGrid();

  for (let i = 0; i < cellsHeight * cellsWidth; ++i)
    document.getElementById(i).style.backgroundColor = cellsTypesColours.WALL_COLOUR;

  let randomCellId = getRandomInt(cellsHeight * cellsWidth - 1);

  let visited = [];
  visited.length = cellsHeight * cellsWidth;
  visited.fill(false);
  visited[randomCellId] = true;

  document.getElementById(randomCellId).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;

  const wallList = new Set();

  await sleep(iterationsDelay);
  getAdjustCells(randomCellId).forEach(id => {
    wallList.add(id);
    //visited[id] = true;
    document.getElementById(id).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
  });

  while (wallList.size)
  {
    //console.log(wallList.size);
    let randomWallId = getRandomKey(wallList);
    //console.log(randomWallId);
    wallList.delete(randomWallId);

    visited[randomWallId] = true;

    let bottom = getBottomAdjustCell(randomWallId);
    let top = getTopAdjustCell(randomWallId);
    let left = getLeftAdjustCell(randomWallId);
    let right = getRightAdjustCell(randomWallId);
    
    if (bottom != null && top != null)
    {
      if (visited[bottom] && !visited[top])
      {
        visited[top] = true;
        if (iterationsDelay) await sleep(iterationsDelay);
        document.getElementById(randomWallId).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        if (iterationsDelay) await sleep(iterationsDelay);
        document.getElementById(top).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        getAdjustCells(top).forEach(id => {
          if (!visited[id])
          {
            wallList.add(id);
            visited[id] = true;
          }
        });
      }
      if (!visited[bottom] && visited[top])
      {
        visited[bottom] = true;
        if (iterationsDelay) await sleep(iterationsDelay);
        document.getElementById(randomWallId).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        if (iterationsDelay) await sleep(iterationsDelay);
        document.getElementById(bottom).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        getAdjustCells(bottom).forEach(id => {
          if (!visited[id])
          {
            wallList.add(id);
            visited[id] = true;
          }
        });
      }
    }
    if (left != null && right != null)
    {
      if (visited[left] && !visited[right])
      {
        if (iterationsDelay) await sleep(iterationsDelay);
        document.getElementById(randomWallId).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        if (iterationsDelay) await sleep(iterationsDelay);
        document.getElementById(right).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        visited[right] = true;
        getAdjustCells(right).forEach(id => {
          if (!visited[id])
          {
            wallList.add(id);
            visited[id] = true;
          }
        });
      }
      if (!visited[left] && visited[right])
      {
        if (iterationsDelay) await sleep(iterationsDelay);
        document.getElementById(randomWallId).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        if (iterationsDelay) await sleep(iterationsDelay);
        document.getElementById(left).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        visited[left] = true;
        getAdjustCells(left).forEach(id => {
          if (!visited[id])
          {
            wallList.add(id);
            visited[id] = true;
          }
        });
      }
    }
  }
  for (let i = 0; i < cellsHeight * cellsWidth; ++i)
  {
    let cell = document.getElementById(i);
    if (cell.style.backgroundColor == cellsTypesColours.BLANK_COLOUR)
    {
      cell.style.backgroundColor = cellsTypesColours.START_COLOUR;
        if (startCell != null)
        {
          resetCellClasses(cell);
          cell.style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        }
        startCell = i;
      break;
    }
  }
  for (let i = cellsHeight * cellsWidth - 1; i >= 0; --i)
  {
    let cell = document.getElementById(i);
    if (cell.style.backgroundColor == cellsTypesColours.BLANK_COLOUR)
    {
      cell.style.backgroundColor = cellsTypesColours.END_COLOUR;
        if (endCell != null)
        {
          resetCellClasses(cell);
          cell.style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        }
        endCell = i;
      break;
    }
  }
}

function clearGarbage()
{
  closedList.forEach((elem) => {
    if (elem < cellsHeight * cellsWidth)
    {
      cell = document.getElementById(elem);
      cell.textContent = "";
      cell.classList.remove("closed-list");
      cell.classList.remove("open-list");
    }
  })
  closedList.clear();

  while(!openList.isEmpty())
  {
    if (openList.peek()[1] < cellsHeight * cellsWidth)
    {
      const cell = document.getElementById(openList.pop()[1]);
      cell.classList.remove("open-list");
      cell.textContent = "";
    }
    else openList.pop();
  }

  path.forEach((elem) => {
    if (elem < cellsHeight * cellsWidth)
    {
      cell = document.getElementById(elem);
      cell.textContent = "";
      cell.classList.remove("final-path");
    }
  });
  path.length = 0;
  weights.length = 0;
}


function runAlgorithm()
{
  isRunning = 0;
  clearGarbage();

  if (!startCell || !endCell)
  {
    appendAlert('Set the starting and ending cell!', 'success');
    return;
  }

  ancestors.length = cellsWidth * cellsHeight;
  weights.length = cellsWidth * cellsHeight;
  weights.fill(cellsWidth * cellsHeight * 2);

  const startJ = startCell % cellsWidth;
  const startI = Math.floor(startCell / cellsWidth);

  const endJ = endCell % cellsWidth;
  const endI = Math.floor(endCell / cellsWidth);

  // позиция
  closedList.add(parseInt(startCell));

  // вес - позиция
  openList.push([distanceToEnd(startI, startJ), parseInt(startCell)]);

  function distanceToEnd(i, j)
  {
  const distY = Math.abs(i - endI);
  const distX = Math.abs(j - endJ);

  //return Math.abs(distY - distX) + Math.min(distY, distX) * Math.sqrt(2);
  return distX + distY;
  //return Math.max(distX, distY);
  }

  function getCells(cell)
  {
    const startJ = cell[1] % cellsWidth;
    const startI = Math.floor(cell[1] / cellsWidth);

    let result = [];

    for (let i = -1; i <= 1; ++i)
    {
      for (let j = -1; j <= 1; ++j)
      {
        let newI = startI + i;
        let newJ = startJ + j;

        if (newI >= cellsHeight || newI < 0 ||
          newJ >= cellsWidth || newJ < 0 ||
          closedList.has(newI * cellsWidth + newJ) ||
          document.getElementById(newI * cellsWidth + newJ).style.backgroundColor == cellsTypesColours.WALL_COLOUR||
          Math.abs(i) == Math.abs(j) && 
          document.getElementById(newI * cellsWidth + startJ).style.backgroundColor == cellsTypesColours.WALL_COLOUR &&
          document.getElementById(startI * cellsWidth + newJ).style.backgroundColor == cellsTypesColours.WALL_COLOUR)
          continue;

        let weight = distanceToEnd(newI, newJ) + cell[0] - distanceToEnd(startI, startJ);
        weight += (Math.abs(i) == Math.abs(j)) ? Math.sqrt(2): 1;
        result.push([weight, newI * cellsWidth + newJ]);
      }
    }
    return result;
  }
  isRunning = 1;
  findPath();

  //colorChannelA and colorChannelB are ints ranging from 0 to 255
  function colorChannelMixer(colorChannelA, colorChannelB, amountToMix)
  {
    var channelA = colorChannelA*amountToMix;
    var channelB = colorChannelB*(1-amountToMix);
    return parseInt(channelA+channelB);
  }
  //rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
  //example (red): rgbA = [255,0,0]
  function colorMixer(rgbA, rgbB, amountToMix)
  {
    var r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
    var g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
    var b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
    return "rgb("+r+","+g+","+b+")";
  }

  async function findPath()
  {
  do
  {
    let currCell = openList.pop();

    RemoveFromOpenListVisual(currCell[1]);
    AddToClosedListVisual(currCell[1]);

    closedList.add(currCell[1]);

    //console.log(openList.peek());
    //getCells(openList.peek());

    getCells(currCell).forEach(cell => {
      if (weights[cell[1]] > cell[0])
      {
        //------------------visuals-------------------//
        if (Math.min(cellsWidth, cellsHeight) <= 10)
        document.getElementById(cell[1]).textContent = cell[0].toFixed(3);

        else if (Math.min(cellsWidth, cellsHeight) <= 15)
        document.getElementById(cell[1]).textContent = cell[0].toFixed(1); 

        AddToOpenListVisual(cell[1]);
        //------------------visuals-------------------//

        ancestors[cell[1]] = currCell[1];
        weights[cell[1]] = cell[0];
        openList.push(cell);
      }
    });
    await sleep(iterationsDelay);
    if (!isRunning) return;
  } while (!openList.isEmpty() && openList.peek()[1] != endCell);

  if (openList.isEmpty())
  {
    appendAlert('No path found!', 'success')
  }
  else
  {
    let index = endCell;
    while (index != startCell)
    {
      index = ancestors[index];
      path.push(index);
    }

    path.reverse();

    for (let i = 0; i < path.length; ++i)
    {
      document.getElementById(path[i]).classList.add("final-path");
      await sleep(Math.min(100, iterationsDelay));
      if (!isRunning) return;
    }
    document.getElementById(endCell).classList.add("final-path");

    /*
    for (let i = 0; i < path.length; ++i)
    {
      let cell = document.getElementById(path[i]);
      resetCellClasses(cell);
      cell.style.backgroundColor = colorMixer([240, 157, 2],[255, 255, 255], i / path.length);
      //await sleep(Math.min(100, iterationsDelay));
    }
    */
  }
  isRunning = 0;
}
}