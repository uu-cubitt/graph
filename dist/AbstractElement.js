"use strict";
var ElementType_1 = require("./ElementType");
var AbstractElement = (function () {
    function AbstractElement(id, properties) {
        if (properties === void 0) { properties = {}; }
        this.id = id;
        this.properties = properties;
        this.nodeNeighbours = {};
        this.edgeNeighbours = {};
        this.connectorNeighbours = {};
        this.modelNeighbours = {};
    }
    Object.defineProperty(AbstractElement.prototype, "Id", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    AbstractElement.prototype.remove = function (graph) {
        graph.deleteElement(this.id);
    };
    AbstractElement.prototype.addNodeNeighbour = function (id) {
        this.nodeNeighbours[id.toString()] = id;
    };
    AbstractElement.prototype.addEdgeNeighbour = function (id) {
        this.edgeNeighbours[id.toString()] = id;
    };
    AbstractElement.prototype.addConnectorNeighbour = function (id) {
        this.connectorNeighbours[id.toString()] = id;
    };
    AbstractElement.prototype.addModelNeighbour = function (id) {
        this.modelNeighbours[id.toString()] = id;
    };
    AbstractElement.prototype.internalGetNeighbours = function (type) {
        if (type == ElementType_1.ElementType.Node) {
            return this.toArray(this.nodeNeighbours);
        }
        else if (type == ElementType_1.ElementType.Edge) {
            return this.toArray(this.edgeNeighbours);
        }
        else if (type == ElementType_1.ElementType.Connector) {
            return this.toArray(this.connectorNeighbours);
        }
        else if (type == ElementType_1.ElementType.Model) {
            return this.toArray(this.modelNeighbours);
        }
        else {
            var types = [];
            types.push(this.nodeNeighbours);
            types.push(this.edgeNeighbours);
            types.push(this.connectorNeighbours);
            types.push(this.modelNeighbours);
            var result = [];
            for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                var elems = types_1[_i];
                for (var key in elems) {
                    result.push(elems[key]);
                }
            }
            return result;
        }
    };
    AbstractElement.prototype.getNeighbours = function () {
        return this.internalGetNeighbours();
    };
    AbstractElement.prototype.getNodeNeighbours = function () {
        return this.internalGetNeighbours(ElementType_1.ElementType.Node);
    };
    AbstractElement.prototype.getEdgeNeighbours = function () {
        return this.internalGetNeighbours(ElementType_1.ElementType.Edge);
    };
    AbstractElement.prototype.getConnectorNeighbours = function () {
        return this.internalGetNeighbours(ElementType_1.ElementType.Connector);
    };
    AbstractElement.prototype.getModelNeighbours = function () {
        return this.internalGetNeighbours(ElementType_1.ElementType.Model);
    };
    AbstractElement.prototype.setProperty = function (name, value) {
        this.properties[name] = value;
    };
    AbstractElement.prototype.deleteProperty = function (id, name) {
        delete this.properties[name];
    };
    AbstractElement.prototype.getProperty = function (name) {
        return this.properties[name];
    };
    AbstractElement.prototype.getProperties = function () {
        return this.properties;
    };
    AbstractElement.prototype.unlinkNodeNeighbour = function (id) {
        delete this.nodeNeighbours[id.toString()];
    };
    AbstractElement.prototype.unlinkEdgeNeighbour = function (id) {
        delete this.edgeNeighbours[id.toString()];
    };
    AbstractElement.prototype.unlinkConnectorNeighbour = function (id) {
        delete this.connectorNeighbours[id.toString()];
    };
    AbstractElement.prototype.unlinkModelNeighbour = function (id) {
        delete this.modelNeighbours[id.toString()];
    };
    AbstractElement.prototype.toArray = function (dictionary) {
        var result = [];
        for (var key in dictionary) {
            var elem = dictionary[key];
            result.push(elem);
        }
        return result;
    };
    return AbstractElement;
}());
exports.AbstractElement = AbstractElement;
