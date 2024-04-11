import { DecisionTree } from "./decisionTreeImplementation.js";
import { maxDepthInput, minKnowledgeInput, newTrainingDataTable, builtInDataTable, ClassifyBtn,
    CreateTreeBtn, percentToClassify,NewCSV,BuiltInCSV,createTreeMethod,
    classifyMethod,ThisCSV,newClassifyDataTable } from "./bindings.js";

import { resetTreeTransformation } from "./transformations.js";

let tree = new DecisionTree(builtInDataTable, maxDepthInput, minKnowledgeInput);

CreateTreeBtn.addEventListener("click", async ()=>{
    resetTreeTransformation();
    tree.stopClassifying();
    tree.freeVisuals();

    if (createTreeMethod == NewCSV)
        tree = new DecisionTree(newTrainingDataTable, maxDepthInput, minKnowledgeInput);

    else
        tree = new DecisionTree(builtInDataTable, maxDepthInput, minKnowledgeInput);
});

ClassifyBtn.addEventListener("click", ()=>{
    tree.stopClassifying();
    
    if (classifyMethod == ThisCSV)
        tree.classifyDataTable(percentToClassify)
    else
        tree.classifyDataTable(100, newClassifyDataTable)
});