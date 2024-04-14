export var attributeTypes;
(function (attributeTypes) {
    attributeTypes[attributeTypes["CATEGORICAL"] = 0] = "CATEGORICAL";
    attributeTypes[attributeTypes["INTERVAL"] = 1] = "INTERVAL";
})(attributeTypes || (attributeTypes = {}));
export class attribute {
    constructor(attributeID, valuesI, GlobalIDI) {
        this.GlobalID = GlobalIDI;
        this.id = attributeID;
        this.values = valuesI;
    }
    GlobalID;
    id;
    values;
}
//# sourceMappingURL=attribute.js.map