import { DecisionTree } from "./decisionTreeImplementation.js";
import { maxDepthInput, minKnowledgeInput, newTrainingDataTable, builtInDataTable, ClassifyBtn, CreateTreeBtn, percentToClassify, NewCSV, createTreeMethod, classifyMethod, ThisCSV, newClassifyDataTable, makeNoClassifyFileSelectedError, makeNoTrainingFileSelectedError } from "./bindings.js";
import { resetTreeTransformation } from "./transformations.js";
let tree = new DecisionTree(builtInDataTable, maxDepthInput, minKnowledgeInput);
CreateTreeBtn.addEventListener("click", async () => {
    tree.stopClassifying();
    tree.freeVisuals();
    CreateTreeBtn.setAttribute("disabled", "true");
    if (createTreeMethod == NewCSV) {
        if (newTrainingDataTable != undefined)
            tree = new DecisionTree(newTrainingDataTable, maxDepthInput, minKnowledgeInput);
        else
            makeNoTrainingFileSelectedError();
    }
    else
        tree = new DecisionTree(builtInDataTable, maxDepthInput, minKnowledgeInput);
    CreateTreeBtn.removeAttribute("disabled");
    resetTreeTransformation();
});
ClassifyBtn.addEventListener("click", () => {
    tree.stopClassifying();
    if (classifyMethod == ThisCSV)
        tree.classifyDataTable(percentToClassify);
    else {
        if (newClassifyDataTable == undefined)
            makeNoClassifyFileSelectedError();
        else
            tree.classifyDataTable(100, newClassifyDataTable);
    }
});
//# sourceMappingURL=mainModule.js.map