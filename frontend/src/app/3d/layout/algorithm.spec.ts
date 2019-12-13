import { Algorithm } from "./algorithm";

describe('algorithm', () => {
    it('should be truthy', () => {
        let algorithm = new Algorithm();
        algorithm.createLayout();
        expect(1).toBe(1);
    })
});