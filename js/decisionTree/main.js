import {loadCSV} from "./utilities/SVGhandler.js";

// первая строка - названия столбцов
// последний столб - название класса
let dataTable = await loadCSV("../../csvs/iris.csv");
//console.log(dataTable);
