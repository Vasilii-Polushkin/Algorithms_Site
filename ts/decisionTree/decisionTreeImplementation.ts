import { attributeTypes, attribute} from "./utilities/attribute.js";
import { sortUnique, calcEnthrophy, xLog2x, adjustMedians} from "./utilities/math.js";

//обрабатываем каждый столбец(атрибут) поочередно
//сначала определяем тип атрибута
//потом преобразуем столб в сет и находим всевозможные условия, которые могут быть в узлах дерева

export class TreeNode
{
    children: TreeNode[] = [];

    attributeType: attributeTypes | null = null;
    attributeID: number | null = null;
    conditionValue: number | null = null;

    entropy: number = 0;
    samplesAmount: number = 0;
    samplesIDs: number[] = [];

    constructor()
    {
    };

    isLeaf():boolean
    {
        return (this.attributeID == null);
    }
    // для каждого неиспользовавшегося условия из списка считаем энтропию для текущего списка семплов
    // выбираем лучшее условие (с наименьшей энтропией) и добавляем ноду
    addConditionAndChildren(minKnowledge: number | null,
        intervalAttributesList: attribute[],
        categoricalAttributesList: attribute[],
        dataTable: string[][]): void
    {
        if (this.entropy == 0)
            return;
        
        // interval
        let bestIntervalAttributeID = 0;
        let bestIntervalValueID = 0;
        let currMinIntervalEntrophy = 999;
        let bestLeftTotal = 0;
        let bestRightTotal = 0;
        let bestLeftIDs: number[] = [];
        let bestRightIDs: number[] = [];
        let bestRightEnthrophy = 0;
        let bestLeftEnthrophy = 0;

        intervalAttributesList.forEach((attribute) => {
            for (let i = 0; i < attribute.values.length; ++i)
            {
                if (attribute.used[i] == true)
                    continue;

                let leftTotal = 0;
                let rightTotal = 0;
                let leftIDs: number[] = [];
                let rightIDs: number[] = [];

                const breakpointValue = attribute.values[i];

                const leftSamplesClasses = {};
                const rightSamplesClasses = {};

                this.samplesIDs.forEach((id) => {
                    const currClassName = dataTable[id][dataTable[0].length - 1];
                    if (parseFloat(dataTable[id][attribute.id]) <= breakpointValue)
                    {
                        leftIDs.push(id);
                        if (leftSamplesClasses[currClassName] == undefined)
                            leftSamplesClasses[currClassName] = 0;
                        leftSamplesClasses[currClassName]++;
                        leftTotal++;
                    }
                    else
                    {
                        rightIDs.push(id);
                        if (rightSamplesClasses[currClassName] == undefined)
                            rightSamplesClasses[currClassName] = 0;
                        rightSamplesClasses[currClassName]++;
                        rightTotal++;
                    }
                });

                let leftSamplesClassesProbabilities: number[] = [];
                for (let key in leftSamplesClasses)
                    leftSamplesClassesProbabilities.push(leftSamplesClasses[key] / leftTotal);
                
                let rightSamplesClassesProbabilities: number[] = [];
                for (let key in rightSamplesClasses)
                    rightSamplesClassesProbabilities.push(rightSamplesClasses[key] / rightTotal);

                const leftEnthrophy = calcEnthrophy(leftSamplesClassesProbabilities);
                const rightEnthrophy = calcEnthrophy(rightSamplesClassesProbabilities);

                const newEntrophy = 
                    (leftTotal / (leftTotal + rightTotal)) * leftEnthrophy +
                    (rightTotal / (leftTotal + rightTotal)) * rightEnthrophy;

                if (newEntrophy < currMinIntervalEntrophy)
                {
                    currMinIntervalEntrophy = newEntrophy;
                    bestIntervalAttributeID = attribute.id;
                    bestIntervalValueID = i;

                    bestLeftEnthrophy = leftEnthrophy;
                    bestRightEnthrophy = rightEnthrophy;
                    bestLeftTotal = leftTotal;
                    bestRightTotal = rightTotal;
                    bestLeftIDs = leftIDs;
                    bestRightIDs = rightIDs;
                }
            }
        });

        // categorical
        let bestCategoricalAttributeID = 0;
        let bestCategoricalValueID = 0;
        let currMinCategoricalEntrophy = 999;
        categoricalAttributesList.forEach((attribute) => {

        });

        if (minKnowledge && Math.min(currMinIntervalEntrophy, currMinCategoricalEntrophy) < minKnowledge)
            return;

        if (currMinIntervalEntrophy < currMinCategoricalEntrophy)
        {
            intervalAttributesList[bestIntervalAttributeID].used[bestIntervalValueID] = true;
            this.attributeType = attributeTypes.INTERVAL;
            this.attributeID = bestIntervalAttributeID;
            this.conditionValue = intervalAttributesList[bestIntervalAttributeID].values[bestIntervalValueID];

            // left child
            let leftChild = new TreeNode;
            leftChild.entropy = bestLeftEnthrophy;
            leftChild.samplesAmount = bestLeftTotal;
            leftChild.samplesIDs = bestLeftIDs;
            this.children.push(leftChild);

            // right child
            let rightChild = new TreeNode;
            rightChild.entropy = bestRightEnthrophy;
            rightChild.samplesAmount = bestRightTotal;
            rightChild.samplesIDs = bestRightIDs;
            this.children.push(rightChild);
        }
        else
        {

        }
    }
}
export class DecisionTree
{
    // таблица, где первая строка с названиями колонок
    dataTable: string[][];

