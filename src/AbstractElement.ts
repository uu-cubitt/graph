import * as Common from "cubitt-common"
import {ElementType} from "./ElementType"
import {Graph} from "./Graph"

export abstract class AbstractElement {
    protected id: Common.Guid;
	protected type: ElementType;
	protected properties: Common.Dictionary<any>;
    protected parentNodeNeighbours: Common.Dictionary<Common.Guid>;
    protected childNodeNeighbours: Common.Dictionary<Common.Guid>;
    protected parentEdgeNeighbours: Common.Dictionary<Common.Guid>;
    protected childEdgeNeighbours: Common.Dictionary<Common.Guid>;
    protected parentConnectorNeighbours: Common.Dictionary<Common.Guid>;
    protected childConnectorNeighbours: Common.Dictionary<Common.Guid>;
    protected parentModelNeighbours: Common.Dictionary<Common.Guid>;
    protected childModelNeighbours: Common.Dictionary<Common.Guid>;

    /**
     * @param id GUID of the Element that is created
     * @param properties of the Element
     */
    constructor(id: Common.Guid, properties: Common.Dictionary<any> = {}) {
        this.id = id;
        this.properties = properties;
        this.parentNodeNeighbours = {};
        this.childNodeNeighbours = {};
        this.parentEdgeNeighbours = {};
        this.childEdgeNeighbours = {};
        this.parentConnectorNeighbours = {};
        this.childConnectorNeighbours = {};
        this.parentModelNeighbours = {};
        this.childModelNeighbours = {};
    }

    /**
     * Returns identifier of this element
     */
	get Id(): Common.Guid {
		return this.id;
	}

    /**
     * Returns type of this element
     */
    public abstract getType(): ElementType;

    /**
     * Delete this element
     *
     * @param graph Graph containing this element
     */
    public abstract delete(graph: Graph): void;

    /**
     * Internal function that removes THIS element ONLY.
     * WARNING: This function does not perform a cascading delete (i.e remove orphan edges)
     * Use delete() instead
     *
     * @param graph Graph containing this element
     */
    protected remove(graph: Graph): void {
        graph.deleteElement(this.id);
    }

    /**
     * Adds a neighbour of type Node as *parent* to this Element
     *
     * @param id Guid of the element that should be added
     */
    public addParentNodeNeighbour(id : Common.Guid) {
        this.parentNodeNeighbours[id.toString()] = id;
    }

    /**
     * Adds a neighbour of type Node as *child* to this Element
     *
     * @param id Guid of the element that should be added
     */
    public addChildNodeNeighbour(id : Common.Guid) {
        this.childNodeNeighbours[id.toString()] = id;
    }

    /**
     * Adds a Neighbour of type Edge as *parent* to this Element
     *
     * @param id Guid of the element that should be added
     */
    public addParentEdgeNeighbour(id : Common.Guid) {
        this.parentEdgeNeighbours[id.toString()] = id;
    }

    /**
     * Adds a Neighbour of type Edge as *child* to this Element
     *
     * @param id Guid of the element that should be added
     */
    public addChildEdgeNeighbour(id : Common.Guid) {
        this.childEdgeNeighbours[id.toString()] = id;
    }

    /**
     * Adds a neighbour of type Connector as *parent* to this Element
     *
     * @param id Guid of the element that should be added
     */
    public addParentConnectorNeighbour(id : Common.Guid) {
        this.parentConnectorNeighbours[id.toString()] = id;
    }

    /**
     * Adds a neighbour of type Connector as *child* to this Element
     *
     * @param id Guid of the element that should be added
     */
    public addChildConnectorNeighbour(id : Common.Guid) {
        this.childConnectorNeighbours[id.toString()] = id;
    }

    /**
     * Adds a neighbour of type Model as *parent* to this Element
     *
     * @param id Guid of the element that should be added
     */
    public addParentModelNeighbour(id: Common.Guid) {
        this.parentModelNeighbours[id.toString()] = id;
    }

    /**
     * Adds a neighbour of type Model as *child* to this Element
     *
     * @param id Guid of the element that should be added
     */
    public addChildModelNeighbour(id: Common.Guid) {
        this.childModelNeighbours[id.toString()] = id;
    }

    /**
     * Returns all neighbours, optionally filtered by ElementType
     *
     * @param type The elementtype to filter by, by default all elements are returned
     */
    protected internalGetNeighbours(type ?: ElementType) : Common.Guid[] {
        if (type == ElementType.Node) {
            var parents = this.toArray(this.parentNodeNeighbours);
            var children = this.toArray(this.childNodeNeighbours);
            return parents.concat(children);
        } else if (type == ElementType.Edge) {
            var parents = this.toArray(this.parentEdgeNeighbours);
            var children = this.toArray(this.childEdgeNeighbours);
            return parents.concat(children);
        } else if (type == ElementType.Connector) {
            var parents = this.toArray(this.parentConnectorNeighbours);
            var children = this.toArray(this.childConnectorNeighbours);
            return parents.concat(children);
        } else if (type == ElementType.Model) {
             var parents = this.toArray(this.parentModelNeighbours);
             var children = this.toArray(this.childModelNeighbours);
             return parents.concat(children);
        } else {
            var types : Array<Common.Dictionary<Common.Guid>> = [];
            types.push(this.parentNodeNeighbours);
            types.push(this.childNodeNeighbours);
            types.push(this.parentEdgeNeighbours);
            types.push(this.childEdgeNeighbours);
            types.push(this.parentConnectorNeighbours);
            types.push(this.childConnectorNeighbours);
            types.push(this.parentModelNeighbours);
            types.push(this.childModelNeighbours);
            var result = [];
            for (var elems of types) {
                for (var key in elems) {
                    result.push(elems[key]);
                }
            }
            return result;
        }
    }

