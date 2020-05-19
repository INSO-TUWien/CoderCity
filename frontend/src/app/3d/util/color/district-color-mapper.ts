import { District } from '../../entities/District';

export interface DistrictColorMapper {
    mapValue(district: District): THREE.Color;
}
