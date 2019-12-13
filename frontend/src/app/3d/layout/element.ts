import { Bounds } from './bounds';

export class Element {
    bounds: Bounds;
    
    constructor(bounds: Bounds) {
        this.bounds = bounds;
    }
}