import { attributeTypes, attribute} from "./utilities/attribute.js";
import { sortUnique, calcEnthrophy, xLog2x, adjustMedians, incrementedValue} from "./utilities/math.js";

//обрабатываем каждый столбец(атрибут) поочередно
//сначала определяем тип атрибута
//потом преобразуем столб в сет и находим всевозможные условия, которые могут быть в узлах дерева

export class TreeNode
{
    children: TreeNode[] = [];

    attributeType: attributeTypes | null = null;
    attributeID: number | null = null;
    conditionValue: number | string | null = null; // string некруто

    entrophy: number = 0;
    samplesAmount: number = 0;
    samplesIDs: number[] = [];

    constructor()
    {
    };

    isLeaf():boolean
    {
        return (this.attributeID == null);
    }

    mostPopularClassName(dataTable: string[][]): string
    {
        const classes = {};
        this.samplesIDs.forEach((id)=>{
            classes[dataTable[id][dataTable[0].length - 1]] = 
                incrementedValue(classes[dataTable[id][dataTable[0].length - 1]]);
        });

        let maxVal:number = -1;
        let maxKey:string;
        for (let i in classes)
        {
            if (classes[i] > maxVal)
            {
                maxVal = classes[i];
                maxKey = i;
            }
        }
        return maxKey;
    }
    // для каждого неиспользовавшегося условия из списка считаем энтропию для текущего списка семплов
    // выбираем лучшее условие (с наименьшей энтропией) и добавляем ноду
    addConditionAndChildren(
        intervalAttributesList: attribute[],
        categoricalAttributesList: attribute[],
        dataTable: string[][],
        minKnowledge?: number):void
    {
        if (this.entrophy == 0)
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

                const breakpointValue = Number(attribute.values[i]);

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
        let bestCategoricalSamplesIds: number[][] = [];
        let bestEnthrophies: number[] = [];
        let currMinCategoricalEntrophy = 999;

        categoricalAttributesList.forEach((attribute) => {
            if (categoricalAttributesList[attribute.id].used == true)
                return;

            let categoricalSamplesIds: number[][] = [];
            categoricalSamplesIds.length =  attribute.values.length;
            for (let i in categoricalSamplesIds)
                categoricalSamplesIds[i] = [];

            let categoricalClassesAmounts: Object[] = [];
            categoricalClassesAmounts.length = attribute.values.length;
            for (let i in categoricalClassesAmounts)
                categoricalClassesAmounts[i] = {};

            this.samplesIDs.forEach(id => {
                for (let i in attribute.values)
                {
                    if (attribute.values[i] == dataTable[id][attribute.id])
                    {
                        categoricalClassesAmounts[i][dataTable[id][dataTable[0].length - 1]] = 
                            incrementedValue(categoricalClassesAmounts[i][dataTable[id][dataTable[0].length - 1]]);
                        categoricalSamplesIds[i].push(id);
                        break;
                    }
                }
            });

            let currEntrophy = 0;
            let entropies:number[] = [];

            for (let i in categoricalClassesAmounts)
            {
                const total = categoricalSamplesIds[i].length;

                let samplesClassesProbabilities:number[] = [];

                for (let key in categoricalClassesAmounts[i])
                {
                    samplesClassesProbabilities.push(categoricalClassesAmounts[i][key]/ total);
                }

                entropies[i] = calcEnthrophy(samplesClassesProbabilities);
                currEntrophy -= entropies[i] * total / this.samplesAmount;
            }

            if (currEntrophy < currMinCategoricalEntrophy)
            {
                bestEnthrophies = entropies;
                currMinCategoricalEntrophy = currEntrophy;
                bestCategoricalAttributeID = attribute.id;
                bestCategoricalSamplesIds = categoricalSamplesIds;
            }
        });

        if (minKnowledge != undefined && 
            this.entrophy - Math.min(currMinIntervalEntrophy, currMinCategoricalEntrophy) < minKnowledge)
            return;

        if (currMinIntervalEntrophy < currMinCategoricalEntrophy)
        {
            intervalAttributesList[bestIntervalAttributeID].used[bestIntervalValueID] = true;
            this.attributeType = attributeTypes.INTERVAL;
            this.attributeID = bestIntervalAttributeID;
            this.conditionValue = intervalAttributesList[bestIntervalAttributeID].values[bestIntervalValueID];

            // left child
            let leftChild = new TreeNode;
            leftChild.entrophy = bestLeftEnthrophy;
            leftChild.samplesAmount = bestLeftTotal;
            leftChild.samplesIDs = bestLeftIDs;
            this.children.push(leftChild);

            // right child
            let rightChild = new TreeNode;
            rightChild.entrophy = bestRightEnthrophy;
            rightChild.samplesAmount = bestRightTotal;
            rightChild.samplesIDs = bestRightIDs;
            this.children.push(rightChild);
        }
        else
        {
            for (let i in bestCategoricalSamplesIds)
            {
                let newNode = new TreeNode();
                newNode.attributeType = attributeTypes.INTERVAL;
                newNode.attributeID = bestCategoricalAttributeID;
                newNode.samplesIDs = bestCategoricalSamplesIds[i];
                newNode.entrophy = bestEnthrophies[i];
                newNode.samplesAmount = bestCategoricalSamplesIds[i].length;

                categoricalAttributesList[bestCategoricalAttributeID].used = true;
                this.children.push(newNode);
            }
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
        currNode.addConditionAndChildren(
            this.intervalAttributesList, this.categoricalAttributesList, this.dataTable, this.minKnowledge);

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
                    (this.categoricalAttributesList.length, colum, false, columID)
                );
            }
            else
            {
                colum = adjustMedians(colum);
                let usedArr:boolean[] = [];
                usedArr.length = colum.length;
                usedArr.fill(false);

                this.intervalAttributesList.push(new attribute
                    (this.intervalAttributesList.length, colum, usedArr, columID)
                );
            }
        }
    }

    classifySingle(inputAttributes: string[]): string
    {
        let currNode:TreeNode = this.rootNode;
        while (!currNode.isLeaf())
        {
            if (currNode.attributeType == attributeTypes.INTERVAL)
            {
                currNode = 
                    (parseFloat(inputAttributes[this.intervalAttributesList[currNode.attributeID].GlobalID]) <=
                    Number(currNode.conditionValue))?
                    currNode.children[0]: currNode.children[1];
            }
            else
            {
                for (let i in this.categoricalAttributesList[currNode.attributeID].values)
                {
                    if (inputAttributes[this.categoricalAttributesList[currNode.attributeID].GlobalID] ==
                        this.categoricalAttributesList[currNode.attributeID].values[i])
                    {
                        currNode = currNode.children[i];
                        break;
                    }
                }
            }
        }

        return currNode.mostPopularClassName(this.dataTable);
    }

    classifyFromThisCSV(precentageToClassify: number)
    {
        const amountToClasify = this.dataTable.length * precentageToClassify / 100;
        for (let i = 1; i < amountToClasify - 1; ++i)
        {
            let res = this.classifySingle(this.dataTable[i]);

            //console.log(this.dataTable[i][this.dataTable[0].length - 1]);
            //console.log(res);
        }
    }

    constructor(newDataTable: string[][], maxDepth?: number, minKnowledgePersentage?: number)
    {
        this.dataTable = newDataTable;
        this.fillAttributesLists();

        this.maxDepth = maxDepth;

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

        this.rootNode.entrophy = calcEnthrophy(samplesClassesProbabilities);

        if (minKnowledgePersentage != undefined)
            this.minKnowledge = this.rootNode.entrophy * minKnowledgePersentage / 100;

        this.buildTreeDFS(this.rootNode, 0);
    }
}