import { BuildingSizeMapper } from "./building-size-mapper";

export class OneToOneValueMapper implements BuildingSizeMapper {
    map(value: number): number {
       return value;
    }
}