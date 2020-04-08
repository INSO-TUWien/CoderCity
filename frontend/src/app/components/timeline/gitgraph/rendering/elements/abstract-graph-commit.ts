import { RenderElement } from '../render-element';
import { Svg } from '@svgdotjs/svg.js';
import { GridPosition, PixelPosition } from '../compute-position';
import { OnGraphCommitMouseOver, OnGraphCommitClick } from '../callback/callback';

export abstract class AbstractGraphCommit implements RenderElement {

    graphPositionX: number;
    graphPositionY: number;

    gridPosition: GridPosition;
    pixelPosition: PixelPosition;

    x: number;
    y: number;

    constructor(
        onMouseOverCallback: OnGraphCommitMouseOver,
        onClickCallback: OnGraphCommitClick) {
    }

    render(svg: Svg): void {
        throw new Error("Method not implemented.");
    }
}
