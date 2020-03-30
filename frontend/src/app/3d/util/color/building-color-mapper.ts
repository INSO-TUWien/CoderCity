import { BlameHunk } from 'src/app/model/blamehunk.model';

export interface BuildingColorMapper {
    mapValue(hunk: BlameHunk): THREE.Color;
}