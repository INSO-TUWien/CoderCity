import { Bounds } from './bounds';
import { KDTreeNode } from './kd-treenode';
import { Element } from './element';

export class KDTree {

    static DIMENSION = 2;

    position: THREE.Vector2;
    bounds: Bounds;
    rootNode: KDTreeNode;

    constructor(
        position: THREE.Vector2,
        bounds: Bounds
    ) {
        this.rootNode = new KDTreeNode(position, bounds, 0, KDTree.DIMENSION, null);
    }

    addElement(element: Element): boolean {
        return this.rootNode.insertElement(element);
    }

    executeWhileTraversingPreOrder(fn: (node: KDTreeNode) => void) {
        KDTreeNode.executeWhileTraversingPreOrder(this.rootNode, fn);
    }
}
