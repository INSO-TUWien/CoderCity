//Boundaries in x (width) and y (height)
export class Bounds {

    // Width of boundary
    x: number;

    // Height of boundary
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Returns sum of width and height.
     */
    sumOfWidthHeight(): number {
        return this.x + this.y;
    }

    /**
     * Returns true if bounds are of exactly matching size.
     * @param bounds 
     */
    equals(bounds: Bounds): boolean {
        if (this.x === bounds.x && this.y === bounds.y) {
            return true;
        }

        return false;
    }

    /**
     * Checks whether a given boundary fits into the boundary.
     * @param bounds the given boundary
     */
    fits(bounds: Bounds): boolean {
        if (this.x >= bounds.x && this.y >= bounds.y) {
            return true;
        }
        return false;
    }

    /**
     * Splits boundary into two boundaries at a given x value .
     * @param x the x value
     * @returns an array of the splitted boundaries with the first entry beeing the left splitted boundary and the second array the right splitted boundary
     */
    splitAtAxisX(x: number): Bounds[] {
        //Check if x is in current bound
        if (this.x < x || x < 0) {
            throw new Error('Specified split position is outside of boundary');
        }

        let splittedBounds: Bounds[] = [];
        splittedBounds.push(new Bounds(x, this.y));
        splittedBounds.push(new Bounds(this.x - x, this.y));

        return splittedBounds;
    }

     /**
     * Splits boundary into two boundaries at a given y value .
     * @param y the y value
     * @returns an array of the splitted boundaries with the first entry beeing the left splitted boundary and the second array the right splitted boundary
     */
    splitAtAxisY(y: number): Bounds[] {
        //Check if x is in current bound
        if (this.y < y || y < 0) {
            throw new Error('Specified split position is outside of boundary');
        }

        let splittedBounds: Bounds[] = [];
        splittedBounds.push(new Bounds(this.x, y));
        splittedBounds.push(new Bounds(this.x, this.y - y));

        return splittedBounds;
    }
}