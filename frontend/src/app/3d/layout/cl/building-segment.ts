import { CityLayoutElement } from './city-layout-element';

export class BuildingLayoutSegment extends CityLayoutElement{
    constructor(
        public color: THREE.Color,
        public buildingLevelStart: number, 
        public buildingLevelEnd: number,
    ) {
        super();
    }
}