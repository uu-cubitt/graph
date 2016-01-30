import * as Common from "cubitt-common";
import { AbstractElement } from "./AbstractElement";
import { GraphInterface } from "./GraphInterface";
import { ElementType } from "./ElementType";
export declare class Graph implements GraphInterface {
    private Elements;
    constructor();
    getElement(id: Common.Guid): AbstractElement;
    hasElement(id: Common.Guid): boolean;
    hasModel(id: Common.Guid): boolean;
    hasNode(id: Common.Guid): boolean;
    hasConnector(id: Common.Guid): boolean;
    hasEdge(id: Common.Guid): boolean;
    deleteElement(id: Common.Guid, ofType?: ElementType): void;
    addNode(id: Common.Guid, type: string, modelId: Common.Guid, properties?: Common.Dictionary<any>): void;
    addEdge(id: Common.Guid, type: string, modelId: Common.Guid, startConnectorId: Common.Guid, endConnectorId: Common.Guid, properties?: Common.Dictionary<any>): void;
    addConnector(id: Common.Guid, type: string, nodeId: Common.Guid, properties: Common.Dictionary<any>): void;
    addModel(id: Common.Guid, type: string, properties: Common.Dictionary<any>): void;
    setProperty(id: Common.Guid, name: string, value: any): void;
    deleteNode(id: Common.Guid): void;
    deleteEdge(id: Common.Guid): void;
    deleteConnector(id: Common.Guid): void;
    deleteModel(id: Common.Guid): void;
    deleteProperty(id: Common.Guid, name: string): void;
    deserialize(jsonObject: Object): GraphInterface;
    private propertiesFromJSON(jsonProperties);
    serialize(): {
        "models": {};
        "nodes": {};
        "edges": {};
        "connectors": {};
    };
}
