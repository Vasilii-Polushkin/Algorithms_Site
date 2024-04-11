import { DecisionTree } from "./decisionTreeImplementation.js";
import { maxDepthInput, minKnowledgeInput, newTrainingDataTable, builtInDataTable, ClassifyBtn, CreateTreeBtn, percentToClassify, NewCSV, createTreeMethod, classifyMethod, ThisCSV, newClassifyDataTable } from "./bindings.js";
import { resetTreeTransformation } from "./transformations.js";
let tree = new DecisionTree(builtInDataTable, maxDepthInput, minKnowledgeInput);
CreateTreeBtn.addEventListener("click", async () => {
    resetTreeTransformation();
    tree.freeVisuals();
    if (createTreeMethod == NewCSV)
        tree = new DecisionTree(newTrainingDataTable, maxDepthInput, minKnowledgeInput);
    else
        tree = new DecisionTree(builtInDataTable, maxDepthInput, minKnowledgeInput);
});
ClassifyBtn.addEventListener("click", () => {
    //console.log(classifyMethod)
    if (classifyMethod == ThisCSV)
        tree.classifyDataTable(percentToClassify);
    else
        tree.classifyDataTable(100, newClassifyDataTable);
});
//# sourceMappingURL=mainModule.js.map