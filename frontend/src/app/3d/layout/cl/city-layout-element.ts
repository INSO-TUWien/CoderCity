import { Bounds } from '../bounds';
import { CityElement } from '../city-element';

export class CityLayoutElement {
    bounds: Bounds;
    // Determines position of the city element on the city grid.
    // Note the difference between city grid coordinate system and threejs coordinate system.
    gridPosition: THREE.Vector2;

    subElements: CityLayoutElement[] = [];

    addSubElement(element: CityLayoutElement) {
        this.subElements.push(element);
    }
}