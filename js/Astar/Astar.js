import PriorityQueue from "./PriorityQueue.js";

//global variables, shoud be editable only using functions

let windowHeight = 660;
let windowWidth = 660;

let cellsWidth = 10;
let cellsHeight = 10;

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
function remakeVisualGrid()
{
    grid.innerHTML = '';

    clearLabyrinthStack();
    clearAstarStack();

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

window.onload = () => {remakeVisualGrid(cellsHeight, cellsWidth)};
//---------------------appending vilual cells to grid----------------------//

function getValidCells(cellIndex)
{
  let diametr = parseInt(outputBrushSizeValue.textContent);

  let cellJ = cellIndex % cellsWidth;
  let cellI = Math.floor(cellIndex / cellsWidth);

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
          let cellElement = document.getElementById(cell);
          resetCellClasses(cellElement);
          cellElement.style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        });
        break;
      case cellsTypes.WALL:
        getValidCells(event.target.id).forEach((cell)=>{
          let cellElement = document.getElementById(cell);
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
          let cellElement = document.getElementById(cell);
          resetCellClasses(cellElement);
          cellElement.style.backgroundColor = cellsTypesColours.SLOW_COLOUR;
        }); 
        break;
      case cellsTypes.BOOST:
        getValidCells(event.target.id).forEach((cell)=>{
          let cellElement = document.getElementById(cell);
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
  remakeVisualGrid();
})


