export class TreeNode
{
    leftNode: TreeNode;
    rightNode: TreeNode;

    conditionID: number;

    entropy: number;
    samplesAmount: number;
    samplesIDs: number[];

    constructor()
    {
        this.conditionID = -1;
    };

    isLeaf():boolean
    {
        return (!this.leftNode && !this.rightNode);
        // conditionID == -1
    }

    // для каждого неиспользовавшегося условия из списка считаем энтропию для текущего списка семплов
    // выбираем лучшее условие (с наименьшей энтропией) и добавляем ноду
    // возвращаем ссылку на созданный нод или null, если удовлетворены критерии останова и новый нод листовой
    addNextConditionNode():TreeNode
    {
        let newNode: TreeNode;

        return newNode;
    }
}

export class DecisionTree
{
    rootNode: TreeNode
    
    constructor()
    {}


}