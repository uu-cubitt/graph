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
        it('should correctly serialize a Project with a single Model, a Node and a Submodel', (done) => {
                var result : Object = subject.serialize();
                expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
                done();
        });
    });

    describe('addNode', () => {
        it('Should correctly add a subnode', (done) => {
            var guid = uniqueGUID();
            subject.addNode(guid,"TEST_SUBNODE", childModelGuid);

            var result : Object = subject.serialize();
            expectationBuilder.addNode(guid,"TEST_SUBNODE")
                .addNodeToModel(guid,childModelGuid);
            expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject())
            done();
        });
    });

    describe('Delete', () => {
        it('the submodel should result in a Model with a Node', (done) => {
            subject.deleteModel(childModelGuid);

            expectationBuilder = new ExpectationBuilder();
            expectationBuilder.addModel(modelGuid,"TEST_MODEL", {"testprop" : "testval"})
                .addNode(nodeGuid,"TEST_NODE")
                .addNodeToModel(nodeGuid,modelGuid);
            expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
            done();
        });

        it('the Node should result in a Model', (done) => {
            subject.deleteNode(nodeGuid);

            expectationBuilder = new ExpectationBuilder();
            expectationBuilder.addModel(modelGuid,"TEST_MODEL", {"testprop" : "testval"})
            expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
            done();
        });

        it('the Model should result in an empty Graph', (done) => {
            subject.deleteModel(modelGuid);
            var expected = new ExpectationBuilder().toObject();
            expect(subject.serialize()).to.deep.equal(expected);
            done();
        });
    });
    /*
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
