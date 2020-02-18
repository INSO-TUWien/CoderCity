import { RenderElement } from '../render-element';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { Svg } from '@svgdotjs/svg.js';
import { GridPosition, PixelPosition } from '../compute-position';

export abstract class AbstractGraphCommit implements RenderElement {

    graphPositionX: number;
    graphPositionY: number;

    gridPosition: GridPosition;
    pixelPosition: PixelPosition;

    x: number;
    y: number;

    constructor(protected store: Store<State>) {
    }

    render(svg: Svg): void {
        throw new Error("Method not implemented.");
    }
}
