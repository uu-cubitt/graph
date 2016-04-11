import * as Common from "cubitt-common"
import {ElementType} from "./ElementType"
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
        var edges = this.getParentEdgeNeighbours();
        var connectors = this.getChildConnectorNeighbours();
        var models = this.getParentModelNeighbours();
        for (var conId of connectors) {
            var connector = graph.getElement(conId);
            connector.delete(graph);
        }
        for (var modelId of models) {
            var model = graph.getElement(modelId);
            model.unlinkChildNodeNeighbour(this.id); //Remove the reference to this class
        }
        this.remove(graph);
    }
}
