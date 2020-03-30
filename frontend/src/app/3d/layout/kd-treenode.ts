import { Bounds } from './bounds';
import { CityElement } from './city-element';
import { Vector2 } from 'three';

export class KDTreeNode {

  constructor(
    position: THREE.Vector2,
    bounds: Bounds,
    depth: number = 0,
    element?: CityElement
  ) {
    this.position = position;
    this.bounds = bounds;
    this.depth = depth;
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
  element?: CityElement;

  depth: number;
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

  getEmptyLeafNodes(result: KDTreeNode[], node: KDTreeNode): KDTreeNode[] {
    if (node == null) {
      return;
    }

    if (node.isLeaf() && node.isEmpty()) {
      result.push(node);
    } else {
      node.getEmptyLeafNodes(result, node.left);
      node.getEmptyLeafNodes(result, node.right);
    }
    return result;
  }

  /**
   * Inserts element to KD Tree node and performs respective splits.
   * @param element the element to be inserted.
   * @returns true if element
   */
  insertElement(node: KDTreeNode, element: CityElement): boolean {
    if (node == null || element === undefined || element === null) {
      return;
    }

    if (element.bounds.x <= 0 || element.bounds.y <= 0) {
      throw new Error('Invalid values: Element bounds is smaller or equal 0.');
    }

    // Check depth to determine on which axis to split
    node.axis = node.depth % 2; // Split on x / y axis alterningly

    // Check if current node is of exact matching size and not occupied
    // If so, put element into this node
    if (node.bounds.equals(element.bounds) && this.isEmpty()) {
      this.element = element;
      return true;
    }

    if (!node.bounds.fits(element.bounds) || !this.isEmpty()) {
      return false;
    }

    if (node.axis === 0) {
      if (!node.isSplitted()) {
        // If the node is not splitted, then create child nodes

        // Split on x axis
        node.splitCoordinate = element.bounds.x;

        // Create boundaries of new nodes after the split
        let bounds = node.bounds.splitAtAxisX(element.bounds.x);

        // Create left node
        node.left = new KDTreeNode(
          this.position,
          bounds[0],
          this.depth + 1
        );

        // Create right node
        node.right = new KDTreeNode(
          node.position.clone().add(new Vector2(element.bounds.x, 0)),
          bounds[1],
          node.depth + 1
        );
      }

      // Try to put element in left child node, if not successful try with right one.
      if (node.left.insertElement(node.left, element)) {
        return true;
      } else {
        if (this.right.insertElement(node.right, element)) {
          return true;
        }
      }
    } else {
      if (!node.isSplitted()) {
        // Split on y axis
        node.splitCoordinate = element.bounds.y;

        // Create boundaries of new nodes after the split
        let bounds = node.bounds.splitAtAxisY(element.bounds.y);

        // Create left node
        node.left = new KDTreeNode(
          node.position,
          bounds[0],
          node.depth + 1
        );

        // Create right node
        node.right = new KDTreeNode(
          node.position.clone().add(new Vector2(0, element.bounds.y)),
          bounds[1],
          node.depth + 1
        );
      }

      if (node.left.insertElement(node.left, element)) {
        return true;
      } else {
        if (node.right.insertElement(node.right, element)) {
          return true;
        }
      }
    }

    return false;
  }
}
