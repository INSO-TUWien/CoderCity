import { Entity } from '../entity';
import { Vector2 } from 'three';
import { Bounds } from '../layout/bounds';
import { KDTree } from '../layout/kd-tree';
import { Element } from '../layout/element';
import { Cube } from './Cube';
import { KDTreeNode } from '../layout/kd-treenode';
import { Area } from '../layout/area';
import { Building} from './Building';
import { DISTRICT_MARGIN } from '../constants';
import { File } from '../../model/file.model';
import { CityElement } from '../layout/city-element';
import { CityOptions } from '../util/city-options';
import { Directory } from 'src/app/model/directory.model';
import { IntersectableDirectory } from 'src/app/model/intersectable/intersectable-directory';

export interface PreserverNode {
    node: KDTreeNode;
    waste: number;
}

export interface ExpanderNode {
    node: KDTreeNode;
    ratio: number;
}

/**
 * Calculates the largest possible area taken up by the elements (represented as bounds array).
 */
export function calculcateMaxAreaForElements(elements: CityElement[]): Bounds {
    let x = 0;
    let y = 0;
    for (let element of elements) {
        x += Math.ceil(element.bounds.x);
        y += Math.ceil(element.bounds.y);
    }
    return new Bounds(x, y);
}

export class District extends Entity implements Element {

    /** Depth level of the current district. With the root district node being 0. */
    depth: number = 0;
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
    private name: string;

    // Currently covered area by the elements.
    private coveredArea: Area;

    constructor(
        public directory: Directory,
        private options: CityOptions) {
        super();
        this.name = directory.name;
        this.computeDistrictLayout();
    }

    init() {
    }

    addBuildingWithFile(file: File) {
        const width = 3;
        const height = 3;
        // const element = new Element(new Bounds(width, height));
        const building = new Building(new Bounds(width, height), this.options);
        building.createWithFile(file);
        this.addBuilding(building);
    }

    /**
     * Adds a building to district
     * @param building 
     */
    addBuilding(building: Building) {
        this.addCityElement(building);
    }

    /**
     * Adds a city element to district
     * @param cityElement 
     */
    addCityElement(cityElement: CityElement) {
        this.districtElements.push(cityElement);
        this.computeDistrictLayout();
    }

    /**
     * Adds multiple city elements to district
     * @param cityElements 
     */
    addCityElements(cityElements: CityElement[]) {
        cityElements.forEach(element  => {
            this.districtElements.push(element);
        });
        this.computeDistrictLayout();
    }

    // Sort elements by surface area descending. (Largest first)
    private sortCityElements() {
        this.districtElements.sort((a, b) => b.bounds.x * b.bounds.y - a.bounds.x * a.bounds.y);
        //console.log(`Sorted city elements: ${JSON.stringify(this.districtElements)}`);
    }

    /**
     * Computes the coordinates of the city elemenets positioned in this district. 
     */
    private computeDistrictLayout(): void {
        this.sortCityElements();
        // Determine largest area that can be taken up if all elements are placed.
        const maxArea = calculcateMaxAreaForElements(this.districtElements);
        this.tree = new KDTree(new Vector2(0, 0), maxArea);
        this.coveredArea = new Area(new Vector2(0, 0), new Bounds(0, 0));
        this.districtElements.forEach(element => {
            this.computePositionForCityElement(element);
        });
    }

    /**
     * Adds city element to kd tree and assigns positions.
     */
    private computePositionForCityElement(element: CityElement): void {
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
            if (expanders[0] == null) {
                alert(`expanders is null ${JSON.stringify(element)}`);
            }
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
                        node.position.x + bboxCenter.x + DISTRICT_MARGIN / 2,
                        0,
                        node.position.y + bboxCenter.z + DISTRICT_MARGIN / 2,
                    );
                    this.addEntity(building);
                }
            }
        });

        const color = this.options.districtColorMapper.mapValue(this);

        // Add this district to scene
        const cube = new Cube(this.bounds.x - DISTRICT_MARGIN, 0.2, this.bounds.y - DISTRICT_MARGIN, color);
        const bboxCenter = cube.calculateBoundingBoxCenterOffset();
        cube.setPosition(bboxCenter.x, 0, bboxCenter.z);
        cube.setUserData(IntersectableDirectory.fromObject(this.directory));
        this.addEntity(cube);
    }

    setPosition(x: number, y: number, z: number) {
        this.object.position.set(x, y, z);
    }
}
