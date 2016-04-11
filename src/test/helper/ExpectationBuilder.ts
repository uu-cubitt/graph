import * as Common from "cubitt-common"

export class ExpectationBuilder {
    private graph = {
         "models"     : {},
         "nodes"      : {},
         "edges"      : {},
         "connectors" : {}
    };
    /**
     * Adds a Model to the graph
     * @param guid GUID of the Model
     * @param type type of the model
     * @param properties Optional dictionary of properties
     */
    public addModel(guid : Common.Guid, type : string, properties ?: Common.Dictionary<any>) : ExpectationBuilder {
        properties = this.createProperties(type, properties);
        this.graph.models[guid.toString()] = {
            "id" : guid.toString(),
            "neighbours" : {
                "models"     : [],
                "nodes"      : [],
                "edges"      : [],
                "connectors" : []
            },
            "properties" : properties
        };
        return this;
    }

    public addNode(guid : Common.Guid, type : string, properties ?: Common.Dictionary<any>) : ExpectationBuilder {
        properties = this.createProperties(type, properties);
        this.graph.nodes[guid.toString()] = {
            "id" : guid.toString(),
            "neighbours" : {
                "models"     : [],
                "nodes"      : [],
                "edges"      : [],
                "connectors" : []
            },
            "properties" : properties
        };
        return this;
    }

    public addConnector(guid : Common.Guid, type : string, properties ?: Common.Dictionary<any>) : ExpectationBuilder {
        properties = this.createProperties(type, properties);
        this.graph.connectors[guid.toString()] = {
            "id" : guid.toString(),
            "neighbours" : {
                "models"     : [],
                "nodes"      : [],
                "edges"      : [],
                "connectors" : []
            },
            "properties" : properties
        };
        return this;
    }

    public addEdge(guid : Common.Guid, type : string, properties ?: Common.Dictionary<any>) : ExpectationBuilder {
        properties = this.createProperties(type, properties);
        this.graph.edges[guid.toString()] = {
            "id" : guid.toString(),
            "neighbours" : {
                "models"     : [],
                "nodes"      : [],
                "edges"      : [],
                "connectors" : []
            },
            "properties" : properties
        };
        return this;
    }

    public setModelProperty(guid: Common.Guid, key : string, value : any) : ExpectationBuilder{
        this.graph.models[guid.toString()]['properties'][key] = value;
        return this;
    }
    public deleteModelProperty(guid : Common.Guid, key : string): ExpectationBuilder {
        delete this.graph.models[guid.toString()]['properties'][key];
        return this;
    }

    public addNodeToModel(nodeGuid : Common.Guid, modelGuid: Common.Guid) : ExpectationBuilder {
        this.graph.models[modelGuid.toString()]['neighbours']['nodes'].push({"id" : nodeGuid.toString() , "role" : "child"});
        this.graph.nodes[nodeGuid.toString()]['neighbours']['models'].push({"id" : modelGuid.toString() , "role" : "parent"});
        return this;
    }

    public addConnectorToNode(connectorGuid: Common.Guid, nodeGuid: Common.Guid) : ExpectationBuilder {
        this.graph.connectors[connectorGuid.toString()]['neighbours']['nodes'].push({"id" : nodeGuid.toString() , "role" : "parent"});
        this.graph.nodes[nodeGuid.toString()]['neighbours']['connectors'].push({"id" : connectorGuid.toString() , "role" : "child"});
        return this;
    }

    public addEdgeToConnector(edgeGuid: Common.Guid, connectorGuid: Common.Guid) : ExpectationBuilder {
        this.graph.connectors[connectorGuid.toString()]['neighbours']['edges'].push({"id" : edgeGuid.toString() , "role" : "child"});
        this.graph.edges[edgeGuid.toString()]['neighbours']['connectors'].push({"id" : connectorGuid.toString() , "role" : "parent"});
        return this;
    }

    public addEdgeToModel(edgeGuid: Common.Guid, modelGuid: Common.Guid) : ExpectationBuilder {
        this.graph.models[modelGuid.toString()]['neighbours']['edges'].push({"id" : edgeGuid.toString() , "role" : "child"});
        this.graph.edges[edgeGuid.toString()]['neighbours']['models'].push({"id" : modelGuid.toString() , "role" : "parent"});
        return this;
    }

    public addModelToNode(modelGuid : Common.Guid, nodeGuid: Common.Guid) : ExpectationBuilder {
        this.graph.models[modelGuid.toString()]['neighbours']['nodes'].push({"id" : nodeGuid.toString() , "role" : "parent"});
        this.graph.nodes[nodeGuid.toString()]['neighbours']['models'].push({"id" : modelGuid.toString() , "role" : "child"});
        return this;
    }

    public toObject() : Object {
        return this.graph;
    }

    private createProperties(type : string, properties ?: Common.Dictionary<any>) : Common.Dictionary<any> {
        if (properties == null || properties == undefined) {
            properties = {};
        }
        properties["type"] = type;
        return properties;
    }
}
