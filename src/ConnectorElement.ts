import * as Common from "cubitt-common"
import {ElementType} from "./ElementType"
import {AbstractElement} from "./AbstractElement"
import {Graph} from "./Graph"

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
        var edgeIds = this.getEdgeNeighbours();
        for (var edgeId of edgeIds) {
            var edge = graph.getElement(edgeId);
            edge.delete(graph);
        }
        var NodeIds = this.getNodeNeighbours();
        for (var nodeId of NodeIds) {
            var node = graph.getElement(nodeId);
            node.unlinkConnectorNeighbour(this.Id);
        }
        this.remove(graph);
    }
}
