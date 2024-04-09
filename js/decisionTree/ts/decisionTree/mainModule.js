import { loadCSV } from "./utilities/SVGhandler.js";
import { CSVurls } from "./utilities/CSVurls.js";
import { DecisionTree } from "./decisionTreeImplementation.js";
import { maxDepthInput, minKnowledgeInput, ClassifyBtn } from "./bindings.js";
let tree = new DecisionTree(await loadCSV(CSVurls.heartAttack), maxDepthInput, minKnowledgeInput);
ClassifyBtn.addEventListener("click", () => { tree.classifyFromThisCSV(90); });
//console.log(tree);
//tree.classifyFromThisCSV(90);
//# sourceMappingURL=mainModule.js.map