import * as Common from "cubitt-common";
import { ElementType } from "./ElementType";
import { AbstractElement } from "./AbstractElement";
import { Graph } from "./Graph";
export declare class EdgeElement extends AbstractElement {
    protected start: Common.Guid;
    protected end: Common.Guid;
    getType(): ElementType;
    getStartConnector(): Common.Guid;
    getEndConnector(): Common.Guid;
    getConnectorNeighbours(): Common.Guid[];
    addStartConnector(connectorId: Common.Guid): void;
    addEndConnector(connectorId: Common.Guid): void;
    delete(graph: Graph): void;
}
