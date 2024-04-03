"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attribute = exports.attributeTypes = void 0;
var attributeTypes;
(function (attributeTypes) {
    attributeTypes[attributeTypes["CATEGORICAL"] = 0] = "CATEGORICAL";
    attributeTypes[attributeTypes["INTERVAL"] = 1] = "INTERVAL";
})(attributeTypes || (exports.attributeTypes = attributeTypes = {}));
var attribute = /** @class */ (function () {
    function attribute(attributeID, valuesI, usedI) {
        this.id = attributeID;
        this.values = valuesI;
        this.used = usedI;
    }
    return attribute;
}());
exports.attribute = attribute;