//labyrinth btn
document.getElementById("CreateLabyrinth").addEventListener("click", function (){
  updateGridWidthHeight();
  remakeVisualGrid();
  generateLabyrinth();
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
document.getElementById("RunBtn").addEventListener("click", runAstar);

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

// cell: [weight, position(i * height + j)]

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
  if (cellId + cellsWidth < cellsWidth * cellsHeight) res.push(cellId + cellsWidth);
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

//----------------------------------------------------- Labyrinth ----------------------------------------------//
let labyrinthStack = [];

function clearLabyrinthStack()
{
  while (labyrinthStack.length != 0)
    labyrinthStack.pop().isGenerating = false;
}

function generateLabyrinth()
{
  clearLabyrinthStack();
  labyrinthStack.push(new labyrinth());
}
class labyrinth
{
isGenerating = true;
constructor(){
  this.createLabyrinth();
};

async createLabyrinth()
{
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
  if (this.isGenerating == false) return;
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
        if (this.isGenerating == false) return;
        document.getElementById(randomWallId).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        if (iterationsDelay) await sleep(iterationsDelay);
        if (this.isGenerating == false) return;
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
        if (this.isGenerating == false) return;
        document.getElementById(randomWallId).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        if (iterationsDelay) await sleep(iterationsDelay);
        if (this.isGenerating == false) return;
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
        if (this.isGenerating == false) return;
        document.getElementById(randomWallId).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        if (iterationsDelay) await sleep(iterationsDelay);
        if (this.isGenerating == false) return;
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
        if (this.isGenerating == false) return;
        document.getElementById(randomWallId).style.backgroundColor = cellsTypesColours.BLANK_COLOUR;
        if (iterationsDelay) await sleep(iterationsDelay);
        if (this.isGenerating == false) return;
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
}

function colorChannelMixer(colorChannelA, colorChannelB, amountToMix)
{
  var channelA = colorChannelA*amountToMix;
  var channelB = colorChannelB*(1-amountToMix);
  return parseInt(channelA+channelB);
}
function colorMixer(rgbA, rgbB, amountToMix)
{
  var r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
  var g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
  var b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
  return "rgb("+r+","+g+","+b+")";
}
//---------------------------------------------------------Astar------------------------------------------------//
let AstarStack = [];

function clearAstarStack()
{
  while (AstarStack.length != 0)
  {
    AstarStack[AstarStack.length - 1].clearGarbage();
    AstarStack.pop().isRunning = false;
  }
}

function runAstar()
{
  clearAstarStack();
  AstarStack.push(new AstarAlgorithm());
}
class AstarAlgorithm
{
  constructor(){
    this.runAlgorithm();
  }
  weights = [];
  path = [];
  ancestors = [];
  closedList = new Set();
  openList = new PriorityQueue((a, b) => a[0] < b[0]);

  startJ = startCell % cellsWidth;
  startI = Math.floor(startCell / cellsWidth);
  
  endJ = endCell % cellsWidth;
  endI = Math.floor(endCell / cellsWidth);

  endCell = endCell;
  startCell = startCell;

  isRunning = true;

  clearGarbage()
  {
    this.closedList.forEach((elem) => {
    if (elem < cellsHeight * cellsWidth)
    {
      const cell = document.getElementById(elem);
      if (cell != null)
      {
        cell.textContent = "";
        cell.classList.remove("closed-list");
        cell.classList.remove("open-list");
      }
    }
    })
    this.closedList.clear();

    while(!this.openList.isEmpty())
  {
    if (this.openList.peek()[1] < cellsHeight * cellsWidth)
    {
      const cell = document.getElementById(this.openList.pop()[1]);
      if (cell != null)
      {
        cell.classList.remove("open-list");
        cell.textContent = "";
      }
    }
    else this.openList.pop();
    }

    this.path.forEach((elem) => {
    if (elem < cellsHeight * cellsWidth)
    {
      const cell = document.getElementById(elem);
      if (cell != null)
      {
        cell.textContent = "";
        cell.classList.remove("final-path");
      }
    }
    });
    this.path.length = 0;
    this.weights.length = 0;
  }

  distanceToEnd(i, j)
  {
    const distY = Math.abs(i - this.endI);
    const distX = Math.abs(j - this.endJ);

    //return Math.abs(distY - distX) + Math.min(distY, distX) * Math.sqrt(2);
    return distX + distY;
    //return Math.max(distX, distY);
  }

  getCells(cell)
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

        let newCell = document.getElementById(newI * cellsWidth + newJ);

        if (newI >= cellsHeight || newI < 0 ||
          newJ >= cellsWidth || newJ < 0 ||
          this.closedList.has(newI * cellsWidth + newJ) ||
          newCell.style.backgroundColor == cellsTypesColours.WALL_COLOUR||
          Math.abs(i) == Math.abs(j) && 
          document.getElementById(newI * cellsWidth + startJ).style.backgroundColor == cellsTypesColours.WALL_COLOUR &&
          document.getElementById(startI * cellsWidth + newJ).style.backgroundColor == cellsTypesColours.WALL_COLOUR)
          continue;

        let weight = this.distanceToEnd(newI, newJ) + cell[0] - this.distanceToEnd(startI, startJ);

        if (newCell.style.backgroundColor == cellsTypesColours.BLANK_COLOUR)
          weight += (Math.abs(i) == Math.abs(j)) ? Math.sqrt(2): 1;

        else if (newCell.style.backgroundColor == cellsTypesColours.BOOST_COLOUR)
          weight += (Math.abs(i) == Math.abs(j)) ? Math.sqrt(2) / 2: 1 / 2;

        else //if (newCell.style.backgroundColor == cellsTypesColours.SLOW_COLOUR)
          weight += (Math.abs(i) == Math.abs(j)) ? Math.sqrt(2) * 2: 1 * 2;

        result.push([weight, newI * cellsWidth + newJ]);
      }
    }
    return result;
  }

  runAlgorithm()
  {
    this.ancestors.length = cellsWidth * cellsHeight;
    this.weights.length = cellsWidth * cellsHeight;
    this.weights.fill(cellsWidth * cellsHeight * 2);

    if (this.startCell == null || this.endCell == null)
    {
      appendAlert('Set the starting and ending cell!', 'success');
      return;
    }

    // позиция
    this.closedList.add(parseInt(this.startCell));

    // вес - позиция
    this.openList.push([this.distanceToEnd(this.startI, this.startJ), parseInt(this.startCell)]);

    this.findPath();
  }

  async findPath()
  {
  do
  {
    await sleep(iterationsDelay);
    if (!this.isRunning) return;

    let currCell = this.openList.pop();

    RemoveFromOpenListVisual(currCell[1]);
    AddToClosedListVisual(currCell[1]);

    this.closedList.add(currCell[1]);

    this.getCells(currCell).forEach(cell => {
      if (this.weights[cell[1]] > cell[0])
      {
        //------------------visuals-------------------//
        if (Math.min(cellsWidth, cellsHeight) <= 10)
        document.getElementById(cell[1]).textContent = cell[0].toFixed(3);

        else if (Math.min(cellsWidth, cellsHeight) <= 15)
        document.getElementById(cell[1]).textContent = cell[0].toFixed(1); 

        AddToOpenListVisual(cell[1]);
        //------------------visuals-------------------//

        this.ancestors[cell[1]] = currCell[1];
        this.weights[cell[1]] = cell[0];
        this.openList.push(cell);
      }
    });
  } while (!this.openList.isEmpty() && this.openList.peek()[1] != this.endCell);

  if (this.openList.isEmpty())
  {
    appendAlert('No path found!', 'success')
  }
  else
  {
    let index = this.endCell;
    while (index != this.startCell)
    {
      index = this.ancestors[index];
      this.path.push(index);
    }
    this.path.push(this.endCell);
    this.path.reverse();

    for (let i = 0; i < this.path.length; ++i)
    {
      document.getElementById(this.path[i]).classList.add("final-path");
      await sleep(Math.min(100, iterationsDelay));
      if (!this.isRunning) return;
    }

  /*
  for (let i = 0; i < path.length; ++i)
  {
    let cell = document.getElementById(path[i]);
    resetCellClasses(cell);
    cell.style.backgroundColor = colorMixer([240, 157, 2],[255, 255, 255], i / path.length);
    //await sleep(Math.min(100, iterationsDelay));
    if (!this.isRunning) return;
  }
  */
    }
  }
}