import * as Common from "cubitt-common";

/**
 * Interface describing basic graph operations
 */
export interface GraphInterface {

    /**
     * Adds a Node to the Graph
     *
     * @param id Identifier of the Node to add, this GUID should not already exist in the system
     * @param type String representing the type of the node (i.e. "FAM_NODE" or "UML_CLASS")
     * @param modelId Identifier of the model that contains this Node
     * @param properties Dictionary of properties of the Node
     */
    addNode(id: Common.Guid, type: string, modelId: Common.Guid, properties ?: Common.Dictionary<any>);

    /**
     * Adds an Edge to the Graph
     *
     * @param id Identifier of the Edge to add, this GUID should not already exist in the system
     * @param type string String representing the type of the Edge (i.e. "FAM_DATA_FLOW" or "UML_INHERITS")
     * @param modelId Identifier of the model that contains this Edge
     * @param StartConnectorId Identifier of the connector from which this Edge will originate
     * @param endConnectorId Identifier of the connector to which this Edge will go
     * @param properties Dictionary of properties of the Edge
     */
    addEdge(id: Common.Guid, type: string, modelId: Common.Guid, startConnectorId: Common.Guid, endConnectorId: Common.Guid, properties ?: Common.Dictionary<any>);

    /**
     * Adds a Connector to the Graph
     *
     * @param id Identifier of the Connector to add, this GUID should not already exist in the system
     * @param type String representing the type of the connector (i.e. "NETWORK_LAN" or "FAM_DATA_CONNECTOR")
     * @param nodeId Identifier of the Node that contains this Connector
     * @param properties Dictionary of properties of the Connector
     */
    addConnector(id: Common.Guid, type: string, nodeId: Common.Guid, properties ?: Common.Dictionary<any>);

    /**
     * Adds a Model to the Graph
     *
     * @param id Identifier of the Model to add, this GUID should not already exist in the system
     * @param type String representing the type of the connector (i.e. "MODEL_FAM" or "MODEL_UML")
     * @param properties Dictionary of properties of the Model
     * @param parentId Identifier of the parent of this subgraph. Leave empty to create a model under the root
     *
     */
    addModel(id: Common.Guid, type: string, properties ?: Common.Dictionary<any>, parentId ?: Common.Guid);

    /**
     * Sets a property on an Element
     *
     * @param nodeId Identifier of the Element on which the property should be set
     * @param name Name of the property that will be set
     * @param value The value to set the property with
     */
    setProperty(nodeId: Common.Guid, name: string, value: any);

    /**
     * Deletes a Node from the Graph
     *
     * @param id Identifier of the Node to delete
     */
    deleteNode(id: Common.Guid);

    /**
     * Deletes an Edge from the Graph
     *
     * @param id Identifier of the Edge to delete
     */
    deleteEdge(id: Common.Guid);

    /**
     * Deletes a Connector from the Graph
     *
     * @param id Identifier of the Connector to delete
     */
    deleteConnector(id: Common.Guid);

    /**
     * Deletes a Model from the Graph
     *
     * @param id Identifier of the Model to delete
     */
    deleteModel(id: Common.Guid);

    /**
     * Deletes a Property from the Graph
     *
     * @param id Identifier of the Element that contains the property
     * @param name of the property that should be deleted
     */
    deleteProperty(id: Common.Guid, name: string);

    /**
     * Transforms this Graph to a plain JSON graph
     *
     */
    serialize() : Object;

    /**
     * Creates a new GraphInterface from a JSON Graph
     *
     * For the expected format, please read the documentation
     * The expected format is the same as the format returned by serialize()
     *
     * @param jsonObject JSON Object that should be converted to GraphInterface
     */
     deserialize(jsonObject : Object) : GraphInterface;

    /**
     * Returns whether an Element with the ID exists
     *
     * @param id Identifier to check
     */
    hasElement(id: Common.Guid): boolean;

    /**
     * Returns whether a Model with the ID exists
     *
     * @param id Identifier to check
     */
    hasModel(id: Common.Guid): boolean;

    /**
     * Returns whether a Node with the ID exists
     *
     * @param id Identifier to check
     */
    hasNode(id: Common.Guid): boolean;

    /**
     * Returns whether a Connector with the ID exists
     *
     * @param id Identifier to check
     */
    hasConnector(id: Common.Guid): boolean;

    /**
     * Returns whether an Edge with the ID exists
     *
     * @param id Identifier to check
     */
    hasEdge(id: Common.Guid): boolean;

}
