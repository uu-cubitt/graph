"use strict";
var ExpectationBuilder = (function () {
    function ExpectationBuilder() {
        this.graph = {
            "models": {},
            "nodes": {},
            "edges": {},
            "connectors": {}
        };
    }
    ExpectationBuilder.prototype.addModel = function (guid, type, properties) {
        properties = this.createProperties(type, properties);
        this.graph.models[guid.toString()] = {
            "id": guid.toString(),
            "neighbours": {
                "models": {
                    "parent": [],
                    "child": []
                },
                "nodes": {
                    "parent": [],
                    "child": []
                },
                "edges": {
                    "parent": [],
                    "child": []
                },
                "connectors": {
                    "parent": [],
                    "child": []
                }
            },
            "properties": properties
        };
        return this;
    };
    ExpectationBuilder.prototype.addNode = function (guid, type, properties) {
        properties = this.createProperties(type, properties);
        this.graph.nodes[guid.toString()] = {
            "id": guid.toString(),
            "neighbours": {
                "models": {
                    "parent": [],
                    "child": []
                },
                "nodes": {
                    "parent": [],
                    "child": []
                },
                "edges": {
                    "parent": [],
                    "child": []
                },
                "connectors": {
                    "parent": [],
                    "child": []
                }
            },
            "properties": properties
        };
        return this;
    };
    ExpectationBuilder.prototype.addConnector = function (guid, type, properties) {
        properties = this.createProperties(type, properties);
        this.graph.connectors[guid.toString()] = {
            "id": guid.toString(),
            "neighbours": {
                "models": {
                    "parent": [],
                    "child": []
                },
                "nodes": {
                    "parent": [],
                    "child": []
                },
                "edges": {
                    "parent": [],
                    "child": []
                },
                "connectors": {
                    "parent": [],
                    "child": []
                }
            },
            "properties": properties
        };
        return this;
    };
    ExpectationBuilder.prototype.addEdge = function (guid, type, properties) {
        properties = this.createProperties(type, properties);
        this.graph.edges[guid.toString()] = {
            "id": guid.toString(),
            "neighbours": {
                "models": {
                    "parent": [],
                    "child": []
                },
                "nodes": {
                    "parent": [],
                    "child": []
                },
                "edges": {
                    "parent": [],
                    "child": []
                },
                "connectors": {
                    "parent": [],
                    "child": []
                }
            },
            "properties": properties
        };
        return this;
    };
    ExpectationBuilder.prototype.setModelProperty = function (guid, key, value) {
        this.graph.models[guid.toString()]["properties"][key] = value;
        return this;
    };
    ExpectationBuilder.prototype.deleteModelProperty = function (guid, key) {
        delete this.graph.models[guid.toString()]["properties"][key];
        return this;
    };
    ExpectationBuilder.prototype.addNodeToModel = function (nodeGuid, modelGuid) {
        this.graph.models[modelGuid.toString()]["neighbours"]["nodes"]["child"].push(nodeGuid.toString());
        this.graph.nodes[nodeGuid.toString()]["neighbours"]["models"]["parent"].push(modelGuid.toString());
        return this;
    };
    ExpectationBuilder.prototype.addConnectorToNode = function (connectorGuid, nodeGuid) {
        this.graph.nodes[nodeGuid.toString()]["neighbours"]["connectors"]["child"].push(connectorGuid.toString());
        this.graph.connectors[connectorGuid.toString()]["neighbours"]["nodes"]["parent"].push(nodeGuid.toString());
        return this;
    };
    ExpectationBuilder.prototype.addEdgeToConnector = function (edgeGuid, connectorGuid) {
        this.graph.connectors[connectorGuid.toString()]["neighbours"]["edges"]["child"].push(edgeGuid.toString());
        this.graph.edges[edgeGuid.toString()]["neighbours"]["connectors"]["parent"].push(connectorGuid.toString());
        return this;
    };
    ExpectationBuilder.prototype.addEdgeToModel = function (edgeGuid, modelGuid) {
        this.graph.models[modelGuid.toString()]["neighbours"]["edges"]["child"].push(edgeGuid.toString());
        this.graph.edges[edgeGuid.toString()]["neighbours"]["models"]["parent"].push(modelGuid.toString());
        return this;
    };
    ExpectationBuilder.prototype.addModelToNode = function (modelGuid, nodeGuid) {
        this.graph.nodes[nodeGuid.toString()]["neighbours"]["models"]["child"].push(modelGuid.toString());
        this.graph.models[modelGuid.toString()]["neighbours"]["nodes"]["parent"].push(nodeGuid.toString());
        return this;
    };
    ExpectationBuilder.prototype.addModelToEdge = function (modelGuid, edgeGuid) {
        this.graph.edges[edgeGuid.toString()]["neighbours"]["models"]["child"].push(modelGuid.toString());
        this.graph.models[modelGuid.toString()]["neighbours"]["edges"]["parent"].push(edgeGuid.toString());
        return this;
    };
    ExpectationBuilder.prototype.toObject = function () {
        return this.graph;
    };
    ExpectationBuilder.prototype.createProperties = function (type, properties) {
        if (properties === null || properties === undefined) {
            properties = {};
        }
        properties["type"] = type;
        return properties;
    };
    return ExpectationBuilder;
}());
exports.ExpectationBuilder = ExpectationBuilder;
