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

function showGUIDTypes(subject: GraphInterface) {
    var elems = subject.serialize();
    console.log("Models:")
    for (var id in elems["models"]) {
        console.log(" - " + id);
    }
    console.log("Nodes:")
    for (var id in elems["nodes"]) {
        console.log(" - " + id);
    }
    console.log("Connectors:")
    for (var id in elems["connectors"]) {
        console.log(" - " + id);
    }
    console.log("Edges:")
    for (var id in elems["edges"]) {
        console.log(" - " + id);
    }

}

var expect = chai.expect;
describe('Deserialize tests', () => {
    var subject : GraphInterface;
    var guids : any = {};


    describe('Simple graph', () => {
        it('deserialize().serialize() should equal serialize()', (done) => {
            subject = new Project();

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

            var json = subject.serialize();
            var result = subject.deserialize(json);
            expect(result.serialize()).to.deep.equal(json)
            done();
        });



    });

});
