"use strict";
var chai = require('chai');
var Common = require("cubitt-common");
var cubitt_graph_1 = require('./../cubitt-graph');
var guids = [];
function uniqueGUID() {
    var guid = Common.Guid.newGuid();
    while (guids.indexOf(guid) >= 0) {
        guid = Common.Guid.newGuid();
    }
    guids.push(guid);
    return guid;
}
function showGUIDTypes(subject) {
    var elems = subject.toJSON();
    console.log("Models:");
    for (var id in elems["models"]) {
        console.log(" - " + id);
    }
    console.log("Nodes:");
    for (var id in elems["nodes"]) {
        console.log(" - " + id);
    }
    console.log("Connectors:");
    for (var id in elems["connectors"]) {
        console.log(" - " + id);
    }
    console.log("Edges:");
    for (var id in elems["edges"]) {
        console.log(" - " + id);
    }
}
var expect = chai.expect;
describe('Delete tests', function () {
    var subject;
    var guids = {};
    beforeEach(function () {
        subject = new cubitt_graph_1.Project();
        guids.model = uniqueGUID();
        guids.node = uniqueGUID();
        guids.node2 = uniqueGUID();
        guids.connector = uniqueGUID();
        guids.connector2 = uniqueGUID();
        guids.edge = uniqueGUID();
        subject.addModel(guids.model, "TEST_MODEL");
        subject.addNode(guids.node, "TEST_NODE", guids.model, { "testkey": "testvalue" });
        subject.addNode(guids.node2, "TEST_NODE", guids.model);
        subject.addConnector(guids.connector, "TEST_CONNECTOR", guids.node);
        subject.addConnector(guids.connector2, "TEST_CONNECTOR", guids.node2);
        subject.addEdge(guids.edge, "TEST_EDGE", guids.model, guids.connector, guids.connector2);
    });
    describe('Delete actions', function () {
        it('should correctly delete an edge', function (done) {
            subject.deleteEdge(guids.edge);
            var result = subject.toJSON();
            var expected = new cubitt_graph_1.Project();
            expected.addModel(guids.model, "TEST_MODEL");
            expected.addNode(guids.node, "TEST_NODE", guids.model, { "testkey": "testvalue" });
            expected.addNode(guids.node2, "TEST_NODE", guids.model);
            expected.addConnector(guids.connector, "TEST_CONNECTOR", guids.node);
            expected.addConnector(guids.connector2, "TEST_CONNECTOR", guids.node2);
            expect(result).to.deep.equal(expected.toJSON());
            done();
        });
        it('should correctly delete a connector', function (done) {
            subject.deleteConnector(guids.connector);
            var result = subject.toJSON();
            var expected = new cubitt_graph_1.Project();
            expected.addModel(guids.model, "TEST_MODEL");
            expected.addNode(guids.node, "TEST_NODE", guids.model, { "testkey": "testvalue" });
            expected.addNode(guids.node2, "TEST_NODE", guids.model);
            expected.addConnector(guids.connector2, "TEST_CONNECTOR", guids.node2);
            expect(result).to.deep.equal(expected.toJSON());
            done();
        });
        it('should correctly delete a node', function (done) {
            subject.deleteNode(guids.node);
            var result = subject.toJSON();
            var expected = new cubitt_graph_1.Project();
            expected.addModel(guids.model, "TEST_MODEL");
            expected.addNode(guids.node2, "TEST_NODE", guids.model);
            expected.addConnector(guids.connector2, "TEST_CONNECTOR", guids.node2);
            expect(result).to.deep.equal(expected.toJSON());
            done();
        });
        it('should correctly delete a model', function (done) {
            subject.deleteModel(guids.model);
            var result = subject.toJSON();
            var expected = new cubitt_graph_1.Project();
            expect(result).to.deep.equal(expected.toJSON());
            done();
        });
    });
});