    // все возможные условия в нодах
    intervalAttributesList: attribute[] = [];
    categoricalAttributesList: attribute[] = [];

    maxDepth: number | undefined;
    minKnowledge: number | undefined;

    rootNode: TreeNode | null = null;
    
    buildTreeDFS(currNode: TreeNode, currDepth: number): void
    {
        currNode.addConditionAndChildren(this.minKnowledge,
            this.intervalAttributesList, this.categoricalAttributesList, this.dataTable);

        if (this.maxDepth != undefined && currDepth == this.maxDepth)
            return;

        currNode.children.forEach((childNode: TreeNode) => {
            this.buildTreeDFS(childNode, currDepth + 1);
        });
    }

    fillAttributesLists(): void
    {
        const columLength = this.dataTable.length;
        const rowLength = this.dataTable[0].length;

        for (let columID = 0; columID < rowLength - 1; ++columID)
        {
            let attribuleType = attributeTypes.INTERVAL;
            let colum:any[] = [];

            for (let rowID = 1; rowID < columLength; ++rowID)
                colum.push(this.dataTable[rowID][columID]);

            colum = sortUnique(colum);

             //deducing colum(attribute) type
             if (colum.length <= 10)
                attribuleType = attributeTypes.CATEGORICAL;
            
                for (let rowID = 0; rowID < colum.length; ++rowID)
                {
                    let floatNum = parseFloat(colum[rowID]);
                    if (isNaN(floatNum))
                    {
                        attribuleType = attributeTypes.CATEGORICAL;
                        break;
                    }
                    // для категоральных не очень мб
                    else
                    {
                        colum[rowID] = floatNum;
                    }
                }

            // решаем куда идет атрибут
            if (attribuleType == attributeTypes.CATEGORICAL)
            {
                this.categoricalAttributesList.push(new attribute
                    (columID, colum, false)
                );
            }
            else
            {
                colum = adjustMedians(colum);
                let usedArr:boolean[] = [];
                usedArr.length = colum.length;
                usedArr.fill(false);

                this.intervalAttributesList.push(new attribute
                    (columID, colum, usedArr)
                );
            }
        }
    }

    constructor(newDataTable: string[][], maxDepth?: number, minKnowledge?: number)
    {
        this.dataTable = newDataTable;
        this.fillAttributesLists();

        this.maxDepth = maxDepth;
        this.minKnowledge = minKnowledge;

        this.rootNode = new TreeNode();
        this.rootNode.samplesAmount = this.dataTable.length - 1;
        for (let i = 1; i <= this.rootNode.samplesAmount; ++i)
            this.rootNode.samplesIDs.push(i);
        
            const samplesClasses = {};
            
            this.rootNode.samplesIDs.forEach((id) => {
                if (samplesClasses[this.dataTable[id][this.dataTable[0].length - 1]] == undefined)
                    samplesClasses[this.dataTable[id][this.dataTable[0].length - 1]] = 0;
                samplesClasses[this.dataTable[id][this.dataTable[0].length - 1]] ++;
            });

            let samplesClassesProbabilities: number[] = [];

            for (let key in samplesClasses)
                samplesClassesProbabilities.push(samplesClasses[key] / (this.dataTable.length - 1));

            //console.log(samplesClassesProbabilities);
        this.rootNode.entropy = calcEnthrophy(samplesClassesProbabilities);
            //console.log(this.rootNode.entropy)
        this.buildTreeDFS(this.rootNode, 0);
    }
}