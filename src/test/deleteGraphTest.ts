/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />


import chai = require('chai');
import * as Common from "cubitt-common"
import {GraphInterface,Project} from './../cubitt-graph'

var guids = [];

function uniqueGUID() {
    var guid = Common.Guid.newGuid();
    while(guids.indexOf(guid) >= 0) {
        guid = Common.Guid.newGuid();
    }
    guids.push(guid);
    return guid;
}

function showGUIDTypes(subject: GraphInterface) {
    var elems = subject.serialize();
    console.log("Models:")
    for (var id in elems["models"]) {
        console.log(" - " + id);
    }
    console.log("Nodes:")
    for (var id in elems["nodes"]) {
        console.log(" - " + id);
    }
    console.log("Connectors:")
    for (var id in elems["connectors"]) {
        console.log(" - " + id);
    }
    console.log("Edges:")
    for (var id in elems["edges"]) {
        console.log(" - " + id);
    }

}

var expect = chai.expect;
describe('Delete tests', () => {
    var subject : GraphInterface;
    var guids : any = {};

    beforeEach(function () {
        // Create the default graph of a model, 2 nodes with connectors and 1 edge
        subject = new Project();

        guids.model = uniqueGUID();
        guids.node = uniqueGUID();
        guids.node2 = uniqueGUID();
        guids.connector = uniqueGUID();
        guids.connector2 = uniqueGUID();
        guids.edge = uniqueGUID();

        subject.addModel(guids.model, "TEST_MODEL");
        subject.addNode(guids.node,"TEST_NODE",guids.model,{"testkey" : "testvalue"});
        subject.addNode(guids.node2,"TEST_NODE",guids.model);
        subject.addConnector(guids.connector,"TEST_CONNECTOR", guids.node);
        subject.addConnector(guids.connector2,"TEST_CONNECTOR", guids.node2);
        subject.addEdge(guids.edge,"TEST_EDGE",guids.model, guids.connector, guids.connector2);
    });

    describe('Delete actions', () => {
        it('should correctly delete an edge', (done) => {
            subject.deleteEdge(guids.edge);
            var result : Object = subject.serialize();
            // Create expected version
            var expected : GraphInterface = new Project();
            expected.addModel(guids.model, "TEST_MODEL");
            expected.addNode(guids.node,"TEST_NODE",guids.model,{"testkey" : "testvalue"});
            expected.addNode(guids.node2,"TEST_NODE",guids.model);
            expected.addConnector(guids.connector,"TEST_CONNECTOR", guids.node);
            expected.addConnector(guids.connector2,"TEST_CONNECTOR", guids.node2);

            expect(result).to.deep.equal(expected.serialize())
            done();
        });

        it('should correctly delete a connector', (done) => {
            subject.deleteConnector(guids.connector);
            var result : Object = subject.serialize();
            // Create expected version
            var expected : GraphInterface = new Project();
            expected.addModel(guids.model, "TEST_MODEL");
            expected.addNode(guids.node,"TEST_NODE",guids.model,{"testkey" : "testvalue"});
            expected.addNode(guids.node2,"TEST_NODE",guids.model);
            expected.addConnector(guids.connector2,"TEST_CONNECTOR", guids.node2);

            expect(result).to.deep.equal(expected.serialize())
            done();
        });

        it('should correctly delete a node', (done) => {
            subject.deleteNode(guids.node);
            var result : Object = subject.serialize();
            // Create expected version
            var expected : GraphInterface = new Project();
            expected.addModel(guids.model, "TEST_MODEL");
            expected.addNode(guids.node2,"TEST_NODE",guids.model);
            expected.addConnector(guids.connector2,"TEST_CONNECTOR", guids.node2);

            expect(result).to.deep.equal(expected.serialize())
            done();
        });

        it('should correctly delete a model', (done) => {
            subject.deleteModel(guids.model)
            var result : Object = subject.serialize();
            // Create expected version
            var expected : GraphInterface = new Project();

            expect(result).to.deep.equal(expected.serialize())
            done();
        });

    });

});
