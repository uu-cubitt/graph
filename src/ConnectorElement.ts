import {ElementType} from "./ElementType";
import {AbstractElement} from "./AbstractElement";
import {Graph} from "./Graph";

/**
 * Class representing connectors of nodes
 */
export class ConnectorElement extends AbstractElement {

	/**
	 * @inheritdoc
	 */
	public getType(): ElementType {
		return ElementType.Connector;
	}

	/**
	 * @inheritdoc
	 */
	public delete(graph: Graph) {
		let edgeIds = this.getChildEdgeNeighbours();
		for (let edgeId of edgeIds) {
			let edge = graph.getElement(edgeId);
			edge.delete(graph);
		}
		let nodeIds = this.getParentNodeNeighbours();
		for (let nodeId of nodeIds) {
			let node = graph.getElement(nodeId);
			node.unlinkChildConnectorNeighbour(this.Id);
		}
		this.remove(graph);
	}
}
