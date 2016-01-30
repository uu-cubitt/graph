import { ElementType } from "./ElementType";
import { AbstractElement } from "./AbstractElement";
import { Graph } from "./Graph";
export declare class NodeElement extends AbstractElement {
    getType(): ElementType;
    delete(graph: Graph): void;
}
