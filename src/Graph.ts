import * as Common from "cubitt-common"
import {AbstractElement} from "./AbstractElement"
import {NodeElement} from "./NodeElement"
import {EdgeElement} from "./EdgeElement"
import {ModelElement} from "./ModelElement"
import {ConnectorElement} from "./ConnectorElement"
import {GraphInterface} from "./GraphInterface"
import {ElementType} from "./ElementType"

/**
 * Graph containing nodes, connectors, edges and models
 *
 * NOTICE: this class is used internally in the Project class, always use the Project class
 */
export class Graph implements GraphInterface {
    private Elements : Common.Dictionary<AbstractElement>;

    constructor() {
        this.Elements = {};
    }

    /**
     * Returns an element given an GUID
     *
     * @param id GUID representing an element identifier
     */
    public getElement(id: Common.Guid) : AbstractElement {
        var elem = this.Elements[id.toString()];
        if (elem == undefined) {
            throw new Error("Element with GUID " + id.toString() + " not found");
        }
        return elem;
    }

    /**
     * @inheritdoc
     */
    public hasElement(id: Common.Guid) : boolean {
        return this.Elements[id.toString()] !== undefined;
    }

    /**
     * @inheritdoc
     */
    public hasModel(id: Common.Guid) : boolean {
        var elem = this.Elements[id.toString()];
        return elem !== undefined && elem.getType() == ElementType.Model;
    }

    /**
     * @inheritdoc
     */
    public hasNode(id: Common.Guid) : boolean {
        var elem = this.Elements[id.toString()];
        return elem !== undefined && elem.getType() == ElementType.Node;
    }

    /**
     * @inheritdoc
     */
    public hasConnector(id: Common.Guid) : boolean {
        var elem = this.Elements[id.toString()];
        return elem !== undefined && elem.getType() == ElementType.Connector;
    }

    /**
     * @inheritdoc
     */
    public hasEdge(id: Common.Guid) : boolean {
        var elem = this.Elements[id.toString()];
        return elem !== undefined && elem.getType() == ElementType.Edge;
    }

    /**
     * Removes an element from the graph, WARNING: does not perform a cascading delete (i.e. no removal of orphan edges)
     *
     * @param id Identifier of the element to remove
     * @param ofType Only delete the element if it is of the matching Type, if undefined, this check will be skipped
     */
    public deleteElement(id: Common.Guid, ofType ?: ElementType): void {
        if (ofType == undefined) {
            delete this.Elements[id.toString()];
        } else {
            var elem = this.Elements[id.toString()];
            if (elem != undefined) {
                // It's fine if the elem did not exist (the endresult is the same)
                if (elem.getType() != ofType) {
                    throw new Error ("Attempted to delete a " + elem.getType() + " with delete" + ofType.toString());
                }
                elem.delete(this);
            }
        }
    }

    /**
     * @inheritdoc
     */
    public addNode(id: Common.Guid, type: string, modelId: Common.Guid, properties: Common.Dictionary<any> = {})
    {
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        var model = this.Elements[modelId.toString()];
        if (model == undefined) {
            throw new Error("No model with GUID " + modelId + " could be found");
        }
        if (model.getType() != ElementType.Model) {
            throw new Error("GUID " + modelId.toString() + " does not belong to a model");
        }
        properties["type"] = type;
        var node = new NodeElement(id, properties);
        node.addModelNeighbour(modelId);
        model.addNodeNeighbour(id);

        this.Elements[node.Id.toString()] = node;
    }

    /**
     * @inheritdoc
     */
    public addEdge(id: Common.Guid, type: string, modelId: Common.Guid, startConnectorId: Common.Guid, endConnectorId: Common.Guid, properties: Common.Dictionary<any> = {})
    {
        // Validate GUID
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }

        // Validate modelID
        var model = this.Elements[modelId.toString()];
        if (model == undefined) {
            throw new Error("No model with GUID " + modelId + " could be found");
        }
        if (model.getType() != ElementType.Model) {
            throw new Error("Element with GUID " + modelId.toString() + " is not a Model");
        }

        // Validate startConnector
        var startConnector = this.Elements[startConnectorId.toString()];
        if (startConnector == undefined) {
            throw new Error("No startConnector with GUID " + startConnectorId + " could be found");
        }
        if (startConnector.getType() != ElementType.Connector) {
            throw new Error("Invalid startConnectorId, "  + startConnectorId + " does not belong to a connector");
        }

        // Validate endConnectorId
        var endConnector = this.Elements[endConnectorId.toString()];
        if (endConnector == undefined) {
            throw new Error("No endConnector with GUID " + endConnectorId + " could be found");
        }
        if (endConnector.getType() != ElementType.Connector) {
            throw new Error("Invalid endConnectorId, "  + endConnectorId + " does not belong to a connector");
        }
        properties["type"] = type;
        var edge = new EdgeElement(id, properties);
        // By convention, element 0 is the start item, 1 is the end
        edge.addStartConnector(startConnectorId);
        edge.addEndConnector(endConnectorId);

        startConnector.addEdgeNeighbour(id);
        endConnector.addEdgeNeighbour(id);

        model.addEdgeNeighbour(id);
        edge.addModelNeighbour(modelId);

