import { Entity } from '../entity';
import { District } from './district';
import { Directory } from 'src/app/model/directory.model';
import { CodeCityConfig } from '../util/code-city-config';

export class City extends Entity {

    rootDistrict: District;

    constructor(private options: CodeCityConfig){
        super();
    }

    init(): void {
    }

    /**
     * Translates the city in the secene to the center point of the city.
     */
    centerCityPosition(): void {
        const offsetX = - (this.rootDistrict.bounds.x / 2);
        const offsetZ = - (this.rootDistrict.bounds.y / 2);
        this.rootDistrict.setPosition(offsetX, 0, offsetZ);
    }

    searchEntity(matchingFunction: (userdata) => boolean, cancellationFunction?: (userData) => boolean): Entity {
        return this.rootDistrict.searchEntity(matchingFunction, cancellationFunction);
    }

    generateCity(projectFiles: Directory): void {
        if (this.rootDistrict != null) {
            this.deleteEntity(this.rootDistrict);
        }

        if (projectFiles == null) {
            console.error(`Invalid parameter projectFiles is null or undefined`);
        }
        // Create root directory
        this.rootDistrict = new District(projectFiles, this.options);
        this.generateCityElement(projectFiles, this.rootDistrict);
        this.addEntity(this.rootDistrict);
        this.rootDistrict.addToScene();
        this.rootDistrict.setUserData({
            fullPath: ''
        })
    }

    /**
     * Builds city recursively
     */
    private generateCityElement(directory: Directory, district: District, depth: number = 0): void {
        district.depth = depth;

        directory.files.forEach(file => {
            // Check if file is excluded in exclusion list and skip file if so
            if (this.options.excludedFiles && this.options.excludedFiles.includes(`${file.fullPath}`)) {
                // File is excluded
                return;
            }

            // Create building for each file
            district.addBuildingWithFile(file);
        });

        directory.directories.forEach(d => {
            // Create district for each sub district
            const subDistrict = new District(d, this.options);
            this.generateCityElement(d, subDistrict, depth + 1);
            district.addElement(subDistrict);
        });
    }
}
