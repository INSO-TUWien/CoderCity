import { Object3D } from 'three';
import * as THREE from 'three';

export class Entity {
    // List of sub entities
    entities: Entity[] = [];
    
    // Threejs mesh represented by this entity
    object: Object3D = new THREE.Object3D();

    constructor() {}

    /**
     * TODO Called when entity is initiated.
     */
    init() {}

    addEntity(entity: Entity): void {
        entity.init();
        this.object.add(entity.object);
        this.entities.push(entity);
    }

    /**
     * Searches recursively using DFS in all child entities and returns 
     * the first entity matching the matchingFunction. ()
     * 
     * An optional cancellation function terminates the current branch and further subbranches if the output of the cancellationFunction returns false
     */
    searchEntity(matchingFunction: (userdata) => boolean, cancellationFunction?: (userData) => boolean): Entity {
        if (cancellationFunction(this.userData)) {
            // If this branch does not contain path then abort.
            return;
        }
        if (matchingFunction(this.userData)) {
            // Current entity matches matching function. This is the searched object.
            return this;
        }

        for (let entity of this.entities) {
            let result = entity.searchEntity(matchingFunction, cancellationFunction);
            if (result !== null && result !== undefined) {
                return result;
            }
        }
    }

    deleteEntity(entity: Entity): void {
        entity.destroy();
        this.object.remove(entity.object);
        this.entities.splice(this.entities.indexOf(entity), 1);
    }

    setUserData(userData) {
        this.object.userData = userData;
    }

    get userData() {
        return this.object.userData;
    }

    /**
     * TODO Called when entity is destroyed
     */
    destroy(): void {
    }

    update(): void {
        for (let entity of this.entities) {
            entity.update();
        }
    }
}
