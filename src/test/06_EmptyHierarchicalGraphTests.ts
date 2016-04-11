/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import * as Common from "cubitt-common"
import {GraphInterface,Project} from "./../cubitt-graph"
import {ExpectationBuilder} from "./helper/ExpectationBuilder"

var expect = chai.expect;
describe('Single Node Hierarchical Graph', () => {
    var subject : GraphInterface;
    var expectationBuilder : ExpectationBuilder;

    var modelGuid : Common.Guid;
    var childModelGuid : Common.Guid;

    var nodeGuid : Common.Guid;

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
        childModelGuid = Common.Guid.newGuid();

        nodeGuid = Common.Guid.newGuid();

        subject.addModel(modelGuid,"TEST_MODEL", {"testprop" : "testval"});
        subject.addNode(nodeGuid,"TEST_NODE", modelGuid);
        subject.addModel(childModelGuid,"TEST_SUBMODEL", {}, nodeGuid);

        expectationBuilder = new ExpectationBuilder();
        expectationBuilder.addModel(modelGuid,"TEST_MODEL", {"testprop" : "testval"})
            .addModel(childModelGuid,"TEST_SUBMODEL")
            .addNode(nodeGuid,"TEST_NODE")
            .addNodeToModel(nodeGuid,modelGuid)
            .addModelToNode(childModelGuid,nodeGuid);
    });

    describe('Serialize', () => {
        it('should correctly serialize a Project with a single Model and a Node', (done) => {
                var result : Object = subject.serialize();
                expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
                done();
        });
    });
    /*
    describe('Insert Connector', () => {
        it('Should correctly create a connector', (done) => {
            var guid = uniqueGUID();
            subject.addConnector(guid,"TEST_CONNECTOR",nodeGuid);

            var result : Object = subject.serialize();
            var expected = {
             "models"     : {
                 [modelGuid.toString()] : {
                     "id" : modelGuid.toString(),
                     "neighbours" : {
                         "models"     : {
                             "child"  : [],
                             "parent" : []
                         },
                         "nodes"      : [nodeGuid.toString()],
                         "edges"      : [],
                         "connectors" : []
                     },
                     "properties" : {
                         "type" : "TEST_MODEL",
                         "testprop" : "testval"
                     }
                 }
             },
             "nodes"      : {
                 [nodeGuid.toString()] : {
                     "id" : nodeGuid.toString(),
                     "neighbours" : {
                         "models"     : {
                             "child"  : [],
                             "parent" : [modelGuid.toString()]
                         },
                         "nodes"      : [],
                         "edges"      : [],
                         "connectors" : [guid.toString()]
                     },
                     "properties" : {
                         "type" : "TEST_NODE"
                     }
                 }
             },
             "edges"      : {},
             "connectors" : {
                 [guid.toString()] : {
                     "id" : guid.toString(),
                     "neighbours" : {
                         "models"     : {
                             "parent" : [],
                             "child"  : []
                         },
                         "nodes"      : [nodeGuid.toString()],
                         "edges"      : [],
                         "connectors" : []
                     },
                     "properties" : {
                         "type" : "TEST_CONNECTOR"
                     }
                 }
             }
            };
            expect(subject.serialize()).to.deep.equal(expected)
            done();
        });
    });

    describe('Delete', () => {
        it('the Node should result in a graph with only the Model', (done) => {
            subject.deleteNode(nodeGuid);
            var expected = {
             "models"     : {
                 [modelGuid.toString()] : {
                     "id" : modelGuid.toString(),
                     "neighbours" : {
                         "models"     : {
                             "child"  : [],
                             "parent" : []
                         },
                         "nodes"      : [],
                         "edges"      : [],
                         "connectors" : []
                     },
                     "properties" : {
                         "type" : "TEST_MODEL",
                         "testprop" : "testval"
                     }
                 }
             },
             "nodes"      : {},
             "edges"      : {},
             "connectors" : {}
            };
            expect(subject.serialize()).to.deep.equal(expected)
            done();
        });
        it('the Model should result in an empty Graph', (done) => {
            subject.deleteModel(modelGuid);
            var expected = {
             "models"     : {},
             "nodes"      : {},
             "edges"      : {},
             "connectors" : {}
            };
            expect(subject.serialize()).to.deep.equal(expected);
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
    */
});
