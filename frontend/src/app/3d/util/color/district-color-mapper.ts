import { District } from '../../entities/district';

export interface DistrictColorMapper {
    mapValue(district: District): THREE.Color;
}
