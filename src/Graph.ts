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
        if (properties == null || properties == undefined) {
            properties = {};
        }
        properties["type"] = type;
        var node = new NodeElement(id, properties);
        node.addParentModelNeighbour(modelId);
        model.addChildNodeNeighbour(id);

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
        if (properties == null || properties == undefined) {
            properties = {};
        }
        properties["type"] = type;
        var edge = new EdgeElement(id, properties);

        edge.addStartConnector(startConnectorId);
        edge.addEndConnector(endConnectorId);

        startConnector.addChildEdgeNeighbour(id);
        endConnector.addChildEdgeNeighbour(id);

        model.addChildEdgeNeighbour(id);
        edge.addParentModelNeighbour(modelId);

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
        if (properties == null || properties == undefined) {
            properties = {};
        }
        properties["type"] = type;
        var connector = new ConnectorElement(id, properties);
        node.addChildConnectorNeighbour(id);
        connector.addParentNodeNeighbour(nodeId);

        this.Elements[id.toString()] = connector;
    }

    /**
     * @inheritdoc
     */
    public addModel(id: Common.Guid, type: string, properties: Common.Dictionary<any>, parentId ?: Common.Guid)
    {
        // Validate GUID
        if (this.hasElement(id)) {
            throw new Error("An Element with GUID " + id.toString() + " already exists");
        }
        // If parentId is set validate it
        if (parentId != null && parentId != undefined) {

            // Validate if there is an node or edge with the provided GUID
            if ((this.hasNode(parentId) || this.hasEdge(parentId)) == false) {
                throw new Error("No Node or Edge with GUID " + parentId.toString() +" could be found");
            }
        }
        if (properties == null || properties == undefined) {
            properties = {};
        }
        properties["type"] = type;
        var model = new ModelElement(id, properties);
        // Attach it to parent if available
        if (parentId != null && parentId != undefined) {
            var parent = this.getElement(parentId);
            parent.addChildModelNeighbour(id);
            if (this.hasEdge(parentId)) {
                model.addParentEdgeNeighbour(parentId);
            }
            if (this.hasNode(parentId)) {
                model.addParentNodeNeighbour(parentId);
            }

        }
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
    public deserialize(jsonObject : Object) : GraphInterface {
        var graph = new Graph();
        var modelElements: Common.Dictionary<ModelElement> = {};
        var models = jsonObject['models'];
        // Models
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
            var modelNeighbours = node["neighbours"]["models"];
            for (var modelKey in modelNeighbours) {
                var model = modelNeighbours[modelKey];
                if (model.role == undefined || model.role == "parent") {
                    modelId = Common.Guid.parse(model.id);
                    break;
                }
            }

            graph.addNode(id,properties["type"], modelId, properties)
        }
        var connectors = jsonObject['connectors'];
        for (var connectorKey in connectors) {
            var connector = connectors[connectorKey];
            var id = Common.Guid.parse(connector["id"]);
            var properties = this.propertiesFromJSON(connector["properties"]);
            var nodeNeighbours = connector["neighbours"]["nodes"];
            var nodeId : Common.Guid;
            for (var nodeKey in nodeNeighbours) {
                var node = nodeNeighbours[nodeKey];
                if (node.role == undefined || node.role == "parent") {
                    nodeId = Common.Guid.parse(node.id);
                    break;
                }
            }
            graph.addConnector(id,properties['type'],nodeId, properties);
        }
        var edges = jsonObject['edges'];
        for (var edgeKey in edges) {
            var edge = edges[edgeKey];
            var id = Common.Guid.parse(edge["id"]);
            var properties = this.propertiesFromJSON(edge["properties"]);
            var modelNeighbours = edge["neighbours"]["models"];
            var modelId : Common.Guid;
            for (var modelKey in modelNeighbours) {
                var model = modelNeighbours[modelKey];
                if (model.role == undefined || model.role == "parent") {
                    modelId = Common.Guid.parse(model.id);
                    break;
                }
            }
            var startConnector = Common.Guid.parse(edge["neighbours"]["connectors"][0]['id']);
            var endConnector = Common.Guid.parse(edge["neighbours"]["connectors"][1]['id']);
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

    private serializeNeighbours(parents: Common.Guid[], children: Common.Guid[]) {
        return parents.map(
                function(val) {
                    return { "id" :val.toString(), "role" : "parent" };
                }
            ).concat(
                children.map(
                    function(val) {
                        return { "id" :val.toString(), "role" : "child" };
                    }
                )
            );
    }

    /**
     * @inheritdoc
     */
    public serialize() {
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
                        "models" : this.serializeNeighbours(elem.getParentModelNeighbours(), elem.getChildModelNeighbours()),
                        "nodes"  : this.serializeNeighbours(elem.getParentNodeNeighbours(), elem.getChildNodeNeighbours()),
                        "edges"  : this.serializeNeighbours(elem.getParentEdgeNeighbours(), elem.getChildEdgeNeighbours()),
                        "connectors" : this.serializeNeighbours(elem.getParentConnectorNeighbours(), elem.getChildConnectorNeighbours())
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
