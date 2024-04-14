import { heartAttackDataTable, dataTablesArray } from "../../../../csvs/BuiltInCsvs.js";
import { tree } from "./mainModule.js";
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
const validationRequestOutput = document.getElementById('validationRequestOutput');
const fileValidationOutput = document.getElementById("fileValidationOutput");
const validationToast = document.getElementById('notValidFileToast');
const notValidFileToast = bootstrap.Toast.getOrCreateInstance(validationToast);
export function makeFileNotValidError(errOutput, requestOutput) {
    validationRequestOutput.value = requestOutput;
    fileValidationOutput.value = errOutput;
    notValidFileToast.show();
}
const fileValidationOutputWithNoValidateBtn = document.getElementById("fileValidationOutputWithNoValidateBtn");
const validationToastWithNoValidateBtn = document.getElementById('notValidFileToastWithNoValidateBtn');
const notValidFileToastWithNoValidateBtn = bootstrap.Toast.getOrCreateInstance(validationToastWithNoValidateBtn);
export function makeFileNotValidErrorWithNoValidateBtn(output) {
    fileValidationOutputWithNoValidateBtn.value = output;
    notValidFileToastWithNoValidateBtn.show();
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
    if (TrainingCSVPathElement.files[0] == undefined)
        return;
    const newCSVFilename = TrainingCSVPathElement.files[0].name;
    readTrainFile(TrainingCSVPathElement.files[0]);
    $("#file-upload-train").addClass('active');
    $("#noTrainigFile").text(newCSVFilename);
});
const ClassificationCSVPathElement = document.getElementById('chooseClassificationFile');
ClassificationCSVPathElement.addEventListener('change', () => {
    readClassifyFile(ClassificationCSVPathElement.files[0]);
    const newCSVFilename = ClassificationCSVPathElement.files[0].name;
    $("#file-upload-classify").addClass('active');
    $("#noClassificationFile").text(newCSVFilename);
});
const validateRequestBtn = document.getElementById('validateRequest');
/* ---------------- ВИЗУАЛИЗАЦИЯ + СБРОС ФАЙЛА -------------------- */
function SetNoClassificationFile() {
    newClassifyDataTable = undefined;
    $("#file-upload-classify").removeClass('active');
    $("#noClassificationFile").text("No file chosen...");
}
function SetNoTrainingFile() {
    newTrainingDataTable = undefined;
    $("#file-upload-train").removeClass('active');
    $("#noTrainigFile").text("No file chosen...");
}
/* ---------------- ФУНКИИ, ЗАКРЕПЛЕННЫЕ ЗА КНОПКАМ ЧТЕНИЯ ФАЙЛА -------------------- */
function readTrainFile(filename) {
    let reader = new FileReader();
    reader.readAsText(filename);
    reader.onload = function () {
        newTrainingDataTable = parseCSV(reader.result);
        handleTrainFileValidation();
    };
    reader.onerror = function () {
        makeFileNotValidErrorWithNoValidateBtn(reader.error);
        SetNoTrainingFile();
    };
}
function readClassifyFile(filename) {
    let reader = new FileReader();
    reader.readAsText(filename);
    reader.onload = function () {
        newClassifyDataTable = parseCSV(reader.result);
    };
    reader.onerror = function () {
        makeFileNotValidErrorWithNoValidateBtn(reader.error);
        SetNoClassificationFile();
    };
}
/* ---------------- ФУНКИИ, ПОЛНОСТЬ ОТВЕЧАЮЩИЕ ЗА ВАЛИДАЦИЮ ПРИ ВЫБОРЕ ФАЙЛА И ЕГО ИСПОЛЬЗОВАНИИ  -------------------- */
export function handleTrainFileValidation() {
    const errStrings = getTrainingTableErrStrings();
    if (errStrings == undefined)
        return true;
    if (errStrings.btnString == undefined) {
        makeFileNotValidErrorWithNoValidateBtn(errStrings.errString);
        SetNoTrainingFile();
    }
    else {
        validateRequestBtn.onclick = filterTrainingTableByLength;
        makeFileNotValidError(errStrings.errString, errStrings.btnString);
    }
    return false;
}
export function handleClassifyFileValidation() {
    const errStrings = getClassifyTableErrStrings();
    if (errStrings == undefined)
        return true;
    if (errStrings.btnString == undefined) {
        makeFileNotValidErrorWithNoValidateBtn(errStrings.errString);
        SetNoClassificationFile();
    }
    else {
        switch (errStrings.btnString) {
            case "Filter file by row length":
                validateRequestBtn.onclick = filterClassifyTableByLength;
                break;
            case "Filter file by categorical values":
                validateRequestBtn.onclick = filterClassifyTableByCategoricalVals;
                break;
            case "Filter file by interval values":
                validateRequestBtn.onclick = filterClassifyTableByIntervalVals;
                break;
        }
        makeFileNotValidError(errStrings.errString, errStrings.btnString);
    }
    return false;
}
/* ----------------------- ПОЛУЧЕНИЕ СТРОКИ С ОШИБКОЙ --------------------- */
function getTrainingTableErrStrings() {
    if (newTrainingDataTable.length <= 1)
        return { errString: "File Has Only One Row", btnString: undefined };
    const rowLenght = newTrainingDataTable[0].length;
    for (let i = 1; i < newTrainingDataTable.length; ++i)
        if (newTrainingDataTable[i].length != rowLenght)
            return { errString: `Row #${i + 1} contains ${newTrainingDataTable[i].length} colums, while previous has ${rowLenght}`, btnString: "Filter training file by row length" };
}
function getClassifyTableErrStrings() {
    // ошибка длины таблицы, который нельзя отфильтровать
    const trainRowLength = tree.dataTable[0].length;
    if (newClassifyDataTable[0].length != trainRowLength)
        return { errString: `First row contains ${newClassifyDataTable[0].length} colums, while training file has ${trainRowLength}`, btnString: undefined };
    // ошибка длины
    const lengthErrInfo = getClassifyTableLengthErrorInfo();
    if (lengthErrInfo != undefined)
        return { errString: `Row #${lengthErrInfo.rowID} contains ${lengthErrInfo.classifyRowLength} colums, while training file has ${lengthErrInfo.trainRowLength}`, btnString: "Filter file by row length" };
    // ошибка значений категоральных атрибутов
    const catericalErrInfo = getClassifyTableCategoricalValsErrorInfo();
    if (catericalErrInfo != undefined)
        return { errString: `Colum #${catericalErrInfo.columID} contains categorical value ${catericalErrInfo.invalidValue} in row #${catericalErrInfo.rowID} which doesn't exists in the training file`, btnString: "Filter file by categorical values" };
    // ошибка значений интервальных атрибутов
    const intervalErrInfo = getClassifyTableIntervalValsErrorInfo();
    if (intervalErrInfo != undefined)
        return { errString: `Colum #${intervalErrInfo.columID} contains value "${intervalErrInfo.invalidValue}" in row #${intervalErrInfo.rowID} which should be interval`, btnString: "Filter file by interval values" };
}
// utils
function getClassifyTableLengthErrorInfo() {
    const trainRowLength = tree.dataTable[0].length;
    for (let i = 1; i < newClassifyDataTable.length; ++i)
        if (newClassifyDataTable[i].length != trainRowLength)
            return { rowID: i + 1, classifyRowLength: newClassifyDataTable[i].length, trainRowLength: trainRowLength };
}
function getClassifyTableCategoricalValsErrorInfo() {
    const categoricalList = tree.categoricalAttributesList;
    for (const id in categoricalList) {
        const columID = categoricalList[id].GlobalID;
        for (let i = 1; i < newClassifyDataTable.length; ++i) {
            let val = parseFloat(newClassifyDataTable[i][columID]);
            if (isNaN(val))
                val = newClassifyDataTable[i][columID];
            if (categoricalList[id].values.includes(val) == false)
                return { columID: columID + 1, invalidValue: val, rowID: i + 1 };
        }
    }
}
function getClassifyTableIntervalValsErrorInfo() {
    const intervalList = tree.intervalAttributesList;
    for (const id in intervalList) {
        const columID = intervalList[id].GlobalID;
        for (let i = 1; i < newClassifyDataTable.length; ++i) {
            let val = newClassifyDataTable[i][columID];
            if (isNaN(parseFloat(val)))
                return { columID: columID + 1, invalidValue: val, rowID: i + 1 };
        }
    }
}
/* ----------------------------- ФИЛЬТРАЦИЯ ------------------------------- */
function filterTrainingTableByLength() {
    const trainRowLength = newTrainingDataTable[0].length;
    for (let i = 0; i < newTrainingDataTable.length; ++i) {
        if (newTrainingDataTable[i].length != trainRowLength) {
            delete newTrainingDataTable[i];
        }
    }
    newTrainingDataTable = newTrainingDataTable.filter(el => el != undefined);
    newTrainingDataTable.forEach(el => {
        el.length = trainRowLength;
    });
}
function filterClassifyTableByLength() {
    const trainRowLength = tree.dataTable[0].length;
    for (let i = 0; i < newClassifyDataTable.length; ++i)
        if (newClassifyDataTable[i].length != trainRowLength) {
            delete newClassifyDataTable[i];
        }
    newClassifyDataTable = newClassifyDataTable.filter(el => el != undefined);
    newClassifyDataTable.forEach(el => {
        el.length = trainRowLength;
    });
}
function filterClassifyTableByCategoricalVals() {
    const categoricalList = tree.categoricalAttributesList;
    for (const id in categoricalList) {
        const columID = categoricalList[id].GlobalID;
        for (let i = 1; i < newClassifyDataTable.length; ++i) {
            if (newClassifyDataTable[i] == undefined)
                continue;
            let val = parseFloat(newClassifyDataTable[i][columID]);
            if (isNaN(val))
                val = newClassifyDataTable[i][columID];
            if (categoricalList[id].values.includes(val) == false) {
                delete newClassifyDataTable[i];
            }
        }
    }
    newClassifyDataTable = newClassifyDataTable.filter(el => el != undefined);
}
function filterClassifyTableByIntervalVals() {
    const intervalList = tree.intervalAttributesList;
    for (const id in intervalList) {
        const columID = intervalList[id].GlobalID;
        for (let i = 1; i < newClassifyDataTable.length; ++i) {
            if (newClassifyDataTable[i] == undefined)
                continue;
            let val = newClassifyDataTable[i][columID];
            if (isNaN(parseFloat(val))) {
                delete newClassifyDataTable[i];
            }
        }
    }
    newClassifyDataTable = newClassifyDataTable.filter(el => el != undefined);
}
//# sourceMappingURL=bindings.js.map