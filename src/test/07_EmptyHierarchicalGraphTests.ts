import chai = require("chai");
import * as Common from "cubitt-common";
import {GraphInterface, Project} from "./../cubitt-graph";
import {ExpectationBuilder} from "./helper/ExpectationBuilder";
import {uniqueGUID} from "./helper/UniqueGuid";

let expect = chai.expect;
describe("Empty Hierarchical Graph", () => {
	let subject: GraphInterface;
	let expectationBuilder: ExpectationBuilder;

	let modelGuid: Common.Guid;
	let childModelGuid: Common.Guid;

	let nodeGuid: Common.Guid;

	beforeEach(function () {
		subject = new Project();

		modelGuid = uniqueGUID();
		childModelGuid = uniqueGUID();

		nodeGuid = uniqueGUID();

		subject.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"});
		subject.addNode(nodeGuid, "TEST_NODE", modelGuid);
		subject.addModel(childModelGuid, "TEST_SUBMODEL", {}, nodeGuid);

		expectationBuilder = new ExpectationBuilder();
		expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
			.addModel(childModelGuid, "TEST_SUBMODEL")
			.addNode(nodeGuid, "TEST_NODE")
			.addNodeToModel(nodeGuid, modelGuid)
			.addModelToNode(childModelGuid, nodeGuid);
	});

	describe("Serialize", () => {
		it("should correctly serialize a Project with a single Model, a Node and a Submodel", (done) => {
				expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
				done();
		});
	});

	describe("addNode", () => {
		it("Should correctly add a subnode", (done) => {
			let guid = uniqueGUID();
			subject.addNode(guid, "TEST_SUBNODE", childModelGuid);

			expectationBuilder.addNode(guid, "TEST_SUBNODE")
				.addNodeToModel(guid, childModelGuid);
			expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
			done();
		});
	});

	describe("Delete", () => {
		it("the submodel should result in a Model with a Node", (done) => {
			subject.deleteModel(childModelGuid);

			expectationBuilder = new ExpectationBuilder();
			expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
				.addNode(nodeGuid, "TEST_NODE")
				.addNodeToModel(nodeGuid, modelGuid);
			expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
			done();
		});

		it("the Node should result in a Model", (done) => {
			subject.deleteNode(nodeGuid);

			expectationBuilder = new ExpectationBuilder();
			expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"});
			expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
			done();
		});

		it("the Model should result in an empty Graph", (done) => {
			subject.deleteModel(modelGuid);
			let expected = new ExpectationBuilder().toObject();
			expect(subject.serialize()).to.deep.equal(expected);
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
