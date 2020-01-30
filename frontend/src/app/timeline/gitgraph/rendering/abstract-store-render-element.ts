import { RenderElement } from './render-element';
import { Svg } from '@svgdotjs/svg.js';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';

export class AbstractStoreRenderElement implements RenderElement {

    constructor(protected store: Store<State>) {
    }

    x: number;
    y: number;
    render(svg: Svg): void {
        throw new Error("Method not implemented.");
    }
}