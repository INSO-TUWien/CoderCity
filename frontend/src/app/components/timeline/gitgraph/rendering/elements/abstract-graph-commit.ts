import { RenderElement } from '../render-element';
import { Svg, Shape } from '@svgdotjs/svg.js';
import { GridPosition, PixelPosition } from '../compute-position';
import { GitGraphCallbacks } from '../callback/callback';

export enum GraphCommitState {
    Default,
    Selected,
    Highlight
}

export abstract class AbstractGraphCommit implements RenderElement {

    graphPositionX: number;
    graphPositionY: number;

    gridPosition: GridPosition;
    pixelPosition: PixelPosition;
    shape: Shape;

    x: number;
    y: number;

    constructor(callbacks: GitGraphCallbacks) {
    }

    render(svg: Svg): void {
        throw new Error("Method not implemented.");
    }

    abstract setState(state: GraphCommitState);
}
