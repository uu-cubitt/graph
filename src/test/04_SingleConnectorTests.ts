/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require("chai");
import * as Common from "cubitt-common";
import {GraphInterface, Project} from "./../cubitt-graph";
import {ExpectationBuilder} from "./helper/ExpectationBuilder";
import {uniqueGUID} from "./helper/UniqueGuid";

let expect = chai.expect;
describe("Single Connector Graph", () => {
	let subject: GraphInterface;
	let expectationBuilder: ExpectationBuilder;

	let modelGuid: Common.Guid;
	let nodeGuid: Common.Guid;
	let connectorGuid: Common.Guid;

	beforeEach(function () {
		subject = new Project();
		modelGuid = uniqueGUID();
		nodeGuid = uniqueGUID();
		connectorGuid = uniqueGUID();
		subject.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"});
		subject.addNode(nodeGuid, "TEST_NODE", modelGuid);
		subject.addConnector(connectorGuid, "TEST_CONNECTOR", nodeGuid);

		expectationBuilder = new ExpectationBuilder();
		expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
			.addNode(nodeGuid, "TEST_NODE")
			.addConnector(connectorGuid, "TEST_CONNECTOR")
			.addNodeToModel(nodeGuid, modelGuid)
			.addConnectorToNode(connectorGuid, nodeGuid);
	});

	describe("Serialize", () => {
		it("should correctly serialize a Project with a single Model, Node and Connector", (done) => {
			expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
			done();
		});
	});

	describe("Delete", () => {
		it("the Connector should result in a graph with the Model and the Node", (done) => {
			subject.deleteConnector(connectorGuid);
			expectationBuilder = new ExpectationBuilder();
			expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
				.addNode(nodeGuid, "TEST_NODE")
				.addNodeToModel(nodeGuid, modelGuid);

			expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
			done();
		});

		it("the Node should result in a graph with only the Model", (done) => {
			subject.deleteNode(nodeGuid);
			expectationBuilder = new ExpectationBuilder();
			expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"});
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
		it("Should true for an existing connector", (done) => {
			expect(subject.hasConnector(connectorGuid)).to.true;
			done();
		});
	});
});
