/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require("chai");
import * as Common from "cubitt-common";
import {GraphInterface, Project} from "./../cubitt-graph";
import {ExpectationBuilder} from "./helper/ExpectationBuilder";
import {uniqueGUID} from "./helper/UniqueGuid";

let expect = chai.expect;
describe("Single Node Graph", () => {
	let subject: GraphInterface;
	let expectationBuilder: ExpectationBuilder;

	let modelGuid: Common.Guid;
	let nodeGuid: Common.Guid;

	beforeEach(function () {
		subject = new Project();
		modelGuid = Common.Guid.newGuid();
		nodeGuid = Common.Guid.newGuid();
		subject.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"});
		subject.addNode(nodeGuid, "TEST_NODE", modelGuid);

		expectationBuilder = new ExpectationBuilder();
		expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
			.addNode(nodeGuid, "TEST_NODE")
			.addNodeToModel(nodeGuid, modelGuid);
	});

	describe("Serialize", () => {
		it("should correctly serialize a Project with a single Model and a Node", (done) => {
				expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
				done();
		});
	});

	describe("Insert Connector", () => {
		it("Should correctly create a connector", (done) => {
			let guid = uniqueGUID();
			subject.addConnector(guid, "TEST_CONNECTOR", nodeGuid);

			expectationBuilder.addConnector(guid, "TEST_CONNECTOR")
				.addConnectorToNode(guid, nodeGuid);
			expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
			done();
		});
	});

	describe("Delete", () => {
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
});
