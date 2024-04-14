import { attributeTypes, attribute} from "./utilities/attribute.js";
import { sortUnique, calcEnthrophy, maxEnthropy, adjustMedians, incrementedValue} from "./utilities/math.js";
import { iterationsDelay,SetClassifiedAmount,SetClassifiedWrong,SetTotalToClassify } from "./bindings.js";

//обрабатываем каждый столбец(атрибут) поочередно
//сначала определяем тип атрибута
//потом преобразуем столб в сет и находим всевозможные условия, которые могут быть в узлах дерева

export class TreeNode
{
    parent: TreeNode;
    children: TreeNode[] = [];

    categoricalID: number | null = null;
    attributeType: attributeTypes | null = null;
    attributeID: number | null = null;
    conditionValue: number | string | null = null; // string некруто

    entropy: number = 0;
    samplesAmount: number = 0;
    samplesIDs: number[] = [];

    ownerTree: DecisionTree;

    constructor(ownerTree: DecisionTree, parent: TreeNode)
    {
        this.parent = parent;
        this.ownerTree = ownerTree;
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
        usedCategiralIDs: boolean[],
        usedIntervalIDsValues: boolean[][]):number
    {
        if (this.entropy == 0)
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

        this.ownerTree.intervalAttributesList.forEach((attribute) => {
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
                    const currClassName = this.ownerTree.dataTable[id][this.ownerTree.dataTable[0].length - 1];
                    if (parseFloat(this.ownerTree.dataTable[id][attribute.GlobalID]) <= breakpointValue)
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

        this.ownerTree.categoricalAttributesList.forEach((attribute) => {
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
                    if (attribute.values[i] == this.ownerTree.dataTable[id][attribute.GlobalID])
                    {
                        categoricalClassesAmounts[i][this.ownerTree.dataTable[id][this.ownerTree.dataTable[0].length - 1]] = 
                            incrementedValue(categoricalClassesAmounts[i][this.ownerTree.dataTable[id][this.ownerTree.dataTable[0].length - 1]]);
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
                currEntrophy += entrophies[i] * total / this.samplesAmount;
            }

            if (currEntrophy < currMinCategoricalEntrophy)
            {
                bestEnthrophies = entrophies;
                currMinCategoricalEntrophy = currEntrophy;
                bestCategoricalAttributeID = attribute.id;
                bestCategoricalSamplesIds = categoricalSamplesIds;
            }
        });

        if (this.ownerTree.minKnowledge != undefined && 
            this.entropy - Math.min(currMinIntervalEntrophy, currMinCategoricalEntrophy) < this.ownerTree.minKnowledge
            || currMinIntervalEntrophy == maxEnthropy && currMinCategoricalEntrophy == maxEnthropy)
            return undefined;

        if (currMinIntervalEntrophy < currMinCategoricalEntrophy)
        {
            //intervalAttributesList[bestIntervalAttributeID].used[bestIntervalValueID] = true;
            this.attributeType = attributeTypes.INTERVAL;
            this.attributeID = bestIntervalAttributeID;
            this.conditionValue = this.ownerTree.intervalAttributesList[bestIntervalAttributeID].values[bestIntervalValueID];

            // left child
            let leftChild = new TreeNode(this.ownerTree, this);
            leftChild.entropy = bestLeftEnthrophy;
            leftChild.samplesAmount = bestLeftTotal;
            leftChild.samplesIDs = bestLeftIDs;
            this.children.push(leftChild);

            // right child
            let rightChild = new TreeNode(this.ownerTree, this);
            rightChild.entropy = bestRightEnthrophy;
            rightChild.samplesAmount = bestRightTotal;
            rightChild.samplesIDs = bestRightIDs;
            this.children.push(rightChild);
        }
        else
        {
            this.attributeType = attributeTypes.CATEGORICAL;
            this.attributeID = bestCategoricalAttributeID;
            //categoricalAttributesList[bestCategoricalAttributeID].used = true;
            
            for (let i = 0; i < bestCategoricalSamplesIds.length; ++i)
            {
                let newNode = new TreeNode(this.ownerTree, this);

                newNode.categoricalID = i;
                newNode.samplesIDs = bestCategoricalSamplesIds[i];
                newNode.entropy = bestEnthrophies[i];
                newNode.samplesAmount = bestCategoricalSamplesIds[i].length;

                this.children.push(newNode);
            }
        }

        return bestIntervalValueID;
    }

    isLeftChild():boolean
    {
        return this.parent.children[0] == this;
    }

    getAttributeName(): string
    {
        if (this.parent.attributeType == attributeTypes.INTERVAL)
            return this.ownerTree.dataTable[0][this.ownerTree.intervalAttributesList[this.parent.attributeID].GlobalID];

        else
            return this.ownerTree.dataTable[0][this.ownerTree.categoricalAttributesList[this.parent.attributeID].GlobalID];
    }

    getAttributeCondition():string
    {
        if (this.parent.attributeType == attributeTypes.CATEGORICAL)
            return  " == " + 
                this.ownerTree.categoricalAttributesList[this.parent.attributeID].values[this.categoricalID];

        return (this.isLeftChild()? " <= ": " > ") +
            Number(this.parent.conditionValue).toFixed(3);
    }

    getVisualContent(): string
    {
        // root
        if (this.parent == null)
            return `root node`

        return this.getAttributeName() + this.getAttributeCondition();
    }

    getClassesAmounts(): string
    {
        const obj = {};

        this.samplesIDs.forEach(id => {
            obj[this.ownerTree.dataTable[id].at(-1)] =
                incrementedValue(obj[this.ownerTree.dataTable[id].at(-1)]);
        });

        let res:string = "";

        for (let key in obj)
            res += key + ': ' +  obj[key] + '\n';

        return res;
    }

    getAdditionalVisualContent(): string
    {
        return "\nentropy: " + this.entropy.toFixed(3) + "\n"
        + "Samples Amount: " + this.samplesAmount + "\n"
        + this.getClassesAmounts();
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export class DecisionTree
{
    shouldStopClassify = false;
    stopClassifying()
    {
        this.shouldStopClassify = true;
    };

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
        if (this.maxDepth != undefined && currDepth == this.maxDepth - 1)
            return;

        let intervalValueID = currNode.addConditionAndChildren(
            usedCategiralIDs, usedIntervalIDsValues);

        if (currNode.attributeType == undefined)
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
                    }
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

    async classifySingle(inputAttributes: string[]): Promise<string>
    {
        let currNode:TreeNode = this.rootNode;
        // currElment is <li>
        let currElement:Element | HTMLElement = document.getElementById("placeHolder").firstElementChild;
        let currA = ()=>{return currElement.firstElementChild};
        let nextElement:Element | HTMLElement;

        while (!currNode.isLeaf())
        {
            if (iterationsDelay >= 40)
                currA().classList.add("select");
            // go to ul
            nextElement = currElement.lastElementChild;

            if (currNode.attributeType == attributeTypes.INTERVAL)
            {
                if(parseFloat(inputAttributes[this.intervalAttributesList[currNode.attributeID].GlobalID]) <=
                    Number(currNode.conditionValue))
                {
                    currNode = currNode.children[0];
                    nextElement = nextElement.firstElementChild;
                }
                else
                {
                    currNode = currNode.children[1];
                    nextElement = nextElement.lastElementChild;
                }
            }
            else
            {
                nextElement = nextElement.firstElementChild;

                for (let i = 0; i < this.categoricalAttributesList[currNode.attributeID].values.length; ++i)
                {
                    if (inputAttributes[this.categoricalAttributesList[currNode.attributeID].GlobalID] ==
                        this.categoricalAttributesList[currNode.attributeID].values[i])
                    {
                        currNode = currNode.children[i];
                        break;
                    }
                    nextElement = nextElement.nextElementSibling;
                }
            }
            await sleep(iterationsDelay);
            if (this.shouldStopClassify)
            {
                if (currElement != undefined)
                    currA().classList.remove("select");
                return null;
            }
            currA().classList.remove("select");
            currElement = nextElement;
        }

        const res = currNode.mostPopularClassName(this.dataTable);

        if (res == inputAttributes.at(-1))
        {
            currA().classList.add("success");
            setTimeout(function() {
                if (currElement != undefined)
                    currA().classList.remove("success");
                }, Math.max(iterationsDelay, 100));

            await sleep(iterationsDelay);
            if (this.shouldStopClassify)
                return null;
        }

        else
        {
            currA().classList.add("fail");
            setTimeout(function() {
                if (currElement != undefined)
                    currA().classList.remove("fail");
                }, Math.max(iterationsDelay, 100));
            await sleep(iterationsDelay);
            if (this.shouldStopClassify)
                return null;
        }

        return res;
    }

    classifyCounter = 0;

    async classifyDataTable(precentageToClassify: number, dataTable: string[][] = this.dataTable)
    {
        this.classifyCounter++;

        this.shouldStopClassify = false;

        SetClassifiedAmount(0);
        SetClassifiedWrong(0);

        let classifiedWrong = 0;
        const amountToClasify = Math.floor(dataTable.length * precentageToClassify / 100);

        SetTotalToClassify(amountToClasify - 1);

        for (let i = 1; i < amountToClasify; ++i)
        {
            const res:string = await this.classifySingle(dataTable[i])
            if (this.shouldStopClassify || this.classifyCounter > 1)
                break;
            if (dataTable[i].at(-1) != res)
            {
                classifiedWrong++;
                SetClassifiedWrong(classifiedWrong);
            }

            SetClassifiedAmount(i);
        }

        this.classifyCounter--;
    }

    constructor(newDataTable: string[][], maxDepth?: number, minKnowledgePersentage?: number)
    {
        this.dataTable = newDataTable;
        this.fillAttributesLists();

        this.maxDepth = maxDepth;

        this.rootNode = new TreeNode(this, null);
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

        this.rootNode.entropy = calcEnthrophy(samplesClassesProbabilities);

        if (minKnowledgePersentage != undefined)
            this.minKnowledge = this.rootNode.entropy * minKnowledgePersentage / 100;

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
        this.visualizeTree();
    }
    
    visualizeTreeDfs(currNode:TreeNode, currUlElement: Element):void
    {
        const subtree = document.createElement('li');
        const nodeInfo = document.createElement('a');
        const childrenPlaceholder = document.createElement('ul');

        subtree.appendChild(nodeInfo);
        if (!currNode.isLeaf())
            subtree.appendChild(childrenPlaceholder);
        currUlElement.appendChild(subtree);

        // logic
        nodeInfo.append(currNode.getVisualContent());
        nodeInfo.append(currNode.getAdditionalVisualContent());

        currNode.children.forEach(childNode => {
            this.visualizeTreeDfs(childNode, childrenPlaceholder);
        });
    }

    visualizeTree(): void
    {
        let placeHolder:Element = document.getElementById("placeHolder");
        this.visualizeTreeDfs(this.rootNode, placeHolder);
    }
    
    freeVisuals(): void
    {
        let placeHolder:Element = document.getElementById("placeHolder");
        placeHolder.innerHTML = '';
    }
}