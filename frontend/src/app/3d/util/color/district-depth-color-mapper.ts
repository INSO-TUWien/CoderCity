import { DistrictColorMapper } from './district-color-mapper';
import { District } from '../../entities/District';
import * as THREE from 'three';
import * as chroma from 'chroma-js';

export class DistrictDepthColorMapper implements DistrictColorMapper {
    private scale: chroma.Scale;

    constructor() {
        this.scale = chroma
            .scale(['#7F7F7F', '#252525'])
            .domain([0, 8])
            .mode('lch');
    }

    mapValue(district: District): THREE.Color {
        const color = this.scale(district.depth).hex();
        return new THREE.Color(color);
    }
}
