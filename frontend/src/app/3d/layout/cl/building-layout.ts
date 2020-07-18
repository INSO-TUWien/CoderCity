import { CityElement } from '../city-element';
import { Bounds } from '../bounds';
import { CityLayoutElement } from './city-layout-element';
import { File } from '../../../model/file.model';
import { BlameHunk } from 'src/app/model/blamehunk.model';
import { CityOptions } from '../../util/city-options';
import { SquareRootValueMapper } from '../../util/mapper/squareroot-value-mapper';
import { BuildingLayoutSegment } from './building-segment';

export class BuildingLayout extends CityLayoutElement {

    static fromFile(file: File, options: CityOptions) {

        const mapper = new SquareRootValueMapper();
        const building = new BuildingLayout();
        building.bounds = new Bounds(3, 3);

        // Create building segments for each blame hunk
        file.hunks.forEach((hunk: BlameHunk) => {
            const transformedHunk = BlameHunk.fromObject(hunk);
            const color = options.buildingColorMapper.mapValue(hunk);
            const startLineNumber = (mapper == null) ? hunk.startLineNumber : mapper.map(hunk.startLineNumber);
            const endLineNumber = (mapper == null)
                ? hunk.startLineNumber + hunk.linesInHunk
                : mapper.map(hunk.startLineNumber + hunk.linesInHunk);
            const buildingSegment = new BuildingLayoutSegment(color, startLineNumber, endLineNumber);
            building.addSubElement(buildingSegment);
        });
        return building;
    }
}