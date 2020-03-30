import { Entity } from '../entity';
import { District } from './District';
import { Directory } from 'src/app/model/directory.model';
import { BuildingColorMapper } from '../util/color/building-color-mapper';
import { CityGeneratorOptions } from '../util/city-generator-options';

export class City extends Entity {

    rootDistrict: District;

    constructor(private options: CityGeneratorOptions){
        super();
    }

    init(): void {
    }

    generateExampleCity() {
        this.rootDistrict = new District('Folder 1', this.options);
        this.rootDistrict.generateRandomBuildings(2);
        const district2 = new District('Folder 2', this.options);
        district2.generateRandomBuildings(1);
        const district3 = new District('Folder 2', this.options);
        district3.generateRandomBuildings(3);
        this.rootDistrict.addCityElement(district3);
        this.rootDistrict.addCityElement(district2);
        this.addEntity(this.rootDistrict);

        // Call addtoscene in all sub city elements of the district.
        this.rootDistrict.addToScene();
    }

    generateCity(projectFiles: Directory): void {
        if (this.rootDistrict != null) {
            this.deleteEntity(this.rootDistrict);
        }

        if (projectFiles == null) {
            console.error(`Invalid parameter projectFiles is null or undefined`);
        }
        // Create root directory
        this.rootDistrict = new District(projectFiles.name, this.options);
        this.generateCityElement(projectFiles, this.rootDistrict);
        this.addEntity(this.rootDistrict);
        this.rootDistrict.addToScene();
    }

    private generateCityElement(directory: Directory, district: District): void {
        directory.files.forEach(file => {
            // Create building for each file
            district.addBuilding(file);
        });

        directory.directories.forEach(d => {
            // Create district for each sub district
            const subDistrict = new District(d.name, this.options);
            this.generateCityElement(d, subDistrict);
            district.addCityElement(subDistrict);
        });
    }
}
