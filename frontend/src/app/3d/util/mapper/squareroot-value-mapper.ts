import * as d3 from 'd3-scale';
import { ValueMapper } from './value-mapper';

export class SquareRootValueMapper implements ValueMapper {

    map(value: number): number {
        return Math.sqrt(value);
    }
}
