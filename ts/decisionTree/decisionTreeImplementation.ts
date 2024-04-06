import { attributeTypes, attribute} from "./utilities/attribute.js";
import { sortUnique, calcEnthrophy, maxEnthropy, adjustMedians, incrementedValue} from "./utilities/math.js";

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
        usedCategiralIDs: boolean[],
        usedIntervalIDsValues: boolean[][],
        dataTable: string[][],
        minKnowledge?: number):number
    {
        if (this.entrophy == 0)
            return undefined;
        
        // interval
        let bestIntervalAttributeID = 0;
        let bestIntervalValueID = 0;
        let currMinIntervalEntrophy = maxEnthropy;
        let bestLeftTotal = 0;
        let bestRightTotal = 0;
        let bestLeftIDs: number[] = [];
        let bestRightIDs: number[] = [];
        let bestRightEnthrophy = 0;
        let bestLeftEnthrophy = 0;

        intervalAttributesList.forEach((attribute) => {
            for (let i = 0; i < attribute.values.length; ++i)
            {
                if (usedIntervalIDsValues[attribute.id][attribute.values[i]] === true)
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
                    if (parseFloat(dataTable[id][attribute.GlobalID]) <= breakpointValue)
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
        let currMinCategoricalEntrophy = maxEnthropy;

        categoricalAttributesList.forEach((attribute) => {
            if (usedCategiralIDs[attribute.id] === true)
               return;

            let categoricalSamplesIds: number[][] = [];
            categoricalSamplesIds.length =  attribute.values.length;
            for (let i = 0; i < attribute.values.length; ++i)
                categoricalSamplesIds[i] = [];

            let categoricalClassesAmounts: Object[] = [];
            categoricalClassesAmounts.length = attribute.values.length;
            for (let i = 0; i < attribute.values.length; ++i)
                categoricalClassesAmounts[i] = {};

            this.samplesIDs.forEach(id => {
                for (let i in attribute.values)
                {
                    if (attribute.values[i] == dataTable[id][attribute.GlobalID])
                    {
                        categoricalClassesAmounts[i][dataTable[id][dataTable[0].length - 1]] = 
                            incrementedValue(categoricalClassesAmounts[i][dataTable[id][dataTable[0].length - 1]]);
                        categoricalSamplesIds[i].push(id);
                        break;
                    }
                }
            });

            let currEntrophy = 0;
            let entrophies:number[] = [];

            for (let i in categoricalClassesAmounts)
            {
                const total = categoricalSamplesIds[i].length;

                let samplesClassesProbabilities:number[] = [];

                for (let key in categoricalClassesAmounts[i])
                {
                    samplesClassesProbabilities.push(categoricalClassesAmounts[i][key] / total);
                }

                entrophies[i] = calcEnthrophy(samplesClassesProbabilities);
                currEntrophy -= entrophies[i] * total / this.samplesAmount;
            }

            if (currEntrophy < currMinCategoricalEntrophy)
            {
                bestEnthrophies = entrophies;
                currMinCategoricalEntrophy = currEntrophy;
                bestCategoricalAttributeID = attribute.id;
                bestCategoricalSamplesIds = categoricalSamplesIds;
            }
        });

        if (minKnowledge != undefined && 
            this.entrophy - Math.min(currMinIntervalEntrophy, currMinCategoricalEntrophy) < minKnowledge
            || currMinIntervalEntrophy == maxEnthropy && currMinCategoricalEntrophy == maxEnthropy)
            return undefined;

        if (currMinIntervalEntrophy < currMinCategoricalEntrophy)
        {
            //intervalAttributesList[bestIntervalAttributeID].used[bestIntervalValueID] = true;
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
            this.attributeType = attributeTypes.CATEGORICAL;
            this.attributeID = bestCategoricalAttributeID;
            //categoricalAttributesList[bestCategoricalAttributeID].used = true;
            
            for (let i in bestCategoricalSamplesIds)
            {
                let newNode = new TreeNode();
                newNode.samplesIDs = bestCategoricalSamplesIds[i];
                newNode.entrophy = bestEnthrophies[i];
                newNode.samplesAmount = bestCategoricalSamplesIds[i].length;

                this.children.push(newNode);
            }
        }

        return bestIntervalValueID;
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
    
    buildTreeDFS(currNode: TreeNode, usedCategiralIDs: boolean[], usedIntervalIDsValues:boolean[][], currDepth: number): void
    {
        let intervalValueID = currNode.addConditionAndChildren(
            this.intervalAttributesList, this.categoricalAttributesList,
            usedCategiralIDs, usedIntervalIDsValues, this.dataTable, this.minKnowledge);

        if (this.maxDepth != undefined && currDepth == this.maxDepth || currNode.attributeType == undefined)
            return;

        if (currNode.attributeType == attributeTypes.CATEGORICAL)
        {
            usedCategiralIDs[currNode.attributeID] = true;
            currNode.children.forEach((childNode: TreeNode) => {
                this.buildTreeDFS(childNode, usedCategiralIDs, usedIntervalIDsValues, currDepth + 1);
            });
            usedCategiralIDs[currNode.attributeID] = false;
        }
        else
        {
            usedIntervalIDsValues[currNode.attributeID][intervalValueID] = true;
            currNode.children.forEach((childNode: TreeNode) => {
                this.buildTreeDFS(childNode, usedCategiralIDs, usedIntervalIDsValues, currDepth + 1);
            });
            usedIntervalIDsValues[currNode.attributeID][intervalValueID] = false;
        }
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
                    (this.categoricalAttributesList.length, colum, columID)
                );
            }
            else
            {
                colum = adjustMedians(colum);

                this.intervalAttributesList.push(new attribute
                    (this.intervalAttributesList.length, colum, columID)
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
            console.log(this.dataTable[i][this.dataTable[0].length - 1] == res);
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

        let usedCategiralIDs:boolean[] = [];
        usedCategiralIDs.length = this.categoricalAttributesList.length;
        usedCategiralIDs.fill(false);

        let usedIntervalIDsValues:boolean[][] = [];
        usedIntervalIDsValues.length = this.intervalAttributesList.length;
        for (let i in this.intervalAttributesList)
        {
            usedIntervalIDsValues[i] = [];
            usedIntervalIDsValues[i].length = usedIntervalIDsValues[i].length
            usedIntervalIDsValues[i].fill(false);
        }

        this.buildTreeDFS(this.rootNode, usedCategiralIDs, usedIntervalIDsValues, 0);
    }
}