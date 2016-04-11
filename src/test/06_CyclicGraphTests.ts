/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import * as Common from "cubitt-common"
import {GraphInterface,Project} from "./../cubitt-graph"
import {ExpectationBuilder} from "./helper/ExpectationBuilder"

var expect = chai.expect;
describe('Cyclic Graph', () => {
    var subject : GraphInterface;
    var expectationBuilder : ExpectationBuilder;

    var modelGuid : Common.Guid;

    var nodeGuid : Common.Guid;
    var node2Guid : Common.Guid;
    var node3Guid : Common.Guid;

    var connectorGuid : Common.Guid;
    var connector2Guid : Common.Guid;
    var connector3Guid: Common.Guid;

    var edgeGuid : Common.Guid;
    var edge2Guid : Common.Guid;
    var edge3Guid: Common.Guid;

    var guids = [];
    /* Helper function to create unique GUIDS for the test */
    function uniqueGUID() {
        var guid = Common.Guid.newGuid();
        while(guids.indexOf(guid) >= 0) {
            guid = Common.Guid.newGuid();
        }
        guids.push(guid);
        return guid;
    }

    beforeEach(function () {
        subject = new Project();
        modelGuid = Common.Guid.newGuid();

        nodeGuid = Common.Guid.newGuid();
        node2Guid = Common.Guid.newGuid();
        node3Guid = Common.Guid.newGuid();

        connectorGuid = Common.Guid.newGuid();
        connector2Guid = Common.Guid.newGuid();
        connector3Guid = Common.Guid.newGuid();

        edgeGuid = Common.Guid.newGuid();
        edge2Guid = Common.Guid.newGuid();
        edge3Guid = Common.Guid.newGuid();

        subject.addModel(modelGuid,"TEST_MODEL", {"testprop" : "testval"});
        // Node 1
        subject.addNode(nodeGuid,"TEST_NODE", modelGuid);
        subject.addConnector(connectorGuid, "TEST_CONNECTOR", nodeGuid);
        // Node 2
        subject.addNode(node2Guid, "TEST_NODE", modelGuid);
        subject.addConnector(connector2Guid, "TEST_CONNECTOR", node2Guid);
        // Node 3
        subject.addNode(node3Guid, "TEST_NODE", modelGuid);
        subject.addConnector(connector3Guid, "TEST_CONNECTOR", node3Guid);
        // Edges
        subject.addEdge(edgeGuid,"TEST_EDGE", modelGuid, connectorGuid, connector2Guid);
        subject.addEdge(edge2Guid,"TEST_EDGE", modelGuid, connector2Guid, connector3Guid);
        subject.addEdge(edge3Guid,"TEST_EDGE", modelGuid, connector3Guid, connectorGuid);

        expectationBuilder = new ExpectationBuilder();
        expectationBuilder.addModel(modelGuid,"TEST_MODEL", {"testprop" : "testval"})
            .addNode(nodeGuid,"TEST_NODE")
            .addNode(node2Guid,"TEST_NODE")
            .addNode(node3Guid,"TEST_NODE")
            .addConnector(connectorGuid, "TEST_CONNECTOR")
            .addConnector(connector2Guid, "TEST_CONNECTOR")
            .addConnector(connector3Guid, "TEST_CONNECTOR")
            .addEdge(edgeGuid, "TEST_EDGE")
            .addEdge(edge2Guid, "TEST_EDGE")
            .addEdge(edge3Guid, "TEST_EDGE")
            .addNodeToModel(nodeGuid,modelGuid)
            .addNodeToModel(node2Guid,modelGuid)
            .addNodeToModel(node3Guid, modelGuid)
            .addConnectorToNode(connectorGuid, nodeGuid)
            .addConnectorToNode(connector2Guid, node2Guid)
            .addConnectorToNode(connector3Guid, node3Guid)
            .addEdgeToConnector(edgeGuid, connectorGuid)
            .addEdgeToConnector(edgeGuid, connector2Guid)
            .addEdgeToConnector(edge2Guid, connector2Guid)
            .addEdgeToConnector(edge2Guid, connector3Guid)
            .addEdgeToConnector(edge3Guid, connector3Guid)
            .addEdgeToConnector(edge3Guid, connectorGuid)
            .addEdgeToModel(edgeGuid, modelGuid)
            .addEdgeToModel(edge2Guid, modelGuid)
            .addEdgeToModel(edge3Guid, modelGuid);

    });

    describe('Serialize', () => {
        it('should correctly a cyclic graph of 3 nodes', (done) => {
                var result : Object = subject.serialize();

                expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject())
                done();
        });
    });

    describe('Delete', () => {
        it('an Edge should result in a model with three Nodes with connectors, with two edges', (done) => {
            subject.deleteEdge(edge2Guid);

            expectationBuilder = new ExpectationBuilder();
            expectationBuilder.addModel(modelGuid,"TEST_MODEL", {"testprop" : "testval"})
                .addNode(nodeGuid,"TEST_NODE")
                .addNode(node2Guid,"TEST_NODE")
                .addNode(node3Guid,"TEST_NODE")
                .addConnector(connectorGuid, "TEST_CONNECTOR")
                .addConnector(connector2Guid, "TEST_CONNECTOR")
                .addConnector(connector3Guid, "TEST_CONNECTOR")
                .addEdge(edgeGuid, "TEST_EDGE")
                .addEdge(edge3Guid, "TEST_EDGE")
                .addNodeToModel(nodeGuid,modelGuid)
                .addNodeToModel(node2Guid,modelGuid)
                .addNodeToModel(node3Guid, modelGuid)
                .addConnectorToNode(connectorGuid, nodeGuid)
                .addConnectorToNode(connector2Guid, node2Guid)
                .addConnectorToNode(connector3Guid, node3Guid)
                .addEdgeToConnector(edgeGuid, connectorGuid)
                .addEdgeToConnector(edgeGuid, connector2Guid)
                .addEdgeToConnector(edge3Guid, connector3Guid)
                .addEdgeToConnector(edge3Guid, connectorGuid)
                .addEdgeToModel(edgeGuid, modelGuid)
                .addEdgeToModel(edge3Guid, modelGuid);
            expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject())
            done();
        });

        it('a Connector should result in a graph with the Model and three Nodes (one without connector) with a single edge', (done) => {
            subject.deleteConnector(connector2Guid);

            expectationBuilder = new ExpectationBuilder();
            expectationBuilder.addModel(modelGuid,"TEST_MODEL", {"testprop" : "testval"})
                .addNode(nodeGuid,"TEST_NODE")
                .addNode(node2Guid,"TEST_NODE")
                .addNode(node3Guid,"TEST_NODE")
                .addConnector(connectorGuid, "TEST_CONNECTOR")
                .addConnector(connector3Guid, "TEST_CONNECTOR")
                .addEdge(edge3Guid, "TEST_EDGE")
                .addNodeToModel(nodeGuid,modelGuid)
                .addNodeToModel(node2Guid,modelGuid)
                .addNodeToModel(node3Guid, modelGuid)
                .addConnectorToNode(connectorGuid, nodeGuid)
                .addConnectorToNode(connector3Guid, node3Guid)
                .addEdgeToConnector(edge3Guid, connector3Guid)
                .addEdgeToConnector(edge3Guid, connectorGuid)
                .addEdgeToModel(edge3Guid, modelGuid);

            expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
            done();
        });

    });

    describe('Deserialize', () => {
        it('Serialize(Deserialize(Serialize())) should equal Serialize()', (done) => {
                var serialize = subject.serialize();
                var graph : GraphInterface = subject.deserialize(serialize);
                expect(graph.serialize()).to.deep.equal(serialize);
                done();
        });
    });
});
