import {ElementType} from "./ElementType";
import {AbstractElement} from "./AbstractElement";
import {Graph} from "./Graph";

/**
 * Element representing a Model
 */
export class ModelElement extends AbstractElement {

	/**
	 * @inheritdoc
	 */
	public getType(): ElementType {
		return ElementType.Model;
	}

	/**
	 * @inheritdoc
	 */
	public delete(graph: Graph) {
		/*
		 * Then remove all nodes, which will remove their connectors
		 * which will remove the edges
		 * (connectors are not linked to the model directly)
		 */
		let nodeIds = this.getChildNodeNeighbours();

		for (let nodeId of nodeIds) {
			let node = graph.getElement(nodeId);
			node.delete(graph);
		}

		// Remove model from any parent Nodes (if any)
		let parentNodes = this.getParentNodeNeighbours();
		for (let parentNodeId of parentNodes) {
			let parentNode = graph.getElement(parentNodeId);
			parentNode.unlinkChildModelNeighbour(this.id);
		}

		// Remove model from any parent Edges (if any)
		let parentEdges = this.getParentEdgeNeighbours();
		for (let parentEdgeId of parentEdges) {
			let parentEdge = graph.getElement(parentEdgeId);
			parentEdge.unlinkChildModelNeighbour(this.id);

		}
		this.remove(graph);
	}

}
