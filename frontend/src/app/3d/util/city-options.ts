import { BuildingColorMapper } from './color/building-color-mapper';
import { DistrictColorMapper } from './color/district-color-mapper';
import { ValueMapper } from './mapper/value-mapper';

export interface CityOptions {
    buildingColorMapper: BuildingColorMapper;
    districtColorMapper: DistrictColorMapper;
    valueMapper?: ValueMapper;
}
