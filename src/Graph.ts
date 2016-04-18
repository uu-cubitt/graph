import * as Common from "cubitt-common"
import * as Collections from 'typescript-collections';
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
        var models = jsonObject['models'];
        var queue : Collections.Queue<Object> = new Collections.Queue<Object>();
        var inQueue : Common.Dictionary<Boolean> = {};
        // Find root models
        for (var modelKey in models) {
            var model = models[modelKey];

            if (Object.keys(model.neighbours.nodes.parent).length == 0 && Object.keys(model.neighbours.edges.parent).length == 0) {
                queue.enqueue({"type" : "model", "element" : model.id.toString()});
                inQueue[model.id.toString()] = true;
            }
        }
        while(queue.isEmpty() == false)
        {
            var obj = queue.dequeue();
            var type = obj['type'];
            var elemId = obj['element'];
            var elem = jsonObject[type + 's'][elemId.toString()];
            var properties = this.propertiesFromJSON(elem['properties']);
            switch(type) {
                case "model":
                    if (elem['neighbours']['nodes']['parent'].length > 0) {
                        graph.addModel(Common.Guid.parse(elem.id), properties["type"], properties, Common.Guid.parse(elem['neighbours']['nodes']['parent'][0]));
                    } else if(elem['neighbours']['edges']['parent'].length > 0) {
                        graph.addModel(Common.Guid.parse(elem.id), properties["type"], properties, Common.Guid.parse(elem['neighbours']['edges']['parent'][0]));
                    } else {
                        graph.addModel(Common.Guid.parse(elem.id), properties["type"], properties);
                    }
                    break;
                case "node":
                    graph.addNode(Common.Guid.parse(elem.id), properties["type"], Common.Guid.parse(elem['neighbours']['models']['parent'][0]), properties);
                    // add Connectors
                    var connectors = elem['neighbours']['connectors']['child'];
                    for (var connectorKey of connectors) {
                       var connector = jsonObject['connectors'][connectorKey];
                       var id = Common.Guid.parse(connector['id']);
                       var properties = this.propertiesFromJSON(connector["properties"]);
                       graph.addConnector(id,properties['type'],Common.Guid.parse(elem.id), properties);
                       inQueue[id.toString()] = true;
                   }
                    break;
                case "edge":
                    graph.addEdge(
                        Common.Guid.parse(elem.id),
                        properties["type"],
                        Common.Guid.parse(elem['neighbours']['models']['parent'][0]),
                        Common.Guid.parse(elem['neighbours']['connectors']['parent'][0]),
                        Common.Guid.parse(elem['neighbours']['connectors']['parent'][1]),
                        properties
                    );
                    break;
                default:
                    throw new Error("Invalid element type");
            }
            // Enqueue child elements, we directly add the connectors when processing the node
            this.enqueueChildElement("model", elem['neighbours']['models']['child'], queue, inQueue);
            this.enqueueChildElement("node", elem['neighbours']['nodes']['child'], queue, inQueue);
            this.enqueueChildElement("edge", elem['neighbours']['edges']['child'], queue, inQueue);

        }
        return graph;
    }

    /**
     * Iterate over the child elements to add them
     *
     * @param type Type of the child elements
     * @param children the Children to iterate over
     * @param queue The queue to add elements to
     * @param inQueue register which elements are processed
     */
    private enqueueChildElement(type : string, children, queue : Collections.Queue<Object> , inQueue : Common.Dictionary<Boolean>) {
        for (var childElem of children) {
            if (inQueue[childElem] != true) {
                queue.enqueue({"type" : type, "element" : childElem});
                inQueue[childElem] = true;
            }
        }
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
                        "models" : {
                            "parent" : elem.getParentModelNeighbours().map(g => g.toString()),
                            "child"  : elem.getChildModelNeighbours().map(g => g.toString())
                        },
                        "nodes"  : {
                            "parent" : elem.getParentNodeNeighbours().map(g => g.toString()),
                            "child"  : elem.getChildNodeNeighbours().map(g => g.toString())
                        },
                        "edges"  : {
                            "parent" : elem.getParentEdgeNeighbours().map(g => g.toString()),
                            "child"  : elem.getChildEdgeNeighbours().map(g => g.toString())
                        },
                        "connectors" : {
                            "parent" : elem.getParentConnectorNeighbours().map(g => g.toString()),
                            "child"  : elem.getChildConnectorNeighbours().map(g => g.toString())
                        }
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
