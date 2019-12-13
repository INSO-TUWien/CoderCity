import * as THREE from 'three';

/**
 * Threejs TextureLoader packed as promise.
 */
export class TexturePromiseLoader {
    static textureLoader = new THREE.TextureLoader();

    static loadTexture(url: string): Promise<THREE.Texture> {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                resolve,
                undefined,
                reject)
        });
    }
}