import * as Common from "cubitt-common"
import {ElementType} from "./ElementType"
import {AbstractElement} from "./AbstractElement"
import {Graph} from "./Graph"

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
     * Returns the start ConnectorID
     */
    public getStartConnector() : Common.Guid {
        return this.start;
    }

    /**
     * Returns the end ConnectorID
     */
    public getEndConnector() : Common.Guid {
        return this.end;
    }

    /**
     * Override that ensures that the StartConnector is element 0, Endconnector is element 1
     * Any (potential) other connectors are at indices > 1
     */
     public getConnectorNeighbours() : Common.Guid[] {
         var edges = [];
         edges.push(this.start);
         edges.push(this.end);
         var allEdges = this.internalGetNeighbours(ElementType.Edge).filter(function(elem) {
             return elem != this.start && elem != this.end;
         });
         edges = edges.concat(allEdges);
         return edges;

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
    public delete(graph : Graph) {
        var connectorIds = this.getConnectorNeighbours();
        for (var connectorId of connectorIds) {
            var connector = graph.getElement(connectorId);
            connector.unlinkChildEdgeNeighbour(this.id);
        }
        // Unlink from model
        var modelIds = this.getParentModelNeighbours();
        for (var modelId of modelIds) {
            var model = graph.getElement(modelId);
            model.unlinkChildEdgeNeighbour(this.id);
        }

        // Remove child models (if any)
        var childModels = this.getChildModelNeighbours();
        for (var childModelId of childModels) {
            var childModel = graph.getElement(childModelId);
            childModel.delete(graph);
        }
        this.remove(graph);
    }
}
