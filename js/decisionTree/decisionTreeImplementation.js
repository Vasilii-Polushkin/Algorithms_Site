"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionTree = exports.TreeNode = exports.calcEnthrophy = exports.xLog2x = void 0;
var condition_1 = require("./utilities/condition");
var Global = require("./globalVariables");
function xLog2x(x) {
    return x <= 0 ? 0 : x * Math.log2(x);
}
exports.xLog2x = xLog2x;
function calcEnthrophy(probabilities) {
    var entropy = 0;
    for (var i = 0; i < probabilities.length; ++i)
        entropy -= xLog2x(probabilities[i]);
    return entropy;
}
exports.calcEnthrophy = calcEnthrophy;
var TreeNode = /** @class */ (function () {
    function TreeNode() {
        this.attributeType = null;
        this.attributeID = null;
    }
    ;
    TreeNode.prototype.isLeaf = function () {
        return (this.attributeID == null);
    };
    // для каждого неиспользовавшегося условия из списка считаем энтропию для текущего списка семплов
    // выбираем лучшее условие (с наименьшей энтропией) и добавляем ноду
    TreeNode.prototype.addConditionAndChildren = function (minKnowledge) {
        var _this = this;
        // interval
        var bestIntervalAttributeID = 0;
        var bestIntervalValueID = 0;
        var currMinIntervalEntrophy = 2;
        var leftTotal = 0;
        var rightTotal = 0;
        var leftIDs = [];
        var rightIDs = [];
        Global.intervalAttributesList.forEach(function (attribute) {
            var _loop_1 = function (i) {
                if (attribute.used[i] == true)
                    return "continue";
                var breakpoint = attribute.values[i];
                var leftSamplesClasses = new Map;
                var rightSamplesClasses = new Map;
                _this.samplesIDs.forEach(function (id) {
                    var currClass = parseFloat(Global.dataTable[id][Global.dataTable[0].length - 1]);
                    if (currClass <= breakpoint) {
                        leftIDs.push(id);
                        leftSamplesClasses[currClass]++;
                        leftTotal++;
                    }
                    else {
                        rightIDs.push(id);
                        rightSamplesClasses[currClass]++;
                        rightTotal++;
                    }
                });
                var leftSamplesClassesProbabilities = [];
                for (var _i = 0, leftSamplesClasses_1 = leftSamplesClasses; _i < leftSamplesClasses_1.length; _i++) {
                    var _a = leftSamplesClasses_1[_i], key = _a[0], value = _a[1];
                    leftSamplesClassesProbabilities.push(value) / leftTotal;
                }
                var rightSamplesClassesProbabilities = [];
                for (var _b = 0, rightSamplesClasses_1 = rightSamplesClasses; _b < rightSamplesClasses_1.length; _b++) {
                    var _c = rightSamplesClasses_1[_b], key = _c[0], value = _c[1];
                    rightSamplesClassesProbabilities.push(value) / rightTotal;
                }
                var leftEnthrophy = calcEnthrophy(leftSamplesClassesProbabilities);
                var rightEnthrophy = calcEnthrophy(rightSamplesClassesProbabilities);
                var newEntrophy = (leftTotal / (leftTotal + rightTotal)) * leftEnthrophy +
                    (rightTotal / (leftTotal + rightTotal)) * rightEnthrophy;
                if (newEntrophy < currMinIntervalEntrophy) {
                    currMinIntervalEntrophy = newEntrophy;
                    bestIntervalAttributeID = attribute.id;
                    bestIntervalValueID = i;
                }
            };
            for (var i = 0; i < attribute.values.length; ++i) {
                _loop_1(i);
            }
        });
        // categorical
        var bestCategoricalAttributeID = 0;
        var bestCategoricalValueID = 0;
        var currMinCategoricalEntrophy = 2;
        Global.categoricalAttributesList.forEach(function (attribute) {
        });
        if (minKnowledge && Math.min(currMinIntervalEntrophy, currMinCategoricalEntrophy) < minKnowledge)
            return;
        if (currMinIntervalEntrophy < currMinCategoricalEntrophy) {
            Global.intervalAttributesList[bestIntervalAttributeID].used[bestIntervalValueID] = true;
            this.attributeType = condition_1.attributeTypes.INTERVAL;
            this.attributeID = bestIntervalAttributeID;
            // left child
            var leftChild = new TreeNode;
            leftChild.entropy = currMinIntervalEntrophy;
            leftChild.samplesAmount = leftTotal;
            leftChild.samplesIDs = leftIDs;
            this.children.push(leftChild);
            // right child
            var rightChild = new TreeNode;
            rightChild.entropy = currMinIntervalEntrophy;
            rightChild.samplesAmount = rightTotal;
            rightChild.samplesIDs = rightIDs;
            this.children.push(rightChild);
        }
        else {
        }
    };
    return TreeNode;
}());
exports.TreeNode = TreeNode;
var DecisionTree = /** @class */ (function () {
    function DecisionTree(maxDepth, minKnowledge) {
        this.maxDepth = maxDepth;
        this.minKnowledge = minKnowledge;
        this.rootNode = new TreeNode();
        this.rootNode.samplesAmount = Global.dataTable.length - 1;
        for (var i = 0; i < this.rootNode.samplesAmount; ++i)
            this.rootNode.samplesIDs.push(i);
        {
            var samplesClasses_2 = new Map;
            this.rootNode.samplesIDs.forEach(function (id) {
                samplesClasses_2[Global.dataTable[id][Global.dataTable[0].length - 1]]++;
            });
            var samplesClassesProbabilities = [];
            for (var _i = 0, samplesClasses_1 = samplesClasses_2; _i < samplesClasses_1.length; _i++) {
                var _a = samplesClasses_1[_i], key = _a[0], value = _a[1];
                samplesClassesProbabilities.push(value) / (Global.dataTable.length - 1);
            }
            this.rootNode.entropy = calcEnthrophy(samplesClassesProbabilities);
        }
        this.buildTreeDFS(this.rootNode, 0);
    }
    DecisionTree.prototype.buildTreeDFS = function (currNode, currDepth) {
        var _this = this;
        currNode.addConditionAndChildren(this.minKnowledge);
        if (this.maxDepth && currDepth == this.maxDepth)
            return;
        currNode.children.forEach(function (childNode) {
            _this.buildTreeDFS(childNode, currDepth + 1);
        });
    };
    return DecisionTree;
}());
exports.DecisionTree = DecisionTree;
