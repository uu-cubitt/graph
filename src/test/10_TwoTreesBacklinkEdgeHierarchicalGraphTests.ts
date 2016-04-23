import chai = require("chai");
import * as Common from "cubitt-common";
import {GraphInterface, Project} from "./../cubitt-graph";
import {ExpectationBuilder} from "./helper/ExpectationBuilder";
import {uniqueGUID} from "./helper/UniqueGuid";

let expect = chai.expect;

/* Model        Model
 *  + +-----+    +
 *  v       |    v
 * Node     |   Node
 *  +       |    +
 *  v       |    v
 * Model    |   Connector
 *  +       |    +
 *  v       +    |
 * Node     Edge<+
 *  +       ^
 *  v       |
 * Connector+
 */
describe("Two Trees Backlink Edge Hierarchical Graph", () => {
	let subject: GraphInterface;
	let expectationBuilder: ExpectationBuilder;

	let modelGuid: Common.Guid;
	let nodeGuid: Common.Guid;
	let childModelGuid: Common.Guid;
	let childNodeGuid: Common.Guid;
	let childConnectorGuid: Common.Guid;

	let model2Guid: Common.Guid;
	let node2Guid: Common.Guid;
	let connector2Guid: Common.Guid;

	let edgeGuid: Common.Guid;

	beforeEach(function () {
		subject = new Project();
		modelGuid = uniqueGUID();
		nodeGuid = uniqueGUID();
		childModelGuid = uniqueGUID();
		childNodeGuid = uniqueGUID();
		childConnectorGuid = uniqueGUID();

		model2Guid = uniqueGUID();
		node2Guid = uniqueGUID();
		connector2Guid = uniqueGUID();

		edgeGuid = uniqueGUID();

		subject.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"});
		subject.addNode(nodeGuid, "TEST_NODE", modelGuid);
		subject.addModel(childModelGuid, "TEST_SUBMODEL", {}, nodeGuid);
		subject.addNode(childNodeGuid, "TEST_NODE", childModelGuid);
		subject.addConnector(childConnectorGuid, "TEST_CONNECTOR", childNodeGuid);

		subject.addModel(model2Guid, "TEST_MODEL");
		subject.addNode(node2Guid, "TEST_NODE", model2Guid);
		subject.addConnector(connector2Guid, "TEST_CONNECTOR", node2Guid);

		subject.addEdge(edgeGuid, "TEST_EDGE", modelGuid, childConnectorGuid, connector2Guid);

		expectationBuilder = new ExpectationBuilder();
		expectationBuilder.addModel(modelGuid, "TEST_MODEL", {"testprop" : "testval"})
			.addNode(nodeGuid, "TEST_NODE")
			.addModel(childModelGuid, "TEST_SUBMODEL")
			.addNode(childNodeGuid, "TEST_NODE")
			.addConnector(childConnectorGuid, "TEST_CONNECTOR")
			.addModel(model2Guid, "TEST_MODEL")
			.addNode(node2Guid, "TEST_NODE")
			.addConnector(connector2Guid, "TEST_CONNECTOR")
			.addEdge(edgeGuid, "TEST_EDGE")
			.addNodeToModel(nodeGuid, modelGuid)
			.addModelToNode(childModelGuid, nodeGuid)
			.addNodeToModel(childNodeGuid, childModelGuid)
			.addNodeToModel(node2Guid, model2Guid)
			.addConnectorToNode(childConnectorGuid, childNodeGuid)
			.addConnectorToNode(connector2Guid, node2Guid)
			.addEdgeToConnector(edgeGuid, childConnectorGuid)
			.addEdgeToConnector(edgeGuid, connector2Guid)
			.addEdgeToModel(edgeGuid, modelGuid);
	});

	describe("Serialize", () => {
		it("should correctly serialize", (done) => {
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
