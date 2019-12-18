import { Entity } from '../entity';
import { Vector2, Color } from 'three';
import { Bounds } from '../layout/bounds';
import { KDTree } from '../layout/kd-tree';
import { Element } from '../layout/element';
import { Cube } from './Cube';
import * as THREE from 'three';
import { ColorGenerator } from '../util/color-generator';
import { KDTreeNode } from '../layout/kd-treenode';

export interface PreserverNode {
    node: KDTreeNode;
    waste: number;
}

export interface ExpanderNode {
    node: KDTreeNode;
    ratio: number;
}

export class RandomRectangleGenerator {
    static generateRectangle(): [number, number] {
        let randomWidth = Math.floor(Math.random() * 5) + 1;
        let randomHeight = Math.floor(Math.random() * 5) + 1;
        return [randomHeight, randomWidth];
    }
}

export class Area {
    bounds: Bounds;
    position: THREE.Vector2;

    constructor(position: THREE.Vector2, bounds: Bounds) {
        this.position = position;
        this.bounds = bounds;
    }

    fits(area: Area): boolean {
        if (this.position.x <= area.position.x
            && this.position.y <= area.position.y
            && area.position.x + area.bounds.x <= this.position.x + this.bounds.x
            && area.position.y + area.bounds.y <= this.position.y + this.bounds.y
        ) {
            return true;
        }
        return false;
    }
}

export class District extends Entity {

    //elements: [number, number][] = [[4, 4], [2, 3], [1, 1], [1, 3]];
    elements: [number, number][] = [];

    rootAreaBounds: Bounds;

    tree: KDTree;

    constructor() {
        super();
    }

    private initSampleBuildings() {

         for (let i = 0; i < 100; i++) {
           this.elements.push(RandomRectangleGenerator.generateRectangle());
        }

        console.log(`elements: ${this.elements}`);

        // Determine max areal extent and assign the set the max areal extent
        const rootArealExtent = this.elements.reduce((prev, cur) =>
            [prev[0] + cur[0], prev[1] + cur[1]]
        );
        this.elements.sort((a, b) => b[0] * b[1] - a[0] * a[1]);
        this.rootAreaBounds = new Bounds(rootArealExtent[0], rootArealExtent[1]);
        this.tree = new KDTree(new Vector2(0, 0), this.rootAreaBounds);
    }

    init() {
        this.initSampleBuildings();
        this.renderRectanglePacking();
        // this.renderSampleBuildings();
    }

    private renderRectanglePacking() {
        const coveredArea = new Area(new Vector2(0, 0), new Bounds(0, 0));
        this.elements.forEach(el => {
            const element = new Element(new Bounds(el[0], el[1]));
            let emptyLeafNodes = this.tree.getEmptyLeafNodes();
            // Filter nodes which are large enough to fit the element.
            emptyLeafNodes = emptyLeafNodes.filter((node) => node.bounds.fits(element.bounds));

            const preservers: PreserverNode[] = [];
            const expanders: ExpanderNode[] = [];

            emptyLeafNodes.forEach(node => {
                // Check if cover area fits the element and the node is large enough to encompass element.
                if (coveredArea.fits(new Area(node.position, element.bounds)) && node.bounds.fits(element.bounds)) {
                    // Node fits into covered area
                    const waste = node.bounds.calculateRemainingArea(element.bounds);
                    preservers.push({
                        node,
                        waste
                    });
                } else {
                    // Node does not fit in current cover area.
                    // The current area must be expanded.

                    // Calculate position of the highest x or y points of if the element would be placed in this node.
                    // Imagine coveredArea would be area A,
                    // then point P would be the point with the highest x and y value from the origin point.
                    //
                    //  ----------------->
                    //  |       A  o
                    //  |       A  o
                    //  |AAAAAAAA  o
                    //  |ooooooooooP
                    //  v
                    //
                    const elementHighestX = node.position.x + element.bounds.x;
                    const elementHighestY = node.position.y + element.bounds.y;

                    // Naive approach to filter out nodes which are not at the edge of the area by checking
                    // whether node exceeds area boundaries.
                    // Only nodes at the edge are able to expand. Enclosed nodes would overlap other nodes.
                    if (elementHighestX > coveredArea.bounds.x || elementHighestY > coveredArea.bounds.y) {
                        // Either x or y coordinate must be larger than current area for expansion, otherwise node is an enclosed node.
                        // Calculate aspect ratio of new covered area if element was placed in this node.

                        const expandedAreaX = (coveredArea.bounds.x > elementHighestX) ? coveredArea.bounds.x : elementHighestX;
                        const expandedAreaY = (coveredArea.bounds.y > elementHighestY) ? coveredArea.bounds.y : elementHighestY;

                        // Calculate aspect ratio
                        // See: https://stackoverflow.com/questions/10416366/how-to-determine-which-aspect-ratios-are-closest
                        const ratio = Math.atan(expandedAreaX / expandedAreaY);
                        expanders.push({
                            node,
                            ratio
                        });
                    }
                }
            });
            let targetNode: KDTreeNode;

            if (preservers.length > 0) {
                // If preservers are available place element to preserver node with lowest "waste" of area.
                preservers.sort((a, b) => a.waste - b.waste);
                targetNode = preservers[0].node;
            } else {
                // Sort list based on ratio closest to 1.
                expanders.sort((a, b) =>  {
                    return Math.abs(Math.atan(1) - a.ratio) - Math.abs(Math.atan(1) - b.ratio);
                });
                targetNode = expanders[0].node;
            }

            // Check if target node perfectly fits element
            if (targetNode.bounds.equals(element.bounds)) {
                targetNode.element = element;
            } else {
                targetNode.insertElement(targetNode, element);

                const expandedAreaX = targetNode.position.x + element.bounds.x;
                const expandedAreaY = targetNode.position.y + element.bounds.y;
                if (expandedAreaX > coveredArea.bounds.x) {
                    coveredArea.bounds.x = expandedAreaX;
                }
                if (expandedAreaY > coveredArea.bounds.y) {
                    coveredArea.bounds.y = expandedAreaY;
                }
            }
        });
        this.renderBuildings();
    }

    private renderSampleBuildings() {
        // Sort elements in desc order.
        // this.elements.sort((a, b) => b[0] - a[0]);
        this.elements.forEach(el => {
            const element = new Element(new Bounds(el[0], el[1]));
            this.tree.addElement(element);
        });

        this.renderBuildings();
    }

    private renderBuildings() {
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
