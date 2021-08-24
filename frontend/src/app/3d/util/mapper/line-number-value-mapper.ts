import { BuildingSizeMapper } from "./building-size-mapper";

export class LineNumberValueMapper implements BuildingSizeMapper {
    map(value: number): number {
       return value;
    }
}