import * as Common from "cubitt-common";
import {ElementType} from "./ElementType";
import {AbstractElement} from "./AbstractElement";
import {Graph} from "./Graph";

export class EdgeElement extends AbstractElement {

	protected start: Common.Guid;
	protected end: Common.Guid;

	/**
	 * @inheritdoc
	 */
	public getType(): ElementType {
		return ElementType.Edge;
	}

	/**
	 * Override that ensures that the StartConnector is element 0, Endconnector is element 1
	 * Any (potential) other connectors are at indices > 1
	 */
	public getConnectorNeighbours(): Common.Guid[] {
		let connectors: Common.Guid[] = [];
		connectors.push(this.start);
		connectors.push(this.end);
		return connectors;
	}

	/**
	 * Sets the StartConnector
	 *
	 * @param ConnectorID ID of the connector
	 */
	public addStartConnector(connectorId: Common.Guid) {
		this.start = connectorId;
		this.addParentConnectorNeighbour(connectorId);
	}

	/**
	 * Sets the EndConnector
	 *
	 * @param ConnectorID ID of the connector
	 */
	public addEndConnector(connectorId: Common.Guid) {
		this.end = connectorId;
		this.addParentConnectorNeighbour(connectorId);
	}

	/**
	 * @inheritdoc
	 */
	public delete(graph: Graph) {
		let connectorIds = this.getConnectorNeighbours();
		for (let connectorId of connectorIds) {
			let connector = graph.getElement(connectorId);
			connector.unlinkChildEdgeNeighbour(this.id);
		}
		// Unlink from model
		let modelIds = this.getParentModelNeighbours();
		for (let modelId of modelIds) {
			let model = graph.getElement(modelId);
			model.unlinkChildEdgeNeighbour(this.id);
		}

		// Remove child models (if any)
		let childModels = this.getChildModelNeighbours();
		for (let childModelId of childModels) {
			let childModel = graph.getElement(childModelId);
			childModel.delete(graph);
		}
		this.remove(graph);
	}
}
