import { Entity } from '../entity';

export class District extends Entity {

    elements: [number,number][] = [[1,1],[2,2],[3,3],[4,4],[5,5]];
    rootElementSize: [number,number];


    coveredRec:[number, number] = [0,0];

    constructor() {
        super();
        this.rootElementSize = this.elements.reduce((prev, cur) => 
            [prev[0] + cur[0], prev[1] + cur[1]]
        );
    }

    init() {
        for (let element in this.elements) {

        }
    }


}