        this.Elements[id.toString()] = edge;
    }

    /**
     * @inheritdoc
     */
    public addConnector(id: Common.Guid, type: string, nodeId: Common.Guid, properties: Common.Dictionary<any>)
    {
        // Validate GUID
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }

        // Validate nodeId exists
        var node = this.Elements[nodeId.toString()];
        if (node == undefined) {
            throw new Error("No node with GUID " + nodeId + " could be found");
        }
        if (node.getType() != ElementType.Node) {
            throw new Error("Invalid nodeId, "  + nodeId + " does not belong to a Node")
        }

        properties["type"] = type;
        var connector = new ConnectorElement(id, properties);
        node.addConnectorNeighbour(id);
        connector.addNodeNeighbour(nodeId);

        this.Elements[id.toString()] = connector;
    }

    /**
     * @inheritdoc
     */
    public addModel(id: Common.Guid, type: string, properties: Common.Dictionary<any>)
    {
        // Validate GUID
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        properties["type"] = type;
        var model = new ModelElement(id, properties);
        this.Elements[id.toString()] = model;

    }

    /**
     * @inheritdoc
     */
    public setProperty(id: Common.Guid, name: string, value: any)
    {
        if (this.hasElement(id) == false) {
            throw new Error("An Element with GUID " + id.toString() + " could not be found");
        }
        this.Elements[id.toString()].setProperty(name, value);
    }

    /**
     * @inheritdoc
     */
    public deleteNode(id: Common.Guid)
    {
        this.deleteElement(id, ElementType.Node);
    }

    /**
     * @inheritdoc
     */
    public deleteEdge(id: Common.Guid)
    {
        this.deleteElement(id, ElementType.Edge);
    }

    /**
     * @inheritdoc
     */
    public deleteConnector(id: Common.Guid)
    {
        this.deleteElement(id, ElementType.Connector);
    }

    /**
     * @inheritdoc
     */
    public deleteModel(id: Common.Guid)
    {
        this.deleteElement(id, ElementType.Model);
    }

    /**
     * @inheritdoc
     */
    public deleteProperty(id: Common.Guid, name: string)
    {
        var elem = this.Elements[id.toString()];
        if (elem == undefined) {
            throw new Error("Element not found");
        }
        elem.deleteProperty(id, name)
    }

    /**
     * @inheritdoc
     */
    public fromJSON(jsonObject : Object) : GraphInterface {
        var graph = new Graph();
        var modelElements: Common.Dictionary<ModelElement> = {};
        var models = jsonObject['models'];
        for (var modelKey in models) {
            var model = models[modelKey];
            // Only add the model elements themselves, any neighbours will be added
            // by the other elements
            var id = Common.Guid.parse(model["id"]);
            var properties = this.propertiesFromJSON(model["properties"]);
            graph.addModel(id,properties["type"],properties);
        }
        var nodes = jsonObject['nodes'];
        for (var nodeKey in nodes) {
            var node = nodes[nodeKey];
            var id = Common.Guid.parse(node["id"]);
            var properties = this.propertiesFromJSON(node["properties"]);
            var modelId = Common.Guid.parse(node["neighbours"]["models"][0]);
            graph.addNode(id,properties["type"],modelId,properties)
        }
        var connectors = jsonObject['connectors'];
        for (var connectorKey in connectors) {
            var connector = connectors[connectorKey];
            var id = Common.Guid.parse(connector["id"]);
            var properties = this.propertiesFromJSON(connector["properties"]);
            var nodeId = Common.Guid.parse(connector["neighbours"]["nodes"]["0"]);
            graph.addConnector(id,properties['type'],nodeId, properties);
        }
        var edges = jsonObject['edges'];
        for (var edgeKey in edges) {
            var edge = edges[edgeKey];
            var id = Common.Guid.parse(edge["id"]);
            var properties = this.propertiesFromJSON(edge["properties"]);
            var modelId = Common.Guid.parse(edge["neighbours"]["models"][0]);
            var startConnector = Common.Guid.parse(edge["neighbours"]["connectors"][0]);
            var endConnector = Common.Guid.parse(edge["neighbours"]["connectors"][1]);
            graph.addEdge(id,properties["type"],modelId,startConnector, endConnector, properties);
        }
        return graph;
    }
    /**
     * Creates a Property dictionary from JSON
     *
     * @param jsonProperties JSON object that contains the properties
     */
    private propertiesFromJSON(jsonProperties: Object): Common.Dictionary<any> {
        var properties : Common.Dictionary<any> = {};
        for (var propertyKey in jsonProperties) {
            properties[propertyKey] = jsonProperties[propertyKey];
        }
        return properties;
    }

    /**
     * @inheritdoc
     */
    public toJSON() {
        var graph = {
         "models"     : {},
         "nodes"      : {},
         "edges"      : {},
         "connectors" : {}
        };

        var elements = this.Elements;
        for (var key in elements) {
            var elem  = elements[key];

            var obj =
                {
                    "id" : elem.Id.toString(),
                    "properties" : elem.getProperties(),
                    "neighbours" : {
                        "models" : elem.getModelNeighbours().map(function(val) { return val.toString(); }),
                        "nodes"  : elem.getNodeNeighbours().map(function(val) { return val.toString(); }),
                        "edges"  : elem.getEdgeNeighbours().map(function(val) { return val.toString(); }),
                        "connectors" : elem.getConnectorNeighbours().map(function(val) { return val.toString(); })
                    }
                };
            if (elem.getType() == ElementType.Node) {
                graph.nodes[elem.Id.toString()] = obj;
            } else if (elem.getType() == ElementType.Edge) {
                graph.edges[elem.Id.toString()] = obj;
            } else if (elem.getType() == ElementType.Connector) {
                graph.connectors[elem.Id.toString()] = obj;
            } else {
                graph.models[elem.Id.toString()] = obj;
            }
        }
        return graph;
    }
}
