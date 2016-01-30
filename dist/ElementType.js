"use strict";
(function (ElementType) {
    ElementType[ElementType["Node"] = 0] = "Node";
    ElementType[ElementType["Edge"] = 1] = "Edge";
    ElementType[ElementType["Connector"] = 2] = "Connector";
    ElementType[ElementType["Model"] = 3] = "Model";
})(exports.ElementType || (exports.ElementType = {}));
var ElementType = exports.ElementType;
