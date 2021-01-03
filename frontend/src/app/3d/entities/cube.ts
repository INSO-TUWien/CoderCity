import { Entity } from '../entity';
import { BoxBufferGeometry, MeshLambertMaterial } from 'three';
import * as THREE from 'three';

export class Cube extends Entity {
    geometry: THREE.BoxBufferGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh;

    constructor(width: number, height: number, depth: number, color: THREE.Color, opacity: number = 1) {
        super();
        this.geometry = new BoxBufferGeometry(width, height, depth);
        this.material = new MeshLambertMaterial(
            {
                color,
                transparent: true,
                opacity: opacity
            }
        );
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    init() {
        this.object.add(this.mesh);
    }

    getUserData() {
        return this.mesh.userData;
    }

    get userData() {
        return this.mesh.userData;
    }

    setUserData(userData) {
        if (this.mesh != null) {
            this.mesh.userData = userData;
        }
    }

    setPosition(x: number, y: number, z: number) {
        this.mesh.position.set(x, y, z);
    }

    calculateBoundingBoxCenterOffset(): THREE.Vector3 {
        // Calculcate center point of bounding box
        let bboxCenter = new THREE.Vector3();
        this.geometry.computeBoundingBox();
        let bbox = this.geometry.boundingBox.clone();
        let bboxMin = bbox.min;
        let bboxMax = bbox.max;
        bboxCenter.setX((bboxMax.x - bboxMin.x) / 2);
        bboxCenter.setY((bboxMax.y - bboxMin.y) / 2);
        bboxCenter.setZ((bboxMax.z - bboxMin.z) / 2);
        return bboxCenter;
    }
}
