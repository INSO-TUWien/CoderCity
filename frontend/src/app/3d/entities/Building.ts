import { Entity } from '../entity';
import * as THREE from 'three';
import { BuildingSegment } from './building-segment';
import { BUILDING_MARGIN } from '../constants';
import { CityElement } from '../layout/city-element';
import { Bounds } from '../layout/bounds';
import { File } from '../../model/file.model';
import { ValueMapper } from '../util/mapper/value-mapper';
import { SquareRootValueMapper } from '../util/mapper/squareroot-value-mapper';
import { BlameHunk } from 'src/app/model/blamehunk.model';
import { CityOptions } from '../util/city-options';
import { Author } from 'src/app/model/author.model';

export class Building extends Entity implements CityElement {
    static DEFAULT_COLOR = new THREE.Color('#F9F9F9');
    mapper: ValueMapper;

    /**
     * Creates an empty building slot width the width and height. (reserved for the building)
     */
    constructor(public bounds: Bounds, private options: CityOptions) {
        super();
        this.mapper = new SquareRootValueMapper();
    }

    gridPosition: THREE.Vector2;

    createWithFile(file: File): void {
        // Create building segments for each blame hunk
        file.hunks.forEach((hunk) => {
            const hunkData = BlameHunk.fromObject(hunk);
            let startLineNumber;
            let endLineNumber;

            if (this.mapper == null) {
                startLineNumber = hunk.startLineNumber - 1; // Line numbers in hunks start at 1. However we do not want to render at position 1, but at position 0.
                endLineNumber = hunk.startLineNumber - 1  + hunk.linesInHunk;
            } else {
                // Mapper exists
                const lineCount = file.lineCount;
                const mappedLineCount = this.mapper.map(lineCount);
                startLineNumber = this.mapper.map((hunk.startLineNumber - 1) / lineCount * mappedLineCount); // Use correct relational ration between line number after applying mapper
                endLineNumber = this.mapper.map(((hunk.startLineNumber - 1  + hunk.linesInHunk))/ lineCount * mappedLineCount);
            }

            this.createBuildingSegment(startLineNumber, endLineNumber, hunkData);
        });

        this.setUserData(file);
    }

    setPosition(x: number, y: number, z: number) {
        this.object.position.set(x, y, z);
    }

    setValueMapper(mapper: ValueMapper): void {
        this.mapper = mapper;
    }

    createBuildingSegment(start: number, end: number, hunk: BlameHunk) {
        let color = Building.DEFAULT_COLOR;
        let opacity = 1;
   
        // Check whether author of hunk is in exlusion list.
        const author = Author.fromHunk(hunk);
        if (this.options?.excludedAuthors != null &&
            this.options?.excludedAuthors.findIndex((excludedAuthor) => Author.hashCode(author) == excludedAuthor) === -1) 
        {
            // Author is not in exlusion list.
            // Get mapped author color
            color = this.options.buildingColorMapper.mapValue(hunk);
        }
        
        const segment = new BuildingSegment(
            this.bounds.x - BUILDING_MARGIN,
            (end - start),
            this.bounds.y - BUILDING_MARGIN,
            color,
            opacity
        );

        segment.setPosition(
            0 + BUILDING_MARGIN / 2,
            // Add y axis offset
            start  + segment.calculateBoundingBoxCenterOffset().y,
            0 + BUILDING_MARGIN / 2
        );
        segment.setUserData(hunk);
        this.addEntity(segment);
    }

    calculateBoundingBoxCenterOffset(): THREE.Vector3 {
        // Calculcate center point of bounding box
        const bboxCenter = new THREE.Vector3();
        const bbox = new THREE.Box3().setFromObject(this.object);
        const bboxMin = bbox.min;
        const bboxMax = bbox.max;
        bboxCenter.setX((bboxMax.x - bboxMin.x) / 2);
        bboxCenter.setY((bboxMax.y - bboxMin.y) / 2);
        bboxCenter.setZ((bboxMax.z - bboxMin.z) / 2);
        return bboxCenter;
    }
}
