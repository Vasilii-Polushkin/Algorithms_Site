import { attributeTypes } from "./utilities/condition";
import * as Global from './globalVariables';

export function xLog2x(x: number):number
{
    return x <= 0? 0 : x * Math.log2(x);
}

export function calcEnthrophy(probabilities: number[]): number
{
    let entropy = 0;

    for (let i = 0; i < probabilities.length; ++i)
        entropy -= xLog2x(probabilities[i]);

    return entropy;
}

export class TreeNode
{
    children: TreeNode[];

    attributeType: attributeTypes | null;
    attributeID: number | null;

    entropy: number;
    samplesAmount: number;
    samplesIDs: number[];

    constructor()
    {
        this.attributeType = null;
        this.attributeID = null;
    };

    isLeaf():boolean
    {
        return (this.attributeID == null);
    }
    // для каждого неиспользовавшегося условия из списка считаем энтропию для текущего списка семплов
    // выбираем лучшее условие (с наименьшей энтропией) и добавляем ноду
    addConditionAndChildren(minKnowledge: number | undefined | null): void
    {
        // interval
        let bestIntervalAttributeID = 0;
        let bestIntervalValueID = 0;
        let currMinIntervalEntrophy = 2;
        let leftTotal = 0;
        let rightTotal = 0;
        let leftIDs: number[] = [];
        let rightIDs: number[] = [];
        Global.intervalAttributesList.forEach((attribute) => {
            for (let i = 0; i < attribute.values.length; ++i)
            {
                if (attribute.used[i] == true)
                    continue;

                const breakpoint = attribute.values[i];

                const leftSamplesClasses = new Map<any, number>;
                const rightSamplesClasses = new Map<any, number>;

                this.samplesIDs.forEach((id) => {
                    const currClass = parseFloat(Global.dataTable[id][Global.dataTable[0].length - 1]);
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
        Global.categoricalAttributesList.forEach((attribute) => {

        });

        if (minKnowledge && Math.min(currMinIntervalEntrophy, currMinCategoricalEntrophy) < minKnowledge)
            return;

        if (currMinIntervalEntrophy < currMinCategoricalEntrophy)
        {
            Global.intervalAttributesList[bestIntervalAttributeID].used[bestIntervalValueID] = true;
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
    maxDepth: number | undefined | null;
    minKnowledge: number | undefined | null;

    rootNode: TreeNode
    
    buildTreeDFS(currNode: TreeNode, currDepth: number): void
    {
        currNode.addConditionAndChildren(this.minKnowledge);

        if (this.maxDepth && currDepth == this.maxDepth)
            return;

        currNode.children.forEach((childNode: TreeNode) => {
            this.buildTreeDFS(childNode, currDepth + 1);
        });
    }

    constructor(maxDepth?: number, minKnowledge?: number)
    {
        this.maxDepth = maxDepth;
        this.minKnowledge = minKnowledge;
        this.rootNode = new TreeNode();
        this.rootNode.samplesAmount = Global.dataTable.length - 1;
        for (let i = 0; i < this.rootNode.samplesAmount; ++i)
            this.rootNode.samplesIDs.push(i);
        {
            const samplesClasses = new Map<any, number>;
            this.rootNode.samplesIDs.forEach((id) => {
                samplesClasses[Global.dataTable[id][Global.dataTable[0].length - 1]]++;
            });
            let samplesClassesProbabilities: number[] = [];
                for (const[key, value] of samplesClasses)
                    samplesClassesProbabilities.push(value) / (Global.dataTable.length - 1);

            this.rootNode.entropy = calcEnthrophy(samplesClassesProbabilities);
        }
        this.buildTreeDFS(this.rootNode, 0);
    }
}