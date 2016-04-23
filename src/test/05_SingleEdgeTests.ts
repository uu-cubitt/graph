import chai = require("chai");
import * as Common from "cubitt-common";
import {GraphInterface, Project} from "./../cubitt-graph";
import {ExpectationBuilder} from "./helper/ExpectationBuilder";
import {uniqueGUID} from "./helper/UniqueGuid";

let expect = chai.expect;
describe("Single Edge Graph", () => {
	let subject: GraphInterface;
	let expectationBuilder: ExpectationBuilder;

	let modelGuid: Common.Guid;
	let nodeGuid: Common.Guid;
	let connectorGuid: Common.Guid;

	let node2Guid: Common.Guid;
	let connector2Guid: Common.Guid;

	let edgeGuid: Common.Guid;

	beforeEach(function () {
		subject = new Project();
		modelGuid = uniqueGUID();
		nodeGuid = uniqueGUID();
		connectorGuid = uniqueGUID();
		node2Guid = uniqueGUID();
		connector2Guid = uniqueGUID();
		edgeGuid = uniqueGUID();
		subject.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"});
		subject.addNode(nodeGuid, "TEST_NODE", modelGuid);
		subject.addConnector(connectorGuid, "TEST_CONNECTOR", nodeGuid);

		subject.addNode(node2Guid, "TEST_NODE", modelGuid);
		subject.addConnector(connector2Guid, "TEST_CONNECTOR", node2Guid);
		subject.addEdge(edgeGuid, "TEST_EDGE", modelGuid, connectorGuid, connector2Guid);

		expectationBuilder = new ExpectationBuilder();
		expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
			.addNode(nodeGuid, "TEST_NODE")
			.addNode(node2Guid, "TEST_NODE")
			.addConnector(connectorGuid, "TEST_CONNECTOR")
			.addConnector(connector2Guid, "TEST_CONNECTOR")
			.addEdge(edgeGuid, "TEST_EDGE")
			.addNodeToModel(nodeGuid, modelGuid)
			.addNodeToModel(node2Guid, modelGuid)
			.addConnectorToNode(connectorGuid, nodeGuid)
			.addConnectorToNode(connector2Guid, node2Guid)
			.addEdgeToConnector(edgeGuid, connectorGuid)
			.addEdgeToConnector(edgeGuid, connector2Guid)
			.addEdgeToModel(edgeGuid, modelGuid);
	});

	describe("Serialize", () => {
		it("should correctly serialize a Project with a single Model, Node and Connector", (done) => {
				expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
				done();
		});
	});

	describe("Delete", () => {
		it("The Edge should result in a model with two Nodes with connectors", (done) => {
			subject.deleteEdge(edgeGuid);

			expectationBuilder = new ExpectationBuilder();
			expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
				.addNode(nodeGuid, "TEST_NODE")
				.addNode(node2Guid, "TEST_NODE")
				.addConnector(connectorGuid, "TEST_CONNECTOR")
				.addConnector(connector2Guid, "TEST_CONNECTOR")
				.addNodeToModel(nodeGuid, modelGuid)
				.addNodeToModel(node2Guid, modelGuid)
				.addConnectorToNode(connectorGuid, nodeGuid)
				.addConnectorToNode(connector2Guid, node2Guid);

			expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
			done();
		});
		it("the Connector should result in a graph with the Model and the two Nodes (one with a Connector)", (done) => {
			subject.deleteConnector(connectorGuid);

			expectationBuilder = new ExpectationBuilder();
			expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
				.addNode(nodeGuid, "TEST_NODE")
				.addNode(node2Guid, "TEST_NODE")
				.addConnector(connector2Guid, "TEST_CONNECTOR")
				.addNodeToModel(nodeGuid, modelGuid)
				.addNodeToModel(node2Guid, modelGuid)
				.addConnectorToNode(connector2Guid, node2Guid);

			expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
			done();
		});
		it("the Node should result in a graph with only the Model and a Node with Connector", (done) => {
			subject.deleteNode(nodeGuid);

			expectationBuilder = new ExpectationBuilder();
			expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
				.addNode(node2Guid, "TEST_NODE")
				.addConnector(connector2Guid, "TEST_CONNECTOR")
				.addNodeToModel(node2Guid, modelGuid)
				.addConnectorToNode(connector2Guid, node2Guid);

			expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
			done();
		});
		it("the Model should result in an empty Graph", (done) => {
			subject.deleteModel(modelGuid);

			expectationBuilder = new ExpectationBuilder();
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

	describe("hasConnector", () => {
		it("Should return true for an existing connector", (done) => {
			expect(subject.hasConnector(connectorGuid)).to.true;
			done();
		});
	});

	describe("hasEdge", () => {
		it("Should return true for an existing edge", (done) => {
			expect(subject.hasEdge(edgeGuid)).to.true;
			done();
		});
	});

});
