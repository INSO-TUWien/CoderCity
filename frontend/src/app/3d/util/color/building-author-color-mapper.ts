import { BuildingColorMapper } from './building-color-mapper';
import { BlameHunk } from 'src/app/model/blamehunk.model';
import { Author } from 'src/app/model/author.model';
import * as THREE from 'three';
import { getRandomBuildingColor } from 'src/app/util/color-scheme';

/**
 * Assigns a building a color matching with the given authors array.
 * Returns a random building color if the author is not in the initial authors array.
 */
export class BuildingAuthorColorMapper implements BuildingColorMapper {
    constructor(private authors: Author[]) {}

    mapValue(hunk: BlameHunk): THREE.Color {
        if (this.authors != null && Array.isArray(this.authors)) {
            for (let author of this.authors) {
                if (Author.equals(author, hunk.signature)) {
                    return new THREE.Color(author.color);
                }
            }
        } else {
            return new THREE.Color(getRandomBuildingColor());
        }
    }
}
