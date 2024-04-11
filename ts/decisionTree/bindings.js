export let newCSVDataTable,
           builtInCSVFilename;
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

export function SetClassifiedAmount(number)
{
  ClassifiedElement.value = number;
}

export function SetClassifiedWrong(number)
{
  WrongClassifiedElement.value = number;
}

export function SetTotalToClassify(number)
{
  TotalToClassify.value = number;
}

// create tree method radio
const CreateTreeRadioNewCSV = document.getElementById("CreateTreeRadioNewCSV");
CreateTreeRadioNewCSV.addEventListener('input', () => {
  createTreeMethod = NewCSV;
})

const CreateTreeRadioBuilInCSV = document.getElementById("CreateTreeRadioBuilInCSV");
CreateTreeRadioBuilInCSV.addEventListener('input', () => {
  createTreeMethod = BuiltInCSV;
})

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
const firstCSVPathElement = document.getElementById('chooseFile1');
firstCSVPathElement.addEventListener('change',() => {
  newCSVDataTable = readFile(firstCSVPathElement);
  const newCSVFilename = firstCSVPathElement.files[0].name;
  if (/^\s*$/.test(newCSVFilename)) {
    $(".file-upload").removeClass('active');
    $("#noFile1").text("No file chosen..."); 
  }
  else {
    $(".file-upload").addClass('active');
    $("#noFile1").text(newCSVFilename);
  }
});

function parseCSV(text) {
  let prevSymbol = '', currString = [''], result = [currString], index = 0, stringIndex = 0, insideQuotes = true, symbol;
  for (symbol of text) {
    if (symbol === '"') {
      if (insideQuotes && symbol === prevSymbol) currString[index] += symbol;
      insideQuotes = !insideQuotes;
    } else if (symbol === ',' && insideQuotes) symbol = currString[++index] = '';
    else if (symbol === '\n' && insideQuotes) {
      if (prevSymbol === '\r') currString[index] = currString[index].slice(0, -1);
      currString = result[++stringIndex] = [symbol = '']; index = 0;
    } else currString[index] += symbol;
    prevSymbol = symbol;
  }
  return result;
}

function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    return parseCSV(reader.result);
  };

  reader.onerror = function() {
    console.log(reader.error);
    return null;
  };
}

// movability logic
const window = document.getElementById('movable');
const movableDiv = window.lastElementChild;

let diffY,
    diffX,
    elmWidth,
    elmHeight,
    isMouseDown = false;

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

function mouseMove(e)
{
  if (!isMouseDown) return;
  // get new mouse coordinates
  const newMouseY = e.clientY;
  const newMouseX = e.clientX;
  
  // calc new top, left pos of elm
  let newElmTop = newMouseY - diffY,
      newElmLeft = newMouseX - diffX;

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

function zoom(event)
{
  event.preventDefault();

  scale += event.deltaY * -0.003;

  // Restrict scale
  scale = Math.min(Math.max(0.125, scale), 4);

  // Apply scale transform
  movableDiv.style.transform = `scale(${scale})`;
}

window.addEventListener('wheel', zoom)

// reset transformations
export function resetTreeTransformation()
{
  scale = 1;
  movableDiv.style.transform = `scale(${scale})`;
  movableDiv.style.top = '0px';
  movableDiv.style.left = '0px';
}