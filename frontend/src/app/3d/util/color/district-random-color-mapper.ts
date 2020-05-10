import { DistrictColorMapper } from './district-color-mapper';
import { District } from '../../entities/District';
import * as THREE from 'three';
import { getRandomDistrictColor } from 'src/app/util/color-scheme';

export class DistrictRandomColorMapper implements DistrictColorMapper {
    mapValue(district: District): THREE.Color {
        return new THREE.Color(getRandomDistrictColor());
    }
}
