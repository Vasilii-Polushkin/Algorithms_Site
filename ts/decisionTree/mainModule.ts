import { loadCSV } from "./utilities/SVGhandler.js";
import { CSVurls } from "./utilities/CSVurls.js";
import { DecisionTree } from "./decisionTreeImplementation.js";

let tree = new DecisionTree(await loadCSV(CSVurls.heartAttack), 10, 15);
//console.log(tree);

//tree.classifyFromThisCSV(90);