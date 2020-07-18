import { CityElement } from './city-element';
import { Bounds } from './bounds';
import { Vector2 } from 'three';
import { CityLayoutElement } from './cl/city-layout-element';
import { CityOptions } from '../util/city-options';

export class DistrictLayout extends CityLayoutElement {
    constructor(private options: CityOptions, public depth: number) {
        super();
    }
}