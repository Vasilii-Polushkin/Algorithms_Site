import { loadBuiltInCSV } from "./utilities/SVGhandler.js";
import { CSVurls } from "./utilities/CSVurls.js";
import { DecisionTree } from "./decisionTreeImplementation.js";
import { maxDepthInput, minKnowledgeInput, newCSVDataTable, builtInCSVFilename, ClassifyBtn,
    CreateTreeBtn, percentToClassify,resetTreeTransformation,NewCSV,BuiltInCSV,createTreeMethod } from "./bindings.js";


let tree = new DecisionTree(await loadBuiltInCSV(CSVurls.heartAttack), maxDepthInput, minKnowledgeInput);

CreateTreeBtn.addEventListener("click", async ()=>{
    resetTreeTransformation();
    tree.freeVisuals();

    if (createTreeMethod == NewCSV)
        tree = new DecisionTree(newCSVDataTable, maxDepthInput, minKnowledgeInput);

    else
        tree = new DecisionTree(await loadBuiltInCSV(CSVurls.heartAttack), maxDepthInput, minKnowledgeInput);
});

ClassifyBtn.addEventListener("click", ()=>{
    tree.classifyDataTable(percentToClassify)
});