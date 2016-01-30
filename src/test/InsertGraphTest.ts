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

var expect = chai.expect;
describe('Insert tests', () => {
    var subject : GraphInterface;

    beforeEach(function () {
        subject = new Project();
    });

    describe('#toJSON', () => {
        it('should correctly serialize an empty Project', (done) => {
            var result : Object = subject.toJSON();
            var expected = {
             "models"     : {},
             "nodes"      : {},
             "edges"      : {},
             "connectors" : {}
            };
            expect(result).to.deep.equal(expected)
            done();
        });

        it('should correctly serialize an Project with a single Model', (done) => {
            var guid = Common.Guid.newGuid();
            var guidstr = guid.toString();
            subject.addModel(guid, "TEST_MODEL");
            var result : Object = subject.toJSON();
            var expected = {
             "models"     : {},
             "nodes"      : {},
             "edges"      : {},
             "connectors" : {}
            };
            expected.models[guidstr] = {
                "id" : guid.toString(),
                "neighbours" : {
                    "models"     : [],
                    "nodes"      : [],
                    "edges"      : [],
                    "connectors" : []
                },
                "properties" : {
                    "type" : "TEST_MODEL"
                }
            };
            expect(result).to.deep.equal(expected)
            done();
        });

        it('should correctly serialize an Project with a single Model and an attached Node', (done) => {
            var modelGuid = Common.Guid.newGuid();
            var nodeGuid = Common.Guid.newGuid();

            subject.addModel(modelGuid, "TEST_MODEL");
            subject.addNode(nodeGuid,"TEST_NODE",modelGuid,{"testkey" : "testvalue"})
            var result : Object = subject.toJSON();
            var expected = {
             "models"     : {},
             "nodes"      : {},
             "edges"      : {},
             "connectors" : {}
            };
            expected.models[modelGuid.toString()] = {
                "id" : modelGuid.toString(),
                "neighbours" : {
                    "models"     : [],
                    "nodes"      : [nodeGuid.toString()],
                    "edges"      : [],
                    "connectors" : []
                },
                "properties" : {
                    "type" : "TEST_MODEL"
                }
            };
            expected.nodes[nodeGuid.toString()] = {
                "id" : nodeGuid.toString(),
                "neighbours" : {
                    "models"     : [modelGuid.toString()],
                    "nodes"      : [],
                    "edges"      : [],
                    "connectors" : []
                },
                "properties" : {
                    "type" : "TEST_NODE",
                    "testkey" : "testvalue"
                }
            };
            expect(result).to.deep.equal(expected)
            done();
        });

        it('should correctly serialize an Project with a single Model, Node with connector', (done) => {
            var guids :any = {};
            guids.model = uniqueGUID();
            guids.node = uniqueGUID();
            guids.connector = uniqueGUID();

            subject.addModel(guids.model, "TEST_MODEL");
            subject.addNode(guids.node,"TEST_NODE",guids.model,{"testkey" : "testvalue"});
            subject.addConnector(guids.connector,"TEST_CONNECTOR", guids.node)
            var result : Object = subject.toJSON();
            var expected = {
             "models"     : {},
             "nodes"      : {},
             "edges"      : {},
             "connectors" : {}
            };
            expected.models[guids.model.toString()] = {
                "id" : guids.model.toString(),
                "neighbours" : {
                    "models"     : [],
                    "nodes"      : [guids.node.toString()],
                    "edges"      : [],
                    "connectors" : []
                },
                "properties" : {
                    "type" : "TEST_MODEL"
                }
            };
            expected.nodes[guids.node.toString()] = {
                "id" : guids.node.toString(),
                "neighbours" : {
                    "models"     : [guids.model.toString()],
                    "nodes"      : [],
                    "edges"      : [],
                    "connectors" : [guids.connector.toString()]
                },
                "properties" : {
                    "type" : "TEST_NODE",
                    "testkey" : "testvalue"
                }
            };
            expected.connectors[guids.connector.toString()] = {
                "id" : guids.connector.toString(),
                "neighbours" : {
                    "models"     : [],
                    "nodes"      : [guids.node.toString()],
                    "edges"      : [],
                    "connectors" : []
                },
                "properties" : {
                    "type" : "TEST_CONNECTOR"
                }
            };
            expect(result).to.deep.equal(expected)
            done();
        });

        it('should correctly serialize an Project with a single Model, 2 Nodes with connector with an edge', (done) => {
            var guids :any = {};
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

            var result : Object = subject.toJSON();
            var expected = {
             "models"     : {},
             "nodes"      : {},
             "edges"      : {},
             "connectors" : {}
            };
            expected.models[guids.model.toString()] = {
                "id" : guids.model.toString(),
                "neighbours" : {
                    "models"     : [],
                    "nodes"      : [guids.node.toString(),guids.node2.toString()],
                    "edges"      : [guids.edge.toString()],
                    "connectors" : []
                },
                "properties" : {
                    "type" : "TEST_MODEL"
                }
            };
            expected.nodes[guids.node.toString()] = {
                "id" : guids.node.toString(),
                "neighbours" : {
                    "models"     : [guids.model.toString()],
                    "nodes"      : [],
                    "edges"      : [],
                    "connectors" : [guids.connector.toString()]
                },
                "properties" : {
                    "type" : "TEST_NODE",
                    "testkey" : "testvalue"
                }
            };
            expected.connectors[guids.connector.toString()] = {
                "id" : guids.connector.toString(),
                "neighbours" : {
                    "models"     : [],
                    "nodes"      : [guids.node.toString()],
                    "edges"      : [guids.edge.toString()],
                    "connectors" : []
                },
                "properties" : {
                    "type" : "TEST_CONNECTOR"
                }
            };
            expected.nodes[guids.node2.toString()] = {
                "id" : guids.node2.toString(),
                "neighbours" : {
                    "models"     : [guids.model.toString()],
                    "nodes"      : [],
                    "edges"      : [],
                    "connectors" : [guids.connector2.toString()]
                },
                "properties" : {
                    "type" : "TEST_NODE"
                }
            };
            expected.connectors[guids.connector2.toString()] = {
                "id" : guids.connector2.toString(),
                "neighbours" : {
                    "models"     : [],
                    "nodes"      : [guids.node2.toString()],
                    "edges"      : [guids.edge.toString()],
                    "connectors" : []
                },
                "properties" : {
                    "type" : "TEST_CONNECTOR"
                }
            };
            expected.edges[guids.edge.toString()] = {
                "id" : guids.edge.toString(),
                "neighbours" : {
                    "models"     : [guids.model.toString()],
                    "nodes"      : [],
                    "edges"      : [],
                    "connectors" : [guids.connector.toString(), guids.connector2.toString()]
                },
                "properties" : {
                    "type" : "TEST_EDGE"
                }
            };
            expect(result).to.deep.equal(expected)
            done();
        });

        it('should correctly serialize a changed Property on a single Model', (done) => {
            var guid = Common.Guid.newGuid();
            var guidstr = guid.toString();
            subject.addModel(guid, "TEST_MODEL");
            var result : Object = subject.toJSON();
            var expected = {
             "models"     : {},
             "nodes"      : {},
             "edges"      : {},
             "connectors" : {}
            };
            expected.models[guidstr] = {
                "id" : guid.toString(),
                "neighbours" : {
                    "models"     : [],
                    "nodes"      : [],
                    "edges"      : [],
                    "connectors" : []
                },
                "properties" : {
                    "type" : "TEST_MODEL"
                }
            };
            expect(result).to.deep.equal(expected);

            subject.setProperty(guid, "testproperty", "testvalue");
            var result : Object = subject.toJSON();
            var expected = {
             "models"     : {},
             "nodes"      : {},
             "edges"      : {},
             "connectors" : {}
            };
            expected.models[guidstr] = {
                "id" : guid.toString(),
                "neighbours" : {
                    "models"     : [],
                    "nodes"      : [],
                    "edges"      : [],
                    "connectors" : []
                },
                "properties" : {
                    "testproperty" : "testvalue",
                    "type" : "TEST_MODEL"
                }
            };
            expect(result).to.deep.equal(expected)
            done();
        });
    });
});
