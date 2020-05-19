import { BuildingColorMapper } from './color/building-color-mapper';
import { DistrictColorMapper } from './color/district-color-mapper';

export interface CityOptions {
    buildingColorMapper: BuildingColorMapper;
    districtColorMapper: DistrictColorMapper;
}
