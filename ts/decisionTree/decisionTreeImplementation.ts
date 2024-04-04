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
        let currMinIntervalEntrophy = 2;
        let leftTotal = 0;
        let rightTotal = 0;
        let leftIDs: number[] = [];
        let rightIDs: number[] = [];
        intervalAttributesList.forEach((attribute) => {
            for (let i = 0; i < attribute.values.length; ++i)
            {
                if (attribute.used[i] == true)
                    continue;

                const breakpoint = attribute.values[i];

                const leftSamplesClasses = new Map<any, number>;
                const rightSamplesClasses = new Map<any, number>;

                this.samplesIDs.forEach((id) => {
                    const currClass = parseFloat(dataTable[id][dataTable[0].length - 1]);
                    if (currClass <= breakpoint)
                    {
                        leftIDs.push(id);
                        leftSamplesClasses[currClass]++;
                        leftTotal++;
                    }
                    else
                    {
                        rightIDs.push(id);
                        rightSamplesClasses[currClass]++;
                        rightTotal++;
                    }
                });

                let leftSamplesClassesProbabilities: number[] = [];
                for (const[key, value] of leftSamplesClasses)
                    leftSamplesClassesProbabilities.push(value) / leftTotal;
                
                let rightSamplesClassesProbabilities: number[] = [];
                for (const[key, value] of rightSamplesClasses)
                    rightSamplesClassesProbabilities.push(value) / rightTotal;

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
                }
            }
        });

        // categorical
        let bestCategoricalAttributeID = 0;
        let bestCategoricalValueID = 0;
        let currMinCategoricalEntrophy = 2;
        categoricalAttributesList.forEach((attribute) => {

        });

        if (minKnowledge && Math.min(currMinIntervalEntrophy, currMinCategoricalEntrophy) < minKnowledge)
            return;

        if (currMinIntervalEntrophy < currMinCategoricalEntrophy)
        {
            intervalAttributesList[bestIntervalAttributeID].used[bestIntervalValueID] = true;
            this.attributeType = attributeTypes.INTERVAL;
            this.attributeID = bestIntervalAttributeID;

            // left child
            let leftChild = new TreeNode;
            leftChild.entropy = currMinIntervalEntrophy;
            leftChild.samplesAmount = leftTotal;
            leftChild.samplesIDs = leftIDs;
            this.children.push(leftChild);

            // right child
            let rightChild = new TreeNode;
            rightChild.entropy = currMinIntervalEntrophy;
            rightChild.samplesAmount = rightTotal;
            rightChild.samplesIDs = rightIDs;
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
        
            const samplesClasses = new Map<any, number>;
            
            this.rootNode.samplesIDs.forEach((id) => {
                if (samplesClasses[this.dataTable[id][this.dataTable[0].length - 1]] == undefined)
                    samplesClasses[this.dataTable[id][this.dataTable[0].length - 1]] = 0;
                samplesClasses[this.dataTable[id][this.dataTable[0].length - 1]] ++;
            });

            let samplesClassesProbabilities: number[] = [];

            for (const[key, value] of samplesClasses)
            {
                console.log(1212);
                samplesClassesProbabilities.push(value) / (this.dataTable.length - 1);
            }

            this.rootNode.entropy = calcEnthrophy(samplesClassesProbabilities);
        
        this.buildTreeDFS(this.rootNode, 0);
    }
}