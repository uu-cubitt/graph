"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementType_1 = require("./ElementType");
var AbstractElement_1 = require("./AbstractElement");
var ConnectorElement = (function (_super) {
    __extends(ConnectorElement, _super);
    function ConnectorElement() {
        _super.apply(this, arguments);
    }
    ConnectorElement.prototype.getType = function () {
        return ElementType_1.ElementType.Connector;
    };
    ConnectorElement.prototype.delete = function (graph) {
        var edgeIds = this.getEdgeNeighbours();
        for (var _i = 0, edgeIds_1 = edgeIds; _i < edgeIds_1.length; _i++) {
            var edgeId = edgeIds_1[_i];
            var edge = graph.getElement(edgeId);
            edge.delete(graph);
        }
        var NodeIds = this.getNodeNeighbours();
        for (var _a = 0, NodeIds_1 = NodeIds; _a < NodeIds_1.length; _a++) {
            var nodeId = NodeIds_1[_a];
            var node = graph.getElement(nodeId);
            node.unlinkConnectorNeighbour(this.Id);
        }
        this.remove(graph);
    };
    return ConnectorElement;
}(AbstractElement_1.AbstractElement));
exports.ConnectorElement = ConnectorElement;
