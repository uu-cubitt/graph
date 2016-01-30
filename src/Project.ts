import * as Common from "cubitt-common"
import {GraphInterface} from "./GraphInterface"
import {NodeElement} from "./NodeElement"
import {Graph} from "./Graph"

export class Project implements GraphInterface {

    protected graph: Graph;

    constructor() {
        this.graph = new Graph();
    }

    /**
     * @inheritdoc
     */
    public addNode(id: Common.Guid, type: string, modelId: Common.Guid, properties: Common.Dictionary<any> = {})
    {
        this.graph.addNode(id, type, modelId, properties);
    }

    /**
     * @inheritdoc
     */
    public addEdge(id: Common.Guid, type: string, modelId: Common.Guid, startConnectorId: Common.Guid, endConnectorId: Common.Guid, properties: Common.Dictionary<any>)
    {
        this.graph.addEdge(id, type, modelId, startConnectorId, endConnectorId, properties);
    }

    /**
     * @inheritdoc
     */
    addConnector(id: Common.Guid, type: string, nodeId: Common.Guid, properties: Common.Dictionary<any> = {})
    {
        this.graph.addConnector(id, type, nodeId, properties);
    }

    /**
     * @inheritdoc
     */
    addModel(id: Common.Guid, type: string, properties: Common.Dictionary<any> = {})
    {
        this.graph.addModel(id, type, properties);
    }

    /**
     * @inheritdoc
     */
    setProperty(id: Common.Guid, name: string, value: any)
    {
        this.graph.setProperty(id, name, value);
    }

    /**
     * @inheritdoc
     */
    deleteNode(id: Common.Guid)
    {
        this.graph.deleteNode(id);
    }

    /**
     * @inheritdoc
     */
    deleteEdge(id: Common.Guid)
    {
        this.graph.deleteEdge(id);
    }

    /**
     * @inheritdoc
     */
    deleteConnector(id: Common.Guid)
    {
        this.graph.deleteConnector(id);
    }

    /**
     * @inheritdoc
     */
    deleteModel(id: Common.Guid)
    {
        this.graph.deleteModel(id);
    }

    /**
     * @inheritdoc
     */
    deleteProperty(id: Common.Guid, key: string)
    {
        this.graph.deleteProperty(id, key);
    }

    /**
     * @inheritdoc
     */
    toJSON() {
        return this.graph.toJSON();
    }

    /**
     * @inheritdoc
     */
    fromJSON(jsonObject: Object) {
        return this.graph.fromJSON(jsonObject);
    }

    /**
     * @inheritdoc
     */
    hasElement(id: Common.Guid) {
        return this.graph.hasElement(id);
    }

    /**
     * @inheritdoc
     */
    hasModel(id: Common.Guid) {
        return this.graph.hasModel(id);
    }

    /**
     * @inheritdoc
     */
    hasNode(id: Common.Guid) {
        return this.graph.hasNode(id);
    }

    /**
     * @inheritdoc
     */
    hasConnector(id: Common.Guid) {
        return this.graph.hasConnector(id);
    }

    /**
     * @inheritdoc
     */
    hasEdge(id: Common.Guid) {
        return this.graph.hasEdge(id);
    }
}
