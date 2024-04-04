import { loadCSV } from "./utilities/SVGhandler.js";
import { DecisionTree } from "./decisionTreeImplementation.js";
import { CSVurls } from "./utilities/CSVurls.js";
// первая строка - названия столбцов
// последний столб - название класса
//Global.dataTable = await loadCSV(CSVurls.iris);
//console.table(Global.dataTable);
let tree = new DecisionTree(await loadCSV(CSVurls.iris));
console.log(tree);
//# sourceMappingURL=mainModule.js.map