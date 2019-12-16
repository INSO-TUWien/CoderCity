import { Bounds } from './bounds';
import { Element } from './element';
import { Vector2 } from 'three';

export class KDTreeNode {

  constructor(
    position: THREE.Vector2,
    bounds: Bounds,
    depth: number = 0,
    dimension: number,
    element?: Element
  ) {
    this.position = position;
    this.bounds = bounds;
    this.depth = depth;
    this.dimension = dimension;
    this.element = element;
  }
  // Parent node
  parent?: KDTreeNode;
  bounds: Bounds;

  position: THREE.Vector2;

  // Child nodes
  left?: KDTreeNode;
  right?: KDTreeNode;

  // Axis of split
  axis: number;

  // Coordinate of the split
  splitCoordinate?: number;

  // Contains element in tree
  element?: Element;

  depth: number;
  dimension: number;

  /**
   * Executes the given function on each traversed node in pre order traversal manner.
   * @param node the current node
   * @param fn the function to be executed on node
   */
  static executeWhileTraversingPreOrder(node: KDTreeNode, fn: (node: KDTreeNode) => void) {
    if (node === null || node === undefined) {
      return;
    }

    KDTreeNode.executeWhileTraversingPreOrder(node.left, fn);

    fn(node);

    KDTreeNode.executeWhileTraversingPreOrder(node.right, fn);
  }

  isEmpty(): boolean {
    return !this.element;
  }

  isSplitted(): boolean {
    return this.splitCoordinate >= 0;
  }

  isLeaf(): boolean {
    return (this.left == null && this.right == null);
  }

  hasElement(): boolean {
    return (this.element !== null && this.element !== undefined);
  }

  //coveredArea()

  /**
   * Inserts element to KD Tree node and performs respective splits.
   * @param element the element to be inserted.
   * @returns true if element
   */
  insertElement(element: Element): boolean {
    if (element === undefined || element === null) {
      return;
    }

    // Check depth to determine on which dimension/axis to split
    this.axis = this.depth % this.dimension;

    // Check if current node is of exact matching size and not occupied
    // If so put element into this node
    if (this.bounds.equals(element.bounds) && this.isEmpty()) {
      this.element = element;
      return true;
    }

    if (!this.bounds.fits(element.bounds) || !this.isEmpty()) {
      return false;
    }

    if (this.axis === 0) {
      if (!this.isSplitted()) {
        //If the node is not splitted, then create child nodes

        //Split on x axis
        this.splitCoordinate = element.bounds.x;

        // Create boundaries of new nodes after the split
        let bounds = this.bounds.splitAtAxisX(element.bounds.x);

        // Create left node
        this.left = new KDTreeNode(
          this.position,
          bounds[0],
          this.depth + 1,
          this.dimension
        );

        // Create right node
        this.right = new KDTreeNode(
          this.position.clone().add(new Vector2(element.bounds.x, 0)),
          bounds[1],
          this.depth + 1,
          this.dimension
        );
      }

      // Try to put element in left child node, if not successful try with right one.
      if (this.left.insertElement(element)) {
        return true;
      } else {
        if (this.right.insertElement(element)) {
          return true;
        }
      }
    } else {
      if (!this.isSplitted()) {
        // Split on y axis
        this.splitCoordinate = element.bounds.y;

        // Create boundaries of new nodes after the split
        let bounds = this.bounds.splitAtAxisY(element.bounds.y);

        // Create left node
        this.left = new KDTreeNode(
          this.position,
          bounds[0],
          this.depth + 1,
          this.dimension
        );

        // Create right node
        this.right = new KDTreeNode(
          this.position.clone().add(new Vector2(0, element.bounds.y)),
          bounds[1],
          this.depth + 1,
          this.dimension
        );
      }

      if (this.left.insertElement(element)) {
        return true;
      } else {
        if (this.right.insertElement(element)) {
          return true;
        }
      }
    }

    return false;
  }
}
