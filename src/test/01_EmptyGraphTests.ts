/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import chai = require('chai');
import * as Common from "cubitt-common"
import {GraphInterface,Project} from "./../cubitt-graph"
import {ExpectationBuilder} from "./helper/ExpectationBuilder";
import {uniqueGUID} from "./helper/UniqueGuid";

var expect = chai.expect;
describe('Empty Graph', () => {
    var subject : GraphInterface;
    var expectationBuilder : ExpectationBuilder;
    var guids = [];

    beforeEach(function () {
        subject = new Project();
        expectationBuilder = new ExpectationBuilder();
    });

    describe('Serialize', () => {
        it('should correctly serialize an empty Project', (done) => {
                var result : Object = subject.serialize();
                var expected = expectationBuilder.toObject();
                expect(result).to.deep.equal(expected);
                done();
        });
    });

    describe('Insert Model', () => {
        it('Should correctly create a new top-level model', (done) => {
            var guid = uniqueGUID();
            var guidstr = guid.toString();
            subject.addModel(guid, "TEST_MODEL");

            var expected = expectationBuilder.addModel(guid,"TEST_MODEL").toObject();
            expect(subject.serialize()).to.deep.equal(expected)
            done();
        });
    });

    describe('Delete', () => {
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
        it('Should always return false',(done) => {
            expect(subject.hasElement(uniqueGUID())).to.false;
            done();
        });
    });

    describe('hasModel', () => {
        it('Should always return false',(done) => {
            expect(subject.hasModel(uniqueGUID())).to.false;
            done();
        });
    });

    describe('hasNode', () => {
        it('Should always return false',(done) => {
            expect(subject.hasNode(uniqueGUID())).to.false;
            done();
        });
    });

    describe('hasConnector', () => {
        it('Should always return false',(done) => {
            expect(subject.hasConnector(uniqueGUID())).to.false;
            done();
        });
    });

    describe('hasEdge', () => {
        it('Should always return false',(done) => {
            expect(subject.hasEdge(uniqueGUID())).to.false;
            done();
        });
    });


});
