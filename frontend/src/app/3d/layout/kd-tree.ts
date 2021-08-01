import { Bounds } from './bounds';
import { Element } from './element';
import { KDTreeNode } from './kd-treenode';

export class KDTree {
    position: THREE.Vector2;
    bounds: Bounds;
    rootNode: KDTreeNode;

    constructor(
        position: THREE.Vector2,
        bounds: Bounds
    ) {
        this.rootNode = new KDTreeNode(position, bounds, 0, null);
    }

    getEmptyLeafNodes(): KDTreeNode[] {
        return this.rootNode.getEmptyLeafNodes([], this.rootNode);
    }

    addElement(element: Element): boolean {
        return this.rootNode.insertElement(this.rootNode, element);
    }

    executeWhileTraversingPreOrder(fn: (node: KDTreeNode) => void) {
        KDTreeNode.executeWhileTraversingPreOrder(this.rootNode, fn);
    }
}
