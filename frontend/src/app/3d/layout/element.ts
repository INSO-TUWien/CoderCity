import { Bounds } from './bounds';
export class Element {
    gridPosition: THREE.Vector2;

    constructor(public bounds: Bounds) {
    }
}
