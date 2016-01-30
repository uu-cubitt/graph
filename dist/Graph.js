"use strict";
var Common = require("cubitt-common");
var NodeElement_1 = require("./NodeElement");
var EdgeElement_1 = require("./EdgeElement");
var ModelElement_1 = require("./ModelElement");
var ConnectorElement_1 = require("./ConnectorElement");
var ElementType_1 = require("./ElementType");
var Graph = (function () {
    function Graph() {
        this.Elements = {};
    }
    Graph.prototype.getElement = function (id) {
        var elem = this.Elements[id.toString()];
        if (elem == undefined) {
            throw new Error("Element with GUID " + id.toString() + " not found");
        }
        return elem;
    };
    Graph.prototype.hasElement = function (id) {
        return this.Elements[id.toString()] !== undefined;
    };
    Graph.prototype.hasModel = function (id) {
        var elem = this.Elements[id.toString()];
        return elem !== undefined && elem.getType() == ElementType_1.ElementType.Model;
    };
    Graph.prototype.hasNode = function (id) {
        var elem = this.Elements[id.toString()];
        return elem !== undefined && elem.getType() == ElementType_1.ElementType.Node;
    };
    Graph.prototype.hasConnector = function (id) {
        var elem = this.Elements[id.toString()];
        return elem !== undefined && elem.getType() == ElementType_1.ElementType.Connector;
    };
    Graph.prototype.hasEdge = function (id) {
        var elem = this.Elements[id.toString()];
        return elem !== undefined && elem.getType() == ElementType_1.ElementType.Edge;
    };
    Graph.prototype.deleteElement = function (id, ofType) {
        if (ofType == undefined) {
            delete this.Elements[id.toString()];
        }
        else {
            var elem = this.Elements[id.toString()];
            if (elem != undefined) {
                if (elem.getType() != ofType) {
                    throw new Error("Attempted to delete a " + elem.getType() + " with delete" + ofType.toString());
                }
                elem.delete(this);
            }
        }
    };
    Graph.prototype.addNode = function (id, type, modelId, properties) {
        if (properties === void 0) { properties = {}; }
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        var model = this.Elements[modelId.toString()];
        if (model == undefined) {
            throw new Error("No model with GUID " + modelId + " could be found");
        }
        if (model.getType() != ElementType_1.ElementType.Model) {
            throw new Error("GUID " + modelId.toString() + " does not belong to a model");
        }
        properties["type"] = type;
        var node = new NodeElement_1.NodeElement(id, properties);
        node.addModelNeighbour(modelId);
        model.addNodeNeighbour(id);
        this.Elements[node.Id.toString()] = node;
    };
    Graph.prototype.addEdge = function (id, type, modelId, startConnectorId, endConnectorId, properties) {
        if (properties === void 0) { properties = {}; }
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        var model = this.Elements[modelId.toString()];
        if (model == undefined) {
            throw new Error("No model with GUID " + modelId + " could be found");
        }
        if (model.getType() != ElementType_1.ElementType.Model) {
            throw new Error("Element with GUID " + modelId.toString() + " is not a Model");
        }
        var startConnector = this.Elements[startConnectorId.toString()];
        if (startConnector == undefined) {
            throw new Error("No startConnector with GUID " + startConnectorId + " could be found");
        }
        if (startConnector.getType() != ElementType_1.ElementType.Connector) {
            throw new Error("Invalid startConnectorId, " + startConnectorId + " does not belong to a connector");
        }
        var endConnector = this.Elements[endConnectorId.toString()];
        if (endConnector == undefined) {
            throw new Error("No endConnector with GUID " + endConnectorId + " could be found");
        }
        if (endConnector.getType() != ElementType_1.ElementType.Connector) {
            throw new Error("Invalid endConnectorId, " + endConnectorId + " does not belong to a connector");
        }
        properties["type"] = type;
        var edge = new EdgeElement_1.EdgeElement(id, properties);
        edge.addStartConnector(startConnectorId);
        edge.addEndConnector(endConnectorId);
        startConnector.addEdgeNeighbour(id);
        endConnector.addEdgeNeighbour(id);
        model.addEdgeNeighbour(id);
        edge.addModelNeighbour(modelId);
        this.Elements[id.toString()] = edge;
    };
    Graph.prototype.addConnector = function (id, type, nodeId, properties) {
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        var node = this.Elements[nodeId.toString()];
        if (node == undefined) {
            throw new Error("No node with GUID " + nodeId + " could be found");
        }
        if (node.getType() != ElementType_1.ElementType.Node) {
            throw new Error("Invalid nodeId, " + nodeId + " does not belong to a Node");
        }
        properties["type"] = type;
        var connector = new ConnectorElement_1.ConnectorElement(id, properties);
        node.addConnectorNeighbour(id);
        connector.addNodeNeighbour(nodeId);
        this.Elements[id.toString()] = connector;
    };
    Graph.prototype.addModel = function (id, type, properties) {
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        properties["type"] = type;
        var model = new ModelElement_1.ModelElement(id, properties);
        this.Elements[id.toString()] = model;
    };
    Graph.prototype.setProperty = function (id, name, value) {
        if (this.hasElement(id) == false) {
            throw new Error("An Element with GUID " + id.toString() + " could not be found");
        }
        this.Elements[id.toString()].setProperty(name, value);
    };
    Graph.prototype.deleteNode = function (id) {
        this.deleteElement(id, ElementType_1.ElementType.Node);
    };
    Graph.prototype.deleteEdge = function (id) {
        this.deleteElement(id, ElementType_1.ElementType.Edge);
    };
    Graph.prototype.deleteConnector = function (id) {
        this.deleteElement(id, ElementType_1.ElementType.Connector);
    };
    Graph.prototype.deleteModel = function (id) {
        this.deleteElement(id, ElementType_1.ElementType.Model);
    };
    Graph.prototype.deleteProperty = function (id, name) {
        var elem = this.Elements[id.toString()];
        if (elem == undefined) {
            throw new Error("Element not found");
        }
        elem.deleteProperty(id, name);
    };
    Graph.prototype.deserialize = function (jsonObject) {
        var graph = new Graph();
        var modelElements = {};
        var models = jsonObject['models'];
        for (var modelKey in models) {
            var model = models[modelKey];
            var id = Common.Guid.parse(model["id"]);
            var properties = this.propertiesFromJSON(model["properties"]);
            graph.addModel(id, properties["type"], properties);
        }
        var nodes = jsonObject['nodes'];
        for (var nodeKey in nodes) {
            var node = nodes[nodeKey];
            var id = Common.Guid.parse(node["id"]);
            var properties = this.propertiesFromJSON(node["properties"]);
            var modelId = Common.Guid.parse(node["neighbours"]["models"][0]);
            graph.addNode(id, properties["type"], modelId, properties);
        }
        var connectors = jsonObject['connectors'];
        for (var connectorKey in connectors) {
            var connector = connectors[connectorKey];
            var id = Common.Guid.parse(connector["id"]);
            var properties = this.propertiesFromJSON(connector["properties"]);
            var nodeId = Common.Guid.parse(connector["neighbours"]["nodes"]["0"]);
            graph.addConnector(id, properties['type'], nodeId, properties);
        }
        var edges = jsonObject['edges'];
        for (var edgeKey in edges) {
            var edge = edges[edgeKey];
            var id = Common.Guid.parse(edge["id"]);
            var properties = this.propertiesFromJSON(edge["properties"]);
            var modelId = Common.Guid.parse(edge["neighbours"]["models"][0]);
            var startConnector = Common.Guid.parse(edge["neighbours"]["connectors"][0]);
            var endConnector = Common.Guid.parse(edge["neighbours"]["connectors"][1]);
            graph.addEdge(id, properties["type"], modelId, startConnector, endConnector, properties);
        }
        return graph;
    };
    Graph.prototype.propertiesFromJSON = function (jsonProperties) {
        var properties = {};
        for (var propertyKey in jsonProperties) {
            properties[propertyKey] = jsonProperties[propertyKey];
        }
        return properties;
    };
    Graph.prototype.serialize = function () {
        var graph = {
            "models": {},
            "nodes": {},
            "edges": {},
            "connectors": {}
        };
        var elements = this.Elements;
        for (var key in elements) {
            var elem = elements[key];
            var obj = {
                "id": elem.Id.toString(),
                "properties": elem.getProperties(),
                "neighbours": {
                    "models": elem.getModelNeighbours().map(function (val) { return val.toString(); }),
                    "nodes": elem.getNodeNeighbours().map(function (val) { return val.toString(); }),
                    "edges": elem.getEdgeNeighbours().map(function (val) { return val.toString(); }),
                    "connectors": elem.getConnectorNeighbours().map(function (val) { return val.toString(); })
                }
            };
            if (elem.getType() == ElementType_1.ElementType.Node) {
                graph.nodes[elem.Id.toString()] = obj;
            }
            else if (elem.getType() == ElementType_1.ElementType.Edge) {
                graph.edges[elem.Id.toString()] = obj;
            }
            else if (elem.getType() == ElementType_1.ElementType.Connector) {
                graph.connectors[elem.Id.toString()] = obj;
            }
            else {
                graph.models[elem.Id.toString()] = obj;
            }
        }
        return graph;
    };
    return Graph;
}());
exports.Graph = Graph;
