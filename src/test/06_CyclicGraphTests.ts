/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require("chai");
import * as Common from "cubitt-common";
import {GraphInterface, Project} from "./../cubitt-graph";
import {ExpectationBuilder} from "./helper/ExpectationBuilder";
import {uniqueGUID} from "./helper/UniqueGuid";

let expect = chai.expect;
describe("Cyclic Graph", () => {
	let subject: GraphInterface;
	let expectationBuilder: ExpectationBuilder;

	let modelGuid: Common.Guid;

	let nodeGuid: Common.Guid;
	let node2Guid: Common.Guid;
	let node3Guid: Common.Guid;

	let connectorGuid: Common.Guid;
	let connector2Guid: Common.Guid;
	let connector3Guid: Common.Guid;

	let edgeGuid: Common.Guid;
	let edge2Guid: Common.Guid;
	let edge3Guid: Common.Guid;

	beforeEach(function () {
		subject = new Project();
		modelGuid = uniqueGUID();

		nodeGuid = uniqueGUID();
		node2Guid = uniqueGUID();
		node3Guid = uniqueGUID();

		connectorGuid = uniqueGUID();
		connector2Guid = uniqueGUID();
		connector3Guid = uniqueGUID();

		edgeGuid = uniqueGUID();
		edge2Guid = uniqueGUID();
		edge3Guid = uniqueGUID();

		subject.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"});
		// Node 1
		subject.addNode(nodeGuid, "TEST_NODE", modelGuid);
		subject.addConnector(connectorGuid, "TEST_CONNECTOR", nodeGuid);
		// Node 2
		subject.addNode(node2Guid, "TEST_NODE", modelGuid);
		subject.addConnector(connector2Guid, "TEST_CONNECTOR", node2Guid);
		// Node 3
		subject.addNode(node3Guid, "TEST_NODE", modelGuid);
		subject.addConnector(connector3Guid, "TEST_CONNECTOR", node3Guid);
		// Edges
		subject.addEdge(edgeGuid, "TEST_EDGE", modelGuid, connectorGuid, connector2Guid);
		subject.addEdge(edge2Guid, "TEST_EDGE", modelGuid, connector2Guid, connector3Guid);
		subject.addEdge(edge3Guid, "TEST_EDGE", modelGuid, connector3Guid, connectorGuid);

		expectationBuilder = new ExpectationBuilder();
		expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
			.addNode(nodeGuid, "TEST_NODE")
			.addNode(node2Guid, "TEST_NODE")
			.addNode(node3Guid, "TEST_NODE")
			.addConnector(connectorGuid, "TEST_CONNECTOR")
			.addConnector(connector2Guid, "TEST_CONNECTOR")
			.addConnector(connector3Guid, "TEST_CONNECTOR")
			.addEdge(edgeGuid, "TEST_EDGE")
			.addEdge(edge2Guid, "TEST_EDGE")
			.addEdge(edge3Guid, "TEST_EDGE")
			.addNodeToModel(nodeGuid, modelGuid)
			.addNodeToModel(node2Guid, modelGuid)
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

	describe("Serialize", () => {
		it("should correctly a cyclic graph of 3 nodes", (done) => {
				expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
				done();
		});
	});

	describe("Delete", () => {
		it("an Edge should result in a model with three Nodes with connectors, with two edges", (done) => {
			subject.deleteEdge(edge2Guid);

			expectationBuilder = new ExpectationBuilder();
			expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
				.addNode(nodeGuid, "TEST_NODE")
				.addNode(node2Guid, "TEST_NODE")
				.addNode(node3Guid, "TEST_NODE")
				.addConnector(connectorGuid, "TEST_CONNECTOR")
				.addConnector(connector2Guid, "TEST_CONNECTOR")
				.addConnector(connector3Guid, "TEST_CONNECTOR")
				.addEdge(edgeGuid, "TEST_EDGE")
				.addEdge(edge3Guid, "TEST_EDGE")
				.addNodeToModel(nodeGuid, modelGuid)
				.addNodeToModel(node2Guid, modelGuid)
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
			expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
			done();
		});

		it("a Connector should result in a graph with the Model and three Nodes (one without connector) with a single edge", (done) => {
			subject.deleteConnector(connector2Guid);

			expectationBuilder = new ExpectationBuilder();
			expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
				.addNode(nodeGuid, "TEST_NODE")
				.addNode(node2Guid, "TEST_NODE")
				.addNode(node3Guid, "TEST_NODE")
				.addConnector(connectorGuid, "TEST_CONNECTOR")
				.addConnector(connector3Guid, "TEST_CONNECTOR")
				.addEdge(edge3Guid, "TEST_EDGE")
				.addNodeToModel(nodeGuid, modelGuid)
				.addNodeToModel(node2Guid, modelGuid)
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

	describe("Deserialize", () => {
		it("Serialize(Deserialize(Serialize())) should equal Serialize()", (done) => {
				let serialize = subject.serialize();
				let graph: GraphInterface = subject.deserialize(serialize);
				expect(graph.serialize()).to.deep.equal(serialize);
				done();
		});
	});
});
