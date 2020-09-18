import { CityElement } from '../city-element';
import { Bounds } from '../bounds';
import { Vector2 } from 'three';
import { CityLayoutElement } from './city-layout-element';
import { CityOptions } from '../../util/city-options';
import { Directory } from 'src/app/model/directory.model';
import { District } from '../../entities/District';
import { DistrictLayout } from './district-layout';
import { BuildingLayout } from './building-layout';

export class CityLayout extends CityLayoutElement {
    constructor(private options: CityOptions) {
        super();
    }

    static generateCityLayout(
        directory: Directory,
        district: DistrictLayout,
        options: CityOptions,
        depth: number = 0
    ) {
        
        directory.files.forEach(file => {
            // Create building for each file
            const building = BuildingLayout.fromFile(file, options);
            district.addSubElement(building);
        });

        directory.directories.forEach(d => {
            // Create district for each sub district
            const subDistrict = new DistrictLayout(options, depth + 1);
            CityLayout.generateCityLayout(d, subDistrict, options, depth + 1);
            district.addSubElement(subDistrict);
        });
    }
}