import { Entity } from '../entity';
import { BoxGeometry, MeshBasicMaterial, MeshLambertMaterial } from 'three';
import * as THREE from 'three';

export class Cube extends Entity {
    geometry: THREE.BoxGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh;

    constructor(width: number, height: number, depth: number, color?: THREE.Color) {
        super();
        this.geometry = new BoxGeometry(width, height, depth);
        this.material = new MeshBasicMaterial({color: color ? color : 'red'});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    init() {
        this.object.add(this.mesh);
    }

    setPosition(x: number, y: number, z: number) {
        this.mesh.position.set(x, y, z);
    }
}
