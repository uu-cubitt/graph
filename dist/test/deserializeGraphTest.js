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
describe('Deserialize tests', function () {
    var subject;
    var guids = {};
    describe('Simple graph', function () {
        it('fromJSON().toJSON() should equal toJSON()', function (done) {
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
            var json = subject.toJSON();
            var result = subject.fromJSON(json);
            debugger;
            expect(result.toJSON()).to.deep.equal(json);
            done();
        });
    });
});
