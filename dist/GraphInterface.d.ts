import * as Common from "cubitt-common";
export interface GraphInterface {
    addNode(id: Common.Guid, type: string, modelId: Common.Guid, properties?: Common.Dictionary<any>): any;
    addEdge(id: Common.Guid, type: string, modelId: Common.Guid, startConnectorId: Common.Guid, endConnectorId: Common.Guid, properties?: Common.Dictionary<any>): any;
    addConnector(id: Common.Guid, type: string, nodeId: Common.Guid, properties?: Common.Dictionary<any>): any;
    addModel(id: Common.Guid, type: string, properties?: Common.Dictionary<any>): any;
    setProperty(nodeId: Common.Guid, name: string, value: any): any;
    deleteNode(id: Common.Guid): any;
    deleteEdge(id: Common.Guid): any;
    deleteConnector(id: Common.Guid): any;
    deleteModel(id: Common.Guid): any;
    deleteProperty(id: Common.Guid, name: string): any;
    toJSON(): Object;
    fromJSON(jsonObject: Object): GraphInterface;
    hasElement(id: Common.Guid): boolean;
    hasModel(id: Common.Guid): boolean;
    hasNode(id: Common.Guid): boolean;
    hasConnector(id: Common.Guid): boolean;
    hasEdge(id: Common.Guid): boolean;
}