    /**
     * Returns all neighbours
     */
    public getNeighbours() : Common.Guid[] {
        return this.internalGetNeighbours();
    }

    /**
     * Returns all Parent neighbours of type Node
     */
    public getParentNodeNeighbours() : Common.Guid[] {
        return this.toArray(this.parentNodeNeighbours);
    }

    /**
     * Returns all Child neighbours of type Node
     */
    public getChildNodeNeighbours() : Common.Guid[] {
        return this.toArray(this.childNodeNeighbours);
    }

    /**
     * Returns all Parent neighbours of type Edge
     */
    public getParentEdgeNeighbours() : Common.Guid[] {
        return this.toArray(this.parentEdgeNeighbours);
    }

    /**
     * Returns all Child neighbours of type Edge
     */
    public getChildEdgeNeighbours() : Common.Guid[] {
        return this.toArray(this.childEdgeNeighbours);
    }

    /**
     * Returns all Parent neighbours of type Connector
     */
    public getParentConnectorNeighbours() : Common.Guid[] {
        return this.toArray(this.parentConnectorNeighbours);
    }

    /**
     * Returns all Child neighbours of type Connector
     */
    public getChildConnectorNeighbours() : Common.Guid[] {
        return this.toArray(this.childConnectorNeighbours);
    }

    /**
     * Returns all *Parent* neighbours of type Model
     */
    public getParentModelNeighbours() : Common.Guid[] {
        return this.toArray(this.parentModelNeighbours);
    }

    /**
     * Returns all *Children* neighbous of type Model
     */
     public getChildModelNeighbours() : Common.Guid[] {
         return this.toArray(this.childModelNeighbours);
     }

    /**
     * Sets a property on this Element
     *
     * @param name Name of the property to set
     * @param value desired value
     */
    public setProperty(name: string, value: any) {
        this.properties[name] = value;
    }

    /**
     * Delete a property on this Element
     *
     * @param id Identifier of the Node
     * @param name of the property
     */
     public deleteProperty(id: Common.Guid, name: string)
     {
         if (name == "type") {
             throw new Error("Deleting property 'type' is not allowed");
         }
         delete this.properties[name];
     }

    /**
     * Returns a value of a property of this Element
     *
     * @param name Name of the property to retrieve
     */
    public getProperty(name: string) : any {
        return this.properties[name];
    }

    /**
     * Returns all properties of this Element
     */
    public getProperties() : Common.Dictionary<any> {
        return this.properties;
    }

    /**
     * Unlink a link to a neighbouring parent Node
     *
     * @param id Identifier of the parent Node that should be unlinked
     */
     public unlinkParentNodeNeighbour(id: Common.Guid) {
         delete this.parentNodeNeighbours[id.toString()];
     }

     /**
      * Unlink a link to a neighbouring child Node
      *
      * @param id Identifier of the child Node that should be unlinked
      */
      public unlinkChildNodeNeighbour(id: Common.Guid) {
          delete this.childNodeNeighbours[id.toString()];
      }

     /**
      * Unlink a link to a neighbouring Parent Edge
      *
      * @param id Identifier of the Parent Edge that should be unlinked
      */
      public unlinkParentEdgeNeighbour(id: Common.Guid) {
          delete this.parentEdgeNeighbours[id.toString()];
      }

      /**
       * Unlink a link to a neighbouring Child Edge
       *
       * @param id Identifier of the Child Edge that should be unlinked
       */
       public unlinkChildEdgeNeighbour(id: Common.Guid) {
           delete this.childEdgeNeighbours[id.toString()];
       }

      /**
       * Unlink a link to a neighbouring Parent Connector
       *
       * @param id Identifier of the Connector that should be unlinked
       */
       public unlinkParentConnectorNeighbour(id: Common.Guid) {
           delete this.parentConnectorNeighbours[id.toString()];
       }

       /**
        * Unlink a link to a neighbouring Child Connector
        *
        * @param id Identifier of the Connector that should be unlinked
        */
        public unlinkChildConnectorNeighbour(id: Common.Guid) {
            delete this.childConnectorNeighbours[id.toString()];
        }

       /**
        * Unlink a link to a neighbouring parent Model
        *
        * @param id Identifier of the parent Model that should be unlinked
        */
        public unlinkParentModelNeighbour(id: Common.Guid) {
            delete this.parentModelNeighbours[id.toString()];
        }

        /**
         * Unlink a link to a neighbouring child Model
         *
         * @param id Identifier of the child Model that should be unlinked
         */
         public unlinkChildModelNeighbour(id: Common.Guid) {
             delete this.childModelNeighbours[id.toString()];
         }

        /**
         * Converts a Dictionary to an Array
         *
         * @param dictionary The dictionary to convert
         */
        private toArray(dictionary : Common.Dictionary<Common.Guid>) : Common.Guid[] {
            var result : Common.Guid[] = [];
            for (var key in dictionary) {
                var elem = dictionary[key]
                result.push(elem);
            }
            return result;
        }

}
