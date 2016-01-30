"use strict";
var Graph_1 = require("./Graph");
var Project = (function () {
    function Project() {
        this.graph = new Graph_1.Graph();
    }
    Project.prototype.addNode = function (id, type, modelId, properties) {
        if (properties === void 0) { properties = {}; }
        this.graph.addNode(id, type, modelId, properties);
    };
    Project.prototype.addEdge = function (id, type, modelId, startConnectorId, endConnectorId, properties) {
        this.graph.addEdge(id, type, modelId, startConnectorId, endConnectorId, properties);
    };
    Project.prototype.addConnector = function (id, type, nodeId, properties) {
        if (properties === void 0) { properties = {}; }
        this.graph.addConnector(id, type, nodeId, properties);
    };
    Project.prototype.addModel = function (id, type, properties) {
        if (properties === void 0) { properties = {}; }
        this.graph.addModel(id, type, properties);
    };
    Project.prototype.setProperty = function (id, name, value) {
        this.graph.setProperty(id, name, value);
    };
    Project.prototype.deleteNode = function (id) {
        this.graph.deleteNode(id);
    };
    Project.prototype.deleteEdge = function (id) {
        this.graph.deleteEdge(id);
    };
    Project.prototype.deleteConnector = function (id) {
        this.graph.deleteConnector(id);
    };
    Project.prototype.deleteModel = function (id) {
        this.graph.deleteModel(id);
    };
    Project.prototype.deleteProperty = function (id, key) {
        this.graph.deleteProperty(id, key);
    };
    Project.prototype.serialize = function () {
        return this.graph.serialize();
    };
    Project.prototype.deserialize = function (jsonObject) {
        return this.graph.deserialize(jsonObject);
    };
    Project.prototype.hasElement = function (id) {
        return this.graph.hasElement(id);
    };
    Project.prototype.hasModel = function (id) {
        return this.graph.hasModel(id);
    };
    Project.prototype.hasNode = function (id) {
        return this.graph.hasNode(id);
    };
    Project.prototype.hasConnector = function (id) {
        return this.graph.hasConnector(id);
    };
    Project.prototype.hasEdge = function (id) {
        return this.graph.hasEdge(id);
    };
    return Project;
}());
exports.Project = Project;
