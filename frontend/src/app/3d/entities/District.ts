import { Entity } from '../entity';
import { Vector2, Color } from 'three';
import { Bounds } from '../layout/bounds';
import { KDTree } from '../layout/kd-tree';
import { Element } from '../layout/element';
import { Cube } from './Cube';
import * as THREE from 'three';
import { ColorGenerator } from '../util/color-generator';

export class District extends Entity {

    //[3, 3], [4, 4], [5, 5]
    elements: [number, number][] = [[1, 1], [3, 3], [2, 2], [1, 1], [5, 5]];
    rootAreaBounds: Bounds;
    coveredRec: [number, number] = [0, 0];

    tree: KDTree;

    constructor() {
        super();
    }

    private initSampleBuildings() {
        // Determine max areal extent and assign the set the max areal extent
        const rootArealExtent = this.elements.reduce((prev, cur) =>
            [prev[0] + cur[0], prev[1] + cur[1]]
        );
        this.rootAreaBounds = new Bounds(rootArealExtent[0], rootArealExtent[1]);
        this.tree = new KDTree(new Vector2(0, 0), this.rootAreaBounds);

        //Sort elements in desc order.
        //this.elements.sort((a, b) => b[0] - a[0]);
        this.elements.forEach(el => {
            const element = new Element(new Bounds(el[0], el[1]));
            this.tree.addElement(element);
        });
    }

    init() {
        this.initSampleBuildings();
        this.renderSampleBuildings();
    }

    private renderSampleBuildings() {

        // Traverse tree
        this.tree.executeWhileTraversingPreOrder((node) => {
            console.log(node);
            if (node.hasElement()) {
                const element = node.element;
                const color = ColorGenerator.generateRandomColorRgbString();
                let cube = new Cube(element.bounds.x, 1, element.bounds.y, new THREE.Color(color));
                this.addEntity(cube);

                // Calculcate center point of bounding box
                let bboxCenter = new THREE.Vector3();
                cube.geometry.computeBoundingBox();
                let bbox = cube.geometry.boundingBox.clone();
                let bboxMin = bbox.min;
                let bboxMax = bbox.max;
                bboxCenter.setX((bboxMax.x - bboxMin.x) / 2);
                bboxCenter.setY((bboxMax.y - bboxMin.y) / 2);
                bboxCenter.setZ((bboxMax.z - bboxMin.z) / 2);
                cube.setPosition(node.position.x + bboxCenter.x, 0, node.position.y + bboxCenter.z);
            }
        });
    }
}
