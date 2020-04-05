import { BuildingColorMapper } from './building-color-mapper';
import { BlameHunk } from 'src/app/model/blamehunk.model';
import { getRandomBuildingColor } from 'src/app/util/color-scheme';
import * as THREE from 'three';

export class BuildingRandomColorMapper implements BuildingColorMapper {
    mapValue(hunk: BlameHunk): THREE.Color {
        return new THREE.Color(getRandomBuildingColor());
    }
}
