import { Object3D } from 'three';
import * as THREE from 'three';

export class Entity {
    // List of sub entities
    private entities: Entity[] = [];
    // Threejs mesh represented by this entity
    object: Object3D = new THREE.Object3D();

    /**
     * TODO Called when entity is initiated.
     */
    init() {
    }


    addEntity(entity: Entity): void {
        entity.init();
        this.object.add(entity.object);
        this.entities.push(entity);
    }

    deleteEntity(entity: Entity): void {
        entity.destroy();
        this.object.remove(entity.object);
        this.entities.splice(this.entities.indexOf(entity), 1);
    }

    /**
     * TODO Called when entity is destroyed
     */
    destroy(): void {

    }

    update(): void {
        this.entities.forEach(entity => {
            entity.update();
        });
    }
}