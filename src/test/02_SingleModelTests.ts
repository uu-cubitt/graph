/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import * as Common from "cubitt-common"
import {GraphInterface,Project} from "./../cubitt-graph"
import {ExpectationBuilder} from "./helper/ExpectationBuilder";

var expect = chai.expect;
describe('Single Model Graph', () => {
    var subject : GraphInterface;
    var expectationBuilder : ExpectationBuilder;
    var modelGuid : Common.Guid;
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
        subject.addModel(modelGuid,"TEST_MODEL", {"testprop" : "testval"});

        expectationBuilder = new ExpectationBuilder();
        expectationBuilder.addModel(modelGuid,"TEST_MODEL", {"testprop" : "testval"});
    });

    describe('Serialize', () => {
        it('should correctly serialize a Project with a single Model', (done) => {
                var result : Object = subject.serialize();
                var expected = expectationBuilder.toObject();
                expect(subject.serialize()).to.deep.equal(expected)
                done();
        });
    });

    describe('Insert Node', () => {
        it('Should correctly create a node', (done) => {
            var guid = uniqueGUID();
            subject.addNode(guid,"TEST_NODE",modelGuid,{"testkey" : "testvalue"});

            var result : Object = subject.serialize();
            expectationBuilder.addNode(guid, "TEST_NODE",{"testkey" : "testvalue"})
                       .addNodeToModel(guid, modelGuid);


            expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject())
            done();
        });
    });

    describe('Delete', () => {
        it('the Model should result in an empty Graph', (done) => {
            subject.deleteModel(modelGuid);
            var expected = new ExpectationBuilder().toObject();
            expect(subject.serialize()).to.deep.equal(expected);
            done();
        });
        it('a non-existing Model should not result in an Error', (done) => {
                subject.deleteModel(uniqueGUID());
                done();
        });
        it('a non-existing Node should not result in an Error', (done) => {
                subject.deleteNode(uniqueGUID());
                done();
        });
        it('a non-existing Connector should not result in an Error', (done) => {
                subject.deleteConnector(uniqueGUID());
                done();
        });
        it('a non-existing Edge should not result in an Error', (done) => {
                subject.deleteEdge(uniqueGUID());
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

    describe('hasElement', () => {
        it('Should return true for an existing element', (done) => {
            expect(subject.hasElement(modelGuid)).to.true;
            done();
        })
        it('Should always return false for a non-existing element',(done) => {
            expect(subject.hasElement(uniqueGUID())).to.false;
            done();
        });
    });

    describe('hasModel', () => {
        it('Should return true for an existing Model', (done) => {
            expect(subject.hasModel(modelGuid)).to.true;
            done();
        })
        it('Should always return false for a non-existing Model',(done) => {
            expect(subject.hasModel(uniqueGUID())).to.false;
            done();
        });
    });

    describe('setProperty', () => {
        it('Should set a new property on the Model',(done) => {
            subject.setProperty(modelGuid, "testproperty", "testvalue");
            expectationBuilder.setModelProperty(modelGuid, "testproperty", "testvalue");
            expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject())
            done();
        });

        it('Should update an existing property on the Model',(done) => {
            subject.setProperty(modelGuid, "testprop", "changed");
            expectationBuilder.setModelProperty(modelGuid, "testprop", "changed");
            expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
            done();
        });

        it('Should update the (special) type property on the Model',(done) => {
            subject.setProperty(modelGuid, "type", "TEST_MODEL_CHANGED");
            expectationBuilder.setModelProperty(modelGuid,"type", "TEST_MODEL_CHANGED");
            expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
            done();
        });
    });

    describe('deleteProperty', () => {
        it('Should delete a property on an existing model', (done) => {
            subject.deleteProperty(modelGuid,"testprop");
            expectationBuilder.deleteModelProperty(modelGuid,"testprop");
            expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
            done();
        });
        it('Should throw an error when deleting type property', (done) => {
            expect(function() {subject.deleteProperty(modelGuid,"type")}).to.throw(Error);
            done();
        });
        it('Should delete a non-existing property on an existing model', (done) => {
            subject.deleteProperty(modelGuid,"notexisting");

            expect(subject.serialize()).to.deep.equal(expectationBuilder.toObject());
            done();
        });
    });


});
