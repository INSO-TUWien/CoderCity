import { KDTreeNode } from '../kd-treenode';
import { Bounds } from '../bounds';

export class TreeState {
    coveredArea: Bounds;
}

export function RectanglePackingInsert(node: KDTreeNode, element: Element): boolean {
    if (node == null || element === undefined || element === null) {
        return;
    }



    return false;
}
