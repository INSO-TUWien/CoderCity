import { Entity } from '../entity';
import { Vector2 } from 'three';
import { Bounds } from '../layout/bounds';
import { KDTree } from '../layout/kd-tree';
import { Element } from '../layout/element';
import { Cube } from './Cube';
import * as THREE from 'three';
import { KDTreeNode } from '../layout/kd-treenode';
import { Area } from '../layout/area';
import { getRandomDistrictColor, getRandomBuildingColor, getRandomNumber } from 'src/app/util/color-scheme';
import { Building} from './Building';
import { DISTRICT_MARGIN } from '../constants';
import { File } from '../../model/file.model';
import { CityElement } from '../layout/city-element';
import { SquareRootValueMapper } from '../util/mapper/squareroot-value-mapper';
import { CityGeneratorOptions } from '../util/city-generator-options';

export interface PreserverNode {
    node: KDTreeNode;
    waste: number;
}

export interface ExpanderNode {
    node: KDTreeNode;
    ratio: number;
}

export class RandomRectangleGenerator {
    static generateBounds(): Bounds {
        const randomWidth = Math.floor(Math.random() * 5) + 1;
        const randomHeight = Math.floor(Math.random() * 5) + 1;
        return new Bounds(randomWidth, randomHeight);
    }
}

/**
 * Calculates the largest possible area taken up by the elements (represented as bounds array).
 */
export function calculcateMaxAreaForElements(elements: CityElement[]): Bounds {
    let x = 0;
    let y = 0;
    elements.forEach((element) => {
        x += element.bounds.x;
        y += element.bounds.y;
    });
    return new Bounds(x, y);
}

export function generateRandomBuildings(count: number, options: CityGeneratorOptions): Building[] {
    const elements: Building[] = [];
    for (let i = 0; i < count; i++) {
        const bounds = RandomRectangleGenerator.generateBounds();
        elements.push(new Building(bounds, options));
    }
    return elements;
}


export class District extends Entity implements Element {

    districtElements: CityElement[] = [];
    gridPosition: Vector2 = new Vector2(0, 0);

    get bounds(): Bounds {
        return new Bounds(
            // Add top, left, right, bottom margins to city element
            this.coveredArea.bounds.x + DISTRICT_MARGIN * 2,
            this.coveredArea.bounds.y + DISTRICT_MARGIN * 2
        );
    }

    private tree: KDTree;

    // Currently covered area by the elements.
    private coveredArea: Area;

    constructor(public name: string, private options: CityGeneratorOptions) {
        super();
        this.computeCity();
    }

    generateRandomBuildings(count: number) {
        const elements = generateRandomBuildings(count, this.options);
        const randomHeight = getRandomNumber(6);
        // building.createBuildingSegment(0, randomHeight + 1);
        // building.createBuildingSegment(randomHeight + 1, randomHeight + 4);
        this.addCityElements(elements);
    }


    init() {
        // this.addToScene();
    }

    addBuilding(file: File) {
        const width = 3;
        const height = 3;
        // const element = new Element(new Bounds(width, height));
        const building = new Building(new Bounds(width, height), this.options);
        building.createWithFile(file);
        this.addCityElement(building);
    }

    addCityElement(cityElement: CityElement) {
        this.districtElements.push(cityElement);
        this.sortCityElements();
        this.computeCity();
    }

    addCityElements(cityElements: CityElement[]) {
        cityElements.forEach(element  => {
            this.districtElements.push(element);
        });
        this.sortCityElements();
        this.computeCity();
    }

    // Sort elements by surface area descending. (Largest first)
    private sortCityElements() {
        this.districtElements.sort((a, b) => b.bounds.x * b.bounds.y - a.bounds.x * a.bounds.y);
        console.log(`Sorted city elements: ${JSON.stringify(this.districtElements)}`);
    }

    private computeCity(): void {
        // Determine largest area that can be taken up if all elements are placed.
        const maxArea = calculcateMaxAreaForElements(this.districtElements);
        this.tree = new KDTree(new Vector2(0, 0), maxArea);
        this.coveredArea = new Area(new Vector2(0, 0), new Bounds(0, 0));
        this.districtElements.forEach(element => {
            this.computeCityElementPosition(element);
        });
    }

    /**
     * Adds city element to kd tree and assigns positions.
     */
    private computeCityElementPosition(element: CityElement): void {
        let emptyLeafNodes = this.tree.getEmptyLeafNodes();
        // Filter nodes which are large enough to fit the element.
        emptyLeafNodes = emptyLeafNodes.filter((node) => node.bounds.fits(element.bounds));

        const preservers: PreserverNode[] = [];
        const expanders: ExpanderNode[] = [];

        emptyLeafNodes.forEach(node => {
            // Check if cover area fits the element and the node is large enough to encompass element.
            if (this.coveredArea.fits(new Area(node.position, element.bounds)) && node.bounds.fits(element.bounds)) {
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
                if (elementHighestX > this.coveredArea.bounds.x || elementHighestY > this.coveredArea.bounds.y) {
                    // Either x or y coordinate must be larger than current area for expansion, otherwise node is an enclosed node.
                    // Calculate aspect ratio of new covered area if element was placed in this node.

                    const expandedAreaX = (this.coveredArea.bounds.x > elementHighestX) ? this.coveredArea.bounds.x : elementHighestX;
                    const expandedAreaY = (this.coveredArea.bounds.y > elementHighestY) ? this.coveredArea.bounds.y : elementHighestY;

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
        }

        // Check if the newly placed element exceed current boundaries and adjust them if so.
        const expandedAreaX = targetNode.position.x + element.bounds.x;
        const expandedAreaY = targetNode.position.y + element.bounds.y;
        if (expandedAreaX > this.coveredArea.bounds.x) {
            this.coveredArea.bounds.x = expandedAreaX;
        }
        if (expandedAreaY > this.coveredArea.bounds.y) {
            this.coveredArea.bounds.y = expandedAreaY;
        }
    }

    addToScene(): void {
        console.log(`District: ${this.name} : addToScene`);
         // Traverse tree and add elements to scene
        this.tree.executeWhileTraversingPreOrder((node) => {
            console.log(node);
            if (node.hasElement()) {
                const element = node.element;
                if (element instanceof District) {
                    // Element is a district
                    // Render inner district first / recursively
                    const district = element as District;
                    district.addToScene();
                    // Render inner districts elevated.
                    district.setPosition(node.position.x + DISTRICT_MARGIN, 0.2, node.position.y + DISTRICT_MARGIN);
                    this.addEntity(element);
                } else if (element instanceof Building) {
                    const building = element as Building;
                    const bboxCenter = building.calculateBoundingBoxCenterOffset();
                    building.setPosition(
                        node.position.x + bboxCenter.x + DISTRICT_MARGIN,
                        0,
                        node.position.y + bboxCenter.z + DISTRICT_MARGIN
                    );
                    this.addEntity(building);
                }
            }
        });
        // Add this district to scene
        const cube = new Cube(this.bounds.x, 0.2, this.bounds.y, new THREE.Color(getRandomDistrictColor()));
        const bboxCenter = cube.calculateBoundingBoxCenterOffset();
        cube.setPosition(bboxCenter.x, 0, bboxCenter.z);
        this.addEntity(cube);
    }

    setPosition(x: number, y: number, z: number) {
        this.object.position.set(x, y, z);
    }
}
