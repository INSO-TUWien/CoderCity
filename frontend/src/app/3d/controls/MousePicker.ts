import * as THREE from 'three';
import { Entity } from '../entity';
import { Mesh, MeshLambertMaterial, Object3D } from 'three';
import { EventBus } from '../util/eventbus';
import * as EventEmitter from 'eventemitter3';
import { BlameHunk } from 'src/app/model/blamehunk.model';
import { Directory } from 'src/app/model/directory.model';
import { IntersectableDirectory } from 'src/app/model/intersectable/intersectable-directory';

/**
 * Mouse picker to trigger hover/selection for elements in 3d scene.
 * Similar to:
 * @see https://threejs.org/docs/#api/en/core/Raycaster
 */
export class MousePicker extends Entity {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    private needsUpdate: boolean;
    private intersectedObject: Mesh;
    private intersectedObjectColor;
    private eventBus: EventEmitter;

    constructor(
        private camera: THREE.Camera,
        private scene: THREE.Scene,
        private htmlElement: HTMLElement
        ) {
        super();
    }

    init(): void {
        if (this.htmlElement != null) {
            this.htmlElement.addEventListener(`mousemove`, (ev) => this.onMouseMove(ev), false);
            console.debug(`Mousepicker initialized`);
            this.eventBus = EventBus.instance;
        } else {
            console.error(`Could not initialize Mousepicker: htmlElement was null or invalid.`);
        }
    }

    private onMouseMove(event) {
        if (event == null) {
            console.error(`onMouseMove: event is null or undefined`);
            return;
        }

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        const x = ( event.clientX / window.innerWidth ) * 2 - 1;
        const y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.needsUpdate = true;
        this.mouse.set(x, y);
    }

    update(): void {
       // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Short circuit if mouse was not moved.
        if (!this.needsUpdate) {
            return;
        }

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        //console.debug(`intersect: ${intersects.length}`);

        if (intersects.length > 0) {
            // Highlight nearest intersecting object.
            const intersectedObject = intersects[0].object;

            if (this.intersectedObject !== intersectedObject) {
                this.resetIntersectedObjectColor();
                this.handleIntersectedObject(intersectedObject);
            }
        } else if (intersects.length === 0 && this.intersectedObject != null) {
            this.resetIntersectedObjectColor();
            this.intersectedObject = null;
            this.eventBus.emit(`intersectObject`, null);
        }

        this.needsUpdate = false;
    }

    private handleIntersectedObject(object: Object3D) {
         // Highlight nearest intersecting object.
         if (object instanceof Mesh) {
             const material = object.material;
             if (material instanceof MeshLambertMaterial) {
                this.intersectedObject = object;
                this.intersectedObjectColor = material.emissive.getHex();
                material.emissive.setHex(0xff0000);

                // console.log(`Intersected Object: ${JSON.stringify(object.userData)}`);
                if (object.userData instanceof BlameHunk) {
                    this.eventBus.emit(`intersectObject`, object.userData);
                } else if (object.userData instanceof IntersectableDirectory) {
                    this.eventBus.emit(`intersectObject`, object.userData);
                }
             }
         }
    }

    private resetIntersectedObjectColor() {
        if (this.intersectedObject != null
            && this.intersectedObject.material instanceof MeshLambertMaterial) {
            this.intersectedObject.material.emissive.setHex(this.intersectedObjectColor);
        }
    }
}
