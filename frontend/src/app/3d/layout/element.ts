import { Bounds } from './bounds';
export class Element {
    bounds: Bounds;
    gridPosition: THREE.Vector2;

    constructor(bounds: Bounds) {
        this.bounds = bounds;
    }
}
