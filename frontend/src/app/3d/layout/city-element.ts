import { Bounds } from './bounds';

export interface CityElement {
    bounds: Bounds;
    // Determines position of the city element on the city grid.
    // Note the difference between city grid coordinate system and threejs coordinate system.
    gridPosition: THREE.Vector2;
}