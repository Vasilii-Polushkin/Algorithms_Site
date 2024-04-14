import { DecisionTree } from "./decisionTreeImplementation.js";
import { maxDepthInput, minKnowledgeInput, newTrainingDataTable, builtInDataTable, ClassifyBtn,
    CreateTreeBtn, percentToClassify,NewCSV,BuiltInCSV,createTreeMethod, handleTrainFileValidation,handleClassifyFileValidation,
    classifyMethod,ThisCSV,newClassifyDataTable, makeNoClassifyFileSelectedError,makeNoTrainingFileSelectedError } from "./bindings.js";

import { resetTreeTransformation } from "./transformations.js";

export let tree = new DecisionTree(builtInDataTable, maxDepthInput, minKnowledgeInput);
resetTreeTransformation();

CreateTreeBtn.addEventListener("click", async ()=>{
    tree.stopClassifying();
    tree.freeVisuals();

    CreateTreeBtn.setAttribute("disabled","true");

    if (createTreeMethod == NewCSV)
    {
        if (newTrainingDataTable != undefined)
        {
            if (handleTrainFileValidation())
                tree = new DecisionTree(newTrainingDataTable, maxDepthInput, minKnowledgeInput);
        }
        else
            makeNoTrainingFileSelectedError();
    }

    else
        tree = new DecisionTree(builtInDataTable, maxDepthInput, minKnowledgeInput);

    CreateTreeBtn.removeAttribute("disabled");

    resetTreeTransformation();
});

ClassifyBtn.addEventListener("click", ()=>{
    tree.stopClassifying();
    
    if (tree.dataTable == undefined)
    {
        makeNoTrainingFileSelectedError();
        return;
    }

    if (classifyMethod == ThisCSV)
        tree.classifyDataTable(percentToClassify);

    else
    {
        if (newClassifyDataTable == undefined)
        {
            makeNoClassifyFileSelectedError();
            return;
        }

        if (handleClassifyFileValidation())
            tree.classifyDataTable(100, newClassifyDataTable)
    }
});