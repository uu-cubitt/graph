import * as Common from "cubitt-common"
import {ElementType} from "./ElementType"
import {AbstractElement} from "./AbstractElement"
import {Graph} from "./Graph"

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
        var nodeIds = this.getChildNodeNeighbours();

        for (var nodeId of nodeIds) {
            var node = graph.getElement(nodeId);
            node.delete(graph);
        }

        // Remove model from any parent Nodes (if any)
        var parentNodes = this.getParentNodeNeighbours();
        for (var parentNodeId of parentNodes) {
            var parentNode = graph.getElement(parentNodeId);
            parentNode.unlinkChildModelNeighbour(this.id);

        }
        this.remove(graph);
    }

}
