"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementType_1 = require("./ElementType");
var AbstractElement_1 = require("./AbstractElement");
var NodeElement = (function (_super) {
    __extends(NodeElement, _super);
    function NodeElement() {
        _super.apply(this, arguments);
    }
    NodeElement.prototype.getType = function () {
        return ElementType_1.ElementType.Node;
    };
    NodeElement.prototype.delete = function (graph) {
        var edges = this.getEdgeNeighbours();
        var connectors = this.getConnectorNeighbours();
        var models = this.getModelNeighbours();
        for (var _i = 0, connectors_1 = connectors; _i < connectors_1.length; _i++) {
            var conId = connectors_1[_i];
            var connector = graph.getElement(conId);
            connector.delete(graph);
        }
        for (var _a = 0, models_1 = models; _a < models_1.length; _a++) {
            var modelId = models_1[_a];
            var model = graph.getElement(modelId);
            model.unlinkNodeNeighbour(this.id);
        }
        this.remove(graph);
    };
    return NodeElement;
}(AbstractElement_1.AbstractElement));
exports.NodeElement = NodeElement;
