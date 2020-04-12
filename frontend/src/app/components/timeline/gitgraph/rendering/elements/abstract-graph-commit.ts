import { RenderElement } from '../render-element';
import { Svg } from '@svgdotjs/svg.js';
import { GridPosition, PixelPosition } from '../compute-position';
import { GitGraphCallbacks } from '../callback/callback';

export abstract class AbstractGraphCommit implements RenderElement {

    graphPositionX: number;
    graphPositionY: number;

    gridPosition: GridPosition;
    pixelPosition: PixelPosition;

    x: number;
    y: number;

    constructor(callbacks: GitGraphCallbacks) {
    }

    render(svg: Svg): void {
        throw new Error("Method not implemented.");
    }
}
