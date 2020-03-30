import { Bounds } from './bounds';

export class Area {
    bounds: Bounds;
    position: THREE.Vector2;

    constructor(position: THREE.Vector2, bounds: Bounds) {
        this.position = position;
        this.bounds = bounds;
    }

    fits(area: Area): boolean {
        if (this.position.x <= area.position.x
            && this.position.y <= area.position.y
            && area.position.x + area.bounds.x <= this.position.x + this.bounds.x
            && area.position.y + area.bounds.y <= this.position.y + this.bounds.y
        ) {
            return true;
        }
        return false;
    }
}
