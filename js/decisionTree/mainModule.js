import { loadCSV } from "./utilities/SVGhandler.js";
import { DecisionTree } from "./decisionTreeImplementation.js";
import { CSVurls } from "./utilities/CSVurls.js";
// первая строка - названия столбцов
// последний столб - название класса
//Global.dataTable = await loadCSV(CSVurls.iris);
//console.table(Global.dataTable);
let tree = new DecisionTree(await loadCSV(CSVurls.heartAttack));
console.log(tree);
tree.classifyFromThisCSV(90);
//# sourceMappingURL=mainModule.js.map