import { Bounds } from "./bounds";

describe('Bounds', () => {
    it('should have a valid size', () => {
        let bounds = new Bounds(4,3);
        expect(bounds.sumOfWidthHeight()).toBe(7);
    });

    it('should be equal with a bounds of the same size', () => {
        let bounds = new Bounds(4,3);
        let bounds2 = new Bounds(4,3);

        expect(bounds2.equals(bounds)).toBe(true);
        expect(bounds.equals(bounds2)).toBe(true);
    });
});