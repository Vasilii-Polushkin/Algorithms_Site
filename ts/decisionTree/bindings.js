import { heartAttackDataTable, dataTablesArray } from "../../../../csvs/BuiltInCsvs.js";
import { tree } from "./mainModule.js";

export let newTrainingDataTable,
           builtInDataTable,
           newClassifyDataTable;
export let maxDepthInput;
export let minKnowledgeInput;
export let iterationsDelay;
export let percentToClassify;

export const NewCSV = 0;
export const BuiltInCSV = 1, ThisCSV = 1;

export let createTreeMethod = BuiltInCSV;
export let classifyMethod = ThisCSV;

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
CreateTreeRadioNewCSV.addEventListener('click', () => {
  createTreeMethod = NewCSV;
})

const CreateTreeRadioBuilInCSV = document.getElementById("CreateTreeRadioBuilInCSV");
CreateTreeRadioBuilInCSV.addEventListener('click', () => {
  createTreeMethod = BuiltInCSV;
})

// classify tree method radio
const ClassifyRadioNewCSV = document.getElementById("ClassifyRadioNewCSV");
ClassifyRadioNewCSV.addEventListener('click', () => {
  classifyMethod = NewCSV;
})

const ClassifyRadioThisCSV = document.getElementById("ClassifyRadioThisCSV");
ClassifyRadioThisCSV.addEventListener('click', () => {
  classifyMethod = ThisCSV;
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

// toasts
const trainingToast = document.getElementById('noTrainingFileToast');
const noTrainingFileToast = bootstrap.Toast.getOrCreateInstance(trainingToast);
export function makeNoTrainingFileSelectedError()
{
  noTrainingFileToast.show();
}

const ClassifyToast = document.getElementById('noClassifyFileToast')
const noClassifyFileToast = bootstrap.Toast.getOrCreateInstance(ClassifyToast)
export function makeNoClassifyFileSelectedError()
{
  noClassifyFileToast.show();
}

const validationRequestOutput = document.getElementById('validationRequestOutput');
const fileValidationOutput = document.getElementById("fileValidationOutput");
const validationToast = document.getElementById('notValidFileToast');
const notValidFileToast = bootstrap.Toast.getOrCreateInstance(validationToast);
export function makeFileNotValidError(errOutput, requestOutput)
{
  validationRequestOutput.value = requestOutput;
  fileValidationOutput.value = errOutput;
  notValidFileToast.show();
}

const fileValidationOutputWithNoValidateBtn = document.getElementById("fileValidationOutputWithNoValidateBtn");
const validationToastWithNoValidateBtn = document.getElementById('notValidFileToastWithNoValidateBtn');
const notValidFileToastWithNoValidateBtn = bootstrap.Toast.getOrCreateInstance(validationToastWithNoValidateBtn);
export function makeFileNotValidErrorWithNoValidateBtn(output)
{
  fileValidationOutputWithNoValidateBtn.value = output;
  notValidFileToastWithNoValidateBtn.show();
}
//--------------------------------------------- buit in datatable --------------------------------

builtInDataTable = heartAttackDataTable;
const BuiltInDatasetSelector = document.getElementById("BuiltInDatasetSelector");
BuiltInDatasetSelector.addEventListener('change', ()=>{
    builtInDataTable = dataTablesArray[BuiltInDatasetSelector.selectedIndex];
});

// -------------------------------------------- file load------------------------------------------
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

const TrainingCSVPathElement = document.getElementById('chooseTrainingFile');
TrainingCSVPathElement.addEventListener('change',() => {
  readTrainFile(TrainingCSVPathElement.files[0]);
  const newCSVFilename = TrainingCSVPathElement.files[0].name;

  $("#file-upload-train").addClass('active');
  $("#noTrainigFile").text(newCSVFilename);
});

const ClassificationCSVPathElement = document.getElementById('chooseClassificationFile');
ClassificationCSVPathElement.addEventListener('change',() => {
  readClassifyFile(ClassificationCSVPathElement.files[0]);
  const newCSVFilename = ClassificationCSVPathElement.files[0].name;

  $("#file-upload-classify").addClass('active');
  $("#noClassificationFile").text(newCSVFilename);
});

function SetNoClassificationFile()
{
  newClassifyDataTable = undefined;
  $("#file-upload-classify").removeClass('active');
  $("#noClassificationFile").text("No file chosen..."); 
}

function SetNoTrainingFile()
{
  newTrainingDataTable = undefined;
  $("#file-upload-train").removeClass('active');
  $("#noTrainigFile").text("No file chosen..."); 
}

const validateRequestBtn = document.getElementById('validateRequest');



function isTrainingDataTableValid(dataTable)
{
  if (dataTable.length <= 1)
  {
    makeFileNotValidErrorWithNoValidateBtn("File Has Only One Row");
    return undefined;
  }

  const rowLenght = dataTable[0].length;
  for (let i = 1; i < dataTable.length; ++i)
    if (dataTable[i].length != rowLenght)
    {
      return `Row #${i + 1} contains ${dataTable[i].length} colums, while previous has ${rowLenght}`;
    }
}

function readTrainFile(filename) {

  let reader = new FileReader();

  reader.readAsText(filename);

  reader.onload = function() {
    newTrainingDataTable = parseCSV(reader.result);
    const err = dataTableValidError(newTrainingDataTable);
    if (err == undefined)
      return;
    validateRequestBtn.onclick = validateTrainingTableByLength;
    makeFileNotValidError(err, 'Filter file by length');
  };

  reader.onerror = function() {
    newTrainingDataTable = undefined;
    makeFileNotValidErrorWithNoValidateBtn(reader.error);
  };
}

function readClassifyFile(filename) {

  let reader = new FileReader();

  reader.readAsText(filename);
  
  reader.onload = function() {
    newClassifyDataTable = parseCSV(reader.result);
    const err = dataTableValidError(newClassifyDataTable);
    if (err == undefined)
      return;
    makeFileNotValidError(err, 'fix');
  };

  reader.onerror = function() {
    newClassifyDataTable = undefined;
    makeFileNotValidErrorWithNoValidateBtn(reader.error);
  };
}

export function isNewClassifyDataTableValid()
{
  const trainRowLength = tree.dataTable[0].length;
  const categoricalList = tree.categoricalAttributesList;
  const intervalList =  tree.intervalAttributesList;

  // валидация по длине
  if (newClassifyDataTable[0].length != trainRowLength)
  {
    validationRequestOutput.value = "";
    makeFileNotValidError(`First row contains ${newClassifyDataTable[0].length} colums, while training file has ${trainRowLength}`);
    return false;
  }

  for (let i = 1; i < newClassifyDataTable.length; ++i)
    if (newClassifyDataTable[i].length != trainRowLength)
    {
      validateRequestBtn.onclick = validateNewDataTableByLength;
      validationRequestOutput.value = "filter samples with invalid rows length"
      makeFileNotValidError(`Row #${i + 1} contains ${newClassifyDataTable[i].length} colums, while training file has ${trainRowLength}`);
      return false;
    }

  // валидация значений категоральных атрибутов
  for (const id in categoricalList)
  {
    const columID = categoricalList[id].GlobalID;
    for (let i = 1; i < newClassifyDataTable.length; ++i)
    {
      let val = parseFloat(newClassifyDataTable[i][columID]);
      if (isNaN(val)) val = newClassifyDataTable[i][columID];

      if(categoricalList[id].values.includes(val) == false)
      {
        validateRequestBtn.onclick = validateNewDataTableByCategoricalVals;
        validationRequestOutput.value = "filter samples by invalid categorical values"
        makeFileNotValidError(`Colum #${columID + 1} contains categorical value ${val} in row #${i + 1} which doesn't exists in the training file`);
        return false;
      }
    }
  }

  // валидация значений интервальных атрибутов
  for (const id in intervalList)
  {
    const columID = intervalList[id].GlobalID;
    for (let i = 1; i < newClassifyDataTable.length; ++i)
    {
      let val = newClassifyDataTable[i][columID];
      if (isNaN(parseFloat(val)))
      {
        validateRequestBtn.onclick = validateNewDataTableByIntervalVals;
        validationRequestOutput.value = "delete samples by invalid interval values"
        makeFileNotValidError(`Colum #${columID + 1} contains value "${val}" in row #${i + 1} which should be interval`);
        return false;
      }
    }
  }

  return true;
}

function validateTrainingTableByLength()
{
  const trainRowLength = tree.dataTable[0].length;
  for (let i = 0; i < tree.dataTable.length; ++i)
    if (tree.dataTable[i] != trainRowLength)
    {
      delete tree.dataTable[i];
    }
  tree.dataTable = tree.dataTable.filter(el => el != undefined);
}

// валидация по длине
function validateNewDataTableByLength()
{
  const trainRowLength = tree.dataTable[0].length;
  for (let i = 0; i < newClassifyDataTable.length; ++i)
    if (newClassifyDataTable[i].length != trainRowLength)
    {
      delete newClassifyDataTable[i];
    }
  newClassifyDataTable = newClassifyDataTable.filter(el => el != undefined);
  isNewClassifyDataTableValid();
}

// валидация значений категоральных атрибутов
function validateNewDataTableByCategoricalVals()
{
  const categoricalList = tree.categoricalAttributesList;

  for (const id in categoricalList)
  {
    const columID = categoricalList[id].GlobalID;
    for (let i = 1; i < newClassifyDataTable.length; ++i)
    {
      if (newClassifyDataTable[i] == undefined)
        continue;

      let val = parseFloat(newClassifyDataTable[i][columID]);
      if (isNaN(val)) val = newClassifyDataTable[i][columID];

      if(categoricalList[id].values.includes(val) == false)
      {
        delete newClassifyDataTable[i];
      }
    }
  }
  newClassifyDataTable = newClassifyDataTable.filter(el => el != undefined);
  isNewClassifyDataTableValid();
}

// валидация значений интервальных атрибутов
function validateNewDataTableByIntervalVals()
{
  const intervalList =  tree.intervalAttributesList;

  for (const id in intervalList)
  {
    const columID = intervalList[id].GlobalID;
    for (let i = 1; i < newClassifyDataTable.length; ++i)
    {
      if (newClassifyDataTable[i] == undefined)
        continue;

      let val = newClassifyDataTable[i][columID];
      if (isNaN(parseFloat(val)))
      {
        delete newClassifyDataTable[i];
      }
    }
  }
  newClassifyDataTable = newClassifyDataTable.filter(el => el != undefined);
  isNewClassifyDataTableValid();
}