import { BuildingSizeMapper } from './building-size-mapper';

export class SquareRootValueMapper implements BuildingSizeMapper {

    map(value: number): number {
        return Math.sqrt(value);
    }
}