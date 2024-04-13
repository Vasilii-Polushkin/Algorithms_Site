import { heartAttackDataTable, dataTablesArray } from "../../../../csvs/BuiltInCsvs.js";
export let newTrainingDataTable, builtInDataTable, newClassifyDataTable;
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
CreateTreeRadioNewCSV.addEventListener('click', () => {
    createTreeMethod = NewCSV;
});
const CreateTreeRadioBuilInCSV = document.getElementById("CreateTreeRadioBuilInCSV");
CreateTreeRadioBuilInCSV.addEventListener('click', () => {
    createTreeMethod = BuiltInCSV;
});
// classify tree method radio
const ClassifyRadioNewCSV = document.getElementById("ClassifyRadioNewCSV");
ClassifyRadioNewCSV.addEventListener('click', () => {
    classifyMethod = NewCSV;
});
const ClassifyRadioThisCSV = document.getElementById("ClassifyRadioThisCSV");
ClassifyRadioThisCSV.addEventListener('click', () => {
    classifyMethod = ThisCSV;
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
// toasts
const trainingToast = document.getElementById('noTrainingFileToast');
const noTrainingFileToast = bootstrap.Toast.getOrCreateInstance(trainingToast);
export function makeNoTrainingFileSelectedError() {
    noTrainingFileToast.show();
}
const ClassifyToast = document.getElementById('noClassifyFileToast');
const noClassifyFileToast = bootstrap.Toast.getOrCreateInstance(ClassifyToast);
export function makeNoClassifyFileSelectedError() {
    noClassifyFileToast.show();
}
const fileValidationOutput = document.getElementById("fileValidationOutput");
const validationToast = document.getElementById('notValidFileToast');
const notValidFileToast = bootstrap.Toast.getOrCreateInstance(validationToast);
export function makeFileNotValidError(output) {
    fileValidationOutput.value = output;
    notValidFileToast.show();
}
//--------------------------------------------- buit in datatable --------------------------------
builtInDataTable = heartAttackDataTable;
const BuiltInDatasetSelector = document.getElementById("BuiltInDatasetSelector");
BuiltInDatasetSelector.addEventListener('change', () => {
    builtInDataTable = dataTablesArray[BuiltInDatasetSelector.selectedIndex];
});
// -------------------------------------------- file load------------------------------------------
function parseCSV(text) {
    let prevSymbol = '', currString = [''], result = [currString], index = 0, stringIndex = 0, insideQuotes = true, symbol;
    for (symbol of text) {
        if (symbol === '"') {
            if (insideQuotes && symbol === prevSymbol)
                currString[index] += symbol;
            insideQuotes = !insideQuotes;
        }
        else if (symbol === ',' && insideQuotes)
            symbol = currString[++index] = '';
        else if (symbol === '\n' && insideQuotes) {
            if (prevSymbol === '\r')
                currString[index] = currString[index].slice(0, -1);
            currString = result[++stringIndex] = [symbol = ''];
            index = 0;
        }
        else
            currString[index] += symbol;
        prevSymbol = symbol;
    }
    return result;
}
const TrainingCSVPathElement = document.getElementById('chooseTrainingFile');
TrainingCSVPathElement.addEventListener('change', () => {
    readTrainFile(TrainingCSVPathElement.files[0]);
    const newCSVFilename = TrainingCSVPathElement.files[0].name;
    if (/^\s*$/.test(newCSVFilename)) {
        $("#file-upload-train").removeClass('active');
        $("#noTrainigFile").text("No file chosen...");
    }
    else {
        $("#file-upload-train").addClass('active');
        $("#noTrainigFile").text(newCSVFilename);
    }
});
const ClassificationCSVPathElement = document.getElementById('chooseClassificationFile');
ClassificationCSVPathElement.addEventListener('change', () => {
    readClassifyFile(ClassificationCSVPathElement.files[0]);
    const newCSVFilename = ClassificationCSVPathElement.files[0].name;
    if (/^\s*$/.test(newCSVFilename)) {
        $("#file-upload-classify").removeClass('active');
        $("#noClassificationFile").text("No file chosen...");
    }
    else {
        $("#file-upload-classify").addClass('active');
        $("#noClassificationFile").text(newCSVFilename);
    }
});
function readTrainFile(filename) {
    let reader = new FileReader();
    reader.readAsText(filename);
    reader.onload = function () {
        newTrainingDataTable = parseCSV(reader.result);
        const err = isDataTableValid(newTrainingDataTable);
        if (err != undefined) {
            newTrainingDataTable = undefined;
            $("#file-upload-train").removeClass('active');
            $("#noTrainigFile").text("No file chosen...");
            makeFileNotValidError(err);
            return;
        }
    };
    reader.onerror = function () {
        makeFileNotValidError(reader.error);
    };
}
function isDataTableValid(dataTable) {
    if (dataTable.length <= 1)
        return "File Has Only One Row";
    const rowLenght = dataTable[0].length;
    for (let i = 1; i < dataTable.length; ++i)
        if (dataTable[i].length != rowLenght)
            return `Row #${i + 1} contains ${dataTable[i].length} colums, while previous has ${rowLenght}`;
}
export function isNewClassifyDataTableValid(trainRowLength, categoricalList) {
    for (let i = 0; i < newClassifyDataTable.length; ++i)
        if (newClassifyDataTable[i].length != trainRowLength) {
            makeFileNotValidError(`Row #${i + 1} contains ${newClassifyDataTable[i].length} colums, while training file has ${trainRowLength}`);
            return false;
        }
    for (const id in categoricalList) {
        const columID = categoricalList[id].GlobalID;
        for (let i = 1; i < newClassifyDataTable.length; ++i) {
            let val = parseFloat(newClassifyDataTable[i][columID]);
            if (isNaN(val))
                val = newClassifyDataTable[i][columID];
            if (categoricalList[id].values.includes(val) == false) {
                makeFileNotValidError(`Colum #${columID + 1} contains categorical value ${val} in row #${i + 1} which doesn't exists in the training file`);
                return false;
            }
        }
    }
    return true;
}
function readClassifyFile(filename) {
    let reader = new FileReader();
    reader.readAsText(filename);
    reader.onload = function () {
        newClassifyDataTable = parseCSV(reader.result);
        let err = isDataTableValid(newClassifyDataTable);
        if (err != undefined) {
            newClassifyDataTable = undefined;
            $("#file-upload-classify").removeClass('active');
            $("#noClassificationFile").text("No file chosen...");
            makeFileNotValidError(err);
            return;
        }
    };
    reader.onerror = function () {
        makeFileNotValidError(reader.error);
    };
}
//# sourceMappingURL=bindings.js.map