import { Object3D } from 'three';
import * as THREE from 'three';

export class Entity {
    // List of sub entities
    entities: Entity[] = [];
    
    // Threejs mesh represented by this entity
    object: Object3D = new THREE.Object3D();

    private listener: (values: {x: number, y: number}) => void = null;
    camera: THREE.Camera;

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
            return null;
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
        
        return null;
    }

    addScreenSpaceCoordinatesListener(camera: THREE.Camera, listener: (values: {x: number, y: number}) => void) {
        this.camera = camera;
        this.listener = listener;
    }

    removeScreenSpaceCoordinatesListener(): void {
        this.listener = null;
    }

    /**
     * Projects world coordinates to screen space coordinates.
     * @param camera 
     * @returns 
     */
    get2DCoordinates(camera: THREE.Camera): THREE.Vector2 {
        let projectedCoords = new THREE.Vector3();
        this.object.getWorldPosition(projectedCoords);
        projectedCoords = projectedCoords.project(camera);
        // projectedCoords = new THREE.Vector3(10,0,0).project(camera);
        return new THREE.Vector2(
            (projectedCoords.x + 1) * window.innerWidth / 2,
            - (projectedCoords.y - 1) * window.innerHeight / 2,
        );
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

        if (this.listener !== null) {
            let coords = this.get2DCoordinates(this.camera);
            this.listener({ x: coords.x, y: coords.y});
        }

    }
}
