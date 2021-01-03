import { BuildingColorMapper } from './color/building-color-mapper';
import { DistrictColorMapper } from './color/district-color-mapper';
import { BuildingSizeMapper } from './mapper/building-size-mapper';

export interface CodeCityConfig {
    buildingSizeMapper: BuildingSizeMapper;
    buildingColorMapper: BuildingColorMapper;
    districtColorMapper: DistrictColorMapper;
    valueMapper?: BuildingSizeMapper;
    excludedFiles?: string[];
    excludedAuthors?: string[];
}
