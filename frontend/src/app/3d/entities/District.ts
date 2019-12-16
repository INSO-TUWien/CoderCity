import { Entity } from '../entity';
import { Vector2, Color } from 'three';
import { Bounds } from '../layout/bounds';
import { KDTree } from '../layout/kd-tree';
import { Element } from '../layout/element';
import { Cube } from './Cube';
import * as THREE from 'three';
import { ColorGenerator } from '../util/color-generator';

export class District extends Entity {

    elements: [number, number][] = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]];
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
        let i = 0;

        // Traverse tree
        this.tree.executeWhileTraversingPreOrder((node) => {
            console.log(node);
            if (node.hasElement()) {
                const element = node.element;
                const color = ColorGenerator.generateRandomColorRgbString();
                let cube = new Cube(element.bounds.x, 1, element.bounds.y, new THREE.Color(color));
                cube.setPosition(node.position.x, 0, node.position.y);
                this.addEntity(cube);
            }
        });

        // this.elements.forEach(element => {
        //     const color = ColorGenerator.generateRandomColorRgbString();
        //     let cube = new Cube(element[0], 1, element[1], new THREE.Color(color));
        //     cube.setPosition(i, 0, i);
        //     this.addEntity(cube);
        //     i++;
        // });
    }
}
