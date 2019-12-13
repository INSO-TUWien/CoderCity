import { Bounds } from './bounds';

export class TreeNode {

    parent?: TreeNode;
    children: TreeNode[] = [];
    
    element?: Element;
    bounds: Bounds;

    constructor() {
    }

    addNode(node: TreeNode) {
        if (!!node) {
            this.children.push(node);
        }
    }

    isEmpty(): boolean {
        return (!this.element);
    }
}