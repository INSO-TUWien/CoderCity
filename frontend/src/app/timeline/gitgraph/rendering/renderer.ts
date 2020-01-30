import { RenderElement } from './render-element';
import { Svg } from '@svgdotjs/svg.js';

export const COMMIT_CIRCLE_DISTANCE = 38;

export class Renderer {
    private renderElements: RenderElement[] = [];

    constructor(private svg: Svg) {}

    addElement(element: RenderElement) {
        this.renderElements.push(element);
    }

    render() {
        this.renderElements.forEach((e) => e.render(this.svg));
    }
}
