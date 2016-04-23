import * as Common from "cubitt-common";
import {GraphInterface} from "./GraphInterface";
import {Graph} from "./Graph";

export class Project implements GraphInterface {

	protected graph: Graph;

	constructor() {
		this.graph = new Graph();
	}

	/**
	 * @inheritdoc
	 */
	public addNode(id: Common.Guid, type: string, modelId: Common.Guid, properties: Common.Dictionary<any> = {}): void {
		this.graph.addNode(id, type, modelId, properties);
	}

	/**
	 * @inheritdoc
	 */
	public addEdge(id: Common.Guid, type: string, modelId: Common.Guid, startConnectorId: Common.Guid, endConnectorId: Common.Guid, properties: Common.Dictionary<any>): void {
		this.graph.addEdge(id, type, modelId, startConnectorId, endConnectorId, properties);
	}

	/**
	 * @inheritdoc
	 */
	public addConnector(id: Common.Guid, type: string, nodeId: Common.Guid, properties: Common.Dictionary<any> = {}): void {
		this.graph.addConnector(id, type, nodeId, properties);
	}

	/**
	 * @inheritdoc
	 */
	public addModel(id: Common.Guid, type: string, properties: Common.Dictionary<any> = {}, parentId ?: Common.Guid): void {
		this.graph.addModel(id, type, properties, parentId);
	}

	/**
	 * @inheritdoc
	 */
	public setProperty(id: Common.Guid, name: string, value: any): void {
		this.graph.setProperty(id, name, value);
	}

	/**
	 * @inheritdoc
	 */
	public deleteNode(id: Common.Guid): void {
		this.graph.deleteNode(id);
	}

	/**
	 * @inheritdoc
	 */
	public deleteEdge(id: Common.Guid): void {
		this.graph.deleteEdge(id);
	}

	/**
	 * @inheritdoc
	 */
	public deleteConnector(id: Common.Guid): void {
		this.graph.deleteConnector(id);
	}

	/**
	 * @inheritdoc
	 */
	public deleteModel(id: Common.Guid): void {
		this.graph.deleteModel(id);
	}

	/**
	 * @inheritdoc
	 */
	public deleteProperty(id: Common.Guid, key: string): void {
		this.graph.deleteProperty(id, key);
	}

	/**
	 * @inheritdoc
	 */
	public serialize(): Object {
		return this.graph.serialize();
	}

	/**
	 * @inheritdoc
	 */
	public deserialize(jsonObject: Object): GraphInterface {
		return this.graph.deserialize(jsonObject);
	}

	/**
	 * @inheritdoc
	 */
	public hasElement(id: Common.Guid): boolean {
		return this.graph.hasElement(id);
	}

	/**
	 * @inheritdoc
	 */
	public hasModel(id: Common.Guid): boolean {
		return this.graph.hasModel(id);
	}

	/**
	 * @inheritdoc
	 */
	public hasNode(id: Common.Guid): boolean {
		return this.graph.hasNode(id);
	}

	/**
	 * @inheritdoc
	 */
	public hasConnector(id: Common.Guid): boolean {
		return this.graph.hasConnector(id);
	}

	/**
	 * @inheritdoc
	 */
	public hasEdge(id: Common.Guid): boolean {
		return this.graph.hasEdge(id);
	}
}
