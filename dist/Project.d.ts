import * as Common from "cubitt-common";
import { GraphInterface } from "./GraphInterface";
import { Graph } from "./Graph";
export declare class Project implements GraphInterface {
    protected graph: Graph;
    constructor();
    addNode(id: Common.Guid, type: string, modelId: Common.Guid, properties?: Common.Dictionary<any>): void;
    addEdge(id: Common.Guid, type: string, modelId: Common.Guid, startConnectorId: Common.Guid, endConnectorId: Common.Guid, properties: Common.Dictionary<any>): void;
    addConnector(id: Common.Guid, type: string, nodeId: Common.Guid, properties?: Common.Dictionary<any>): void;
    addModel(id: Common.Guid, type: string, properties?: Common.Dictionary<any>): void;
    setProperty(id: Common.Guid, name: string, value: any): void;
    deleteNode(id: Common.Guid): void;
    deleteEdge(id: Common.Guid): void;
    deleteConnector(id: Common.Guid): void;
    deleteModel(id: Common.Guid): void;
    deleteProperty(id: Common.Guid, key: string): void;
    serialize(): {
        "models": {};
        "nodes": {};
        "edges": {};
        "connectors": {};
    };
    deserialize(jsonObject: Object): GraphInterface;
    hasElement(id: Common.Guid): boolean;
    hasModel(id: Common.Guid): boolean;
    hasNode(id: Common.Guid): boolean;
    hasConnector(id: Common.Guid): boolean;
    hasEdge(id: Common.Guid): boolean;
}
