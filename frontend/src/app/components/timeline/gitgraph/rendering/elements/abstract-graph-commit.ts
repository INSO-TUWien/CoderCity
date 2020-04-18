import { RenderElement } from '../render-element';
import { Svg, Shape } from '@svgdotjs/svg.js';
import { GridPosition, PixelPosition } from '../compute-position';
import { GitGraphCallbacks } from '../callback/callback';
import { Commit } from 'src/app/model/commit.model';

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

    constructor(
        public callbacks: GitGraphCallbacks, 
        public commit: Commit) {
    }

    render(svg: Svg): void {
        throw new Error("Method not implemented.");
    }

    abstract setState(state: GraphCommitState);
}
