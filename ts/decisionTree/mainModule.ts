import { loadCSV } from "./utilities/SVGhandler.js";
import { CSVurls } from "./utilities/CSVurls.js";
import { DecisionTree } from "./decisionTreeImplementation.js";
import { maxDepthInput, minKnowledgeInput, newCSVFilename, builtInCSVFilename, ClassifyBtn,
    CreateTreeBtn, percentToClassify,resetTreeTransformation,NewCSV,BuiltInCSV,createTreeMethod } from "./bindings.js";


let tree = new DecisionTree(await loadCSV(CSVurls.heartAttack), maxDepthInput, minKnowledgeInput);

CreateTreeBtn.addEventListener("click", async ()=>{
    resetTreeTransformation();
    tree.freeVisuals();

    tree = new DecisionTree(await loadCSV(
        (createTreeMethod == BuiltInCSV? builtInCSVFilename: newCSVFilename)
        ), maxDepthInput, minKnowledgeInput);
});

ClassifyBtn.addEventListener("click", ()=>{
    tree.classifyDataTable(percentToClassify)
});