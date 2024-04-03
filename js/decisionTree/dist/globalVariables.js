"use strict";
exports.__esModule = true;
exports.getAttributesLists = exports.categoricalAttributesList = exports.intervalAttributesList = exports.dataTable = void 0;
var condition_1 = require("./utilities/condition");
// таблица, где первая строка с названиями колонок
exports.dataTable = [];
function sortUnique(arr) {
    if (arr.length === 0)
        return arr;
    arr = arr.sort();
    var ret = [arr[0]];
    for (var i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
        if (arr[i - 1] !== arr[i])
            ret.push(arr[i]);
    }
    return ret;
}
function adjustMedians(arr) {
    var res = [];
    for (var i = 0; i < arr.length - 1; ++i)
        res.push((arr[i] + arr[i + 1]) / 2);
    return res;
}
//обрабатываем каждый столбец(атрибут) поочередно
//сначала определяем тип атрибута
//потом преобразуем столб в сет и находим всевозможные условия, которые могут быть в узлах дерева
function getAttributesLists() {
    var newIntervalAttributesList = [];
    var newCategoricalAttributesList = [];
    var columLength = exports.dataTable.length;
    var rowLength = exports.dataTable[0].length;
    for (var columID = 0; columID < columLength - 1; ++columID) {
        var attribuleType = condition_1.attributeTypes.INTERVAL;
        var colum = [];
        for (var rowID = 1; rowID < rowLength; ++rowID)
            colum.push(exports.dataTable[rowID][columID]);
        sortUnique(colum);
        // deducing colum(attribute) type
        if (colum.length <= 10)
            attribuleType = condition_1.attributeTypes.CATEGORICAL;
        else {
            for (var rowID = 1; rowID < rowLength; ++rowID) {
                var floatNum = parseFloat(colum[rowID]);
                if (isNaN(floatNum)) {
                    attribuleType = condition_1.attributeTypes.CATEGORICAL;
                    break;
                }
            }
        }
        if (attribuleType == condition_1.attributeTypes.CATEGORICAL) {
            newCategoricalAttributesList.push(new condition_1.attribute(exports.dataTable[0][columID], colum, false));
        }
        else {
            adjustMedians(colum);
            var usedArr = [];
            usedArr.length = colum.length;
            usedArr.fill(false);
            newIntervalAttributesList.push(new condition_1.attribute(exports.dataTable[0][columID], colum, usedArr));
        }
    }
    return [newIntervalAttributesList, exports.categoricalAttributesList];
}
exports.getAttributesLists = getAttributesLists;
