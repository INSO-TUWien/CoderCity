import * as d3 from 'd3-scale';
import { BuildingSizeMapper } from './building-size-mapper';

export class SquareRootScaleMapper implements BuildingSizeMapper {

    private scale: d3.ScalePower<number, number>;

    constructor(minValue: number, maxValue: number) {
        this.scale = d3.scaleSqrt()
            .domain([minValue, maxValue])
            .range([0, 20]);
    }

    map(value: number): number {
        return this.scale(value);
    }
}
