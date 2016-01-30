"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ElementType_1 = require("./ElementType");
var AbstractElement_1 = require("./AbstractElement");
var EdgeElement = (function (_super) {
    __extends(EdgeElement, _super);
    function EdgeElement() {
        _super.apply(this, arguments);
    }
    EdgeElement.prototype.getType = function () {
        return ElementType_1.ElementType.Edge;
    };
    EdgeElement.prototype.getStartConnector = function () {
        return this.start;
    };
    EdgeElement.prototype.getEndConnector = function () {
        return this.end;
    };
    EdgeElement.prototype.getConnectorNeighbours = function () {
        var edges = [];
        edges.push(this.start);
        edges.push(this.end);
        var allEdges = this.internalGetNeighbours(ElementType_1.ElementType.Edge).filter(function (elem) {
            return elem != this.start && elem != this.end;
        });
        edges = edges.concat(allEdges);
        return edges;
    };
    EdgeElement.prototype.addStartConnector = function (connectorId) {
        this.start = connectorId;
        this.addConnectorNeighbour(connectorId);
    };
    EdgeElement.prototype.addEndConnector = function (connectorId) {
        this.end = connectorId;
        this.addConnectorNeighbour(connectorId);
    };
    EdgeElement.prototype.delete = function (graph) {
        var connectorIds = this.getConnectorNeighbours();
        for (var _i = 0, connectorIds_1 = connectorIds; _i < connectorIds_1.length; _i++) {
            var connectorId = connectorIds_1[_i];
            var connector = graph.getElement(connectorId);
            connector.unlinkEdgeNeighbour(this.id);
        }
        var modelIds = this.getModelNeighbours();
        for (var _a = 0, modelIds_1 = modelIds; _a < modelIds_1.length; _a++) {
            var modelId = modelIds_1[_a];
            var model = graph.getElement(modelId);
            model.unlinkEdgeNeighbour(this.id);
        }
        this.remove(graph);
    };
    return EdgeElement;
}(AbstractElement_1.AbstractElement));
exports.EdgeElement = EdgeElement;
