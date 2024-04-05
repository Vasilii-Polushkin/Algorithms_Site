export var attributeTypes;
(function (attributeTypes) {
    attributeTypes[attributeTypes["CATEGORICAL"] = 0] = "CATEGORICAL";
    attributeTypes[attributeTypes["INTERVAL"] = 1] = "INTERVAL";
})(attributeTypes || (attributeTypes = {}));
export class attribute {
    constructor(attributeID, valuesI, usedI, GlobalIDI) {
        this.GlobalID = GlobalIDI;
        this.id = attributeID;
        this.values = valuesI;
        this.used = usedI;
    }
    GlobalID;
    id;
    values;
    //either bool for categorical or bool[] for interval
    used;
}
//# sourceMappingURL=attribute.js.map