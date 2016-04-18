import {ElementType} from "./ElementType";
import {AbstractElement} from "./AbstractElement";
import {Graph} from "./Graph";

/**
 * Element representing a true higher-level Node in the graph, see documentation for more information
 */
export class NodeElement extends AbstractElement {

	/**
	 * @inheritdoc
	 */
	public getType(): ElementType {
		return ElementType.Node;
	}

	/**
	 * @inheritdoc
	 */
	public delete(graph: Graph): void {
		/* Delete of this node, should remove all
		 * connectors connected to this element.
		 *
		 */
		let connectors = this.getChildConnectorNeighbours();
		let models = this.getParentModelNeighbours();
		for (let conId of connectors) {
			let connector = graph.getElement(conId);
			connector.delete(graph);
		}
		for (let modelId of models) {
			let model = graph.getElement(modelId);
			model.unlinkChildNodeNeighbour(this.id); // Remove the reference to this class
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
