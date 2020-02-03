import { RenderElement } from '../render-element';
import { Svg } from '@svgdotjs/svg.js';

export const STROKE_WIDTH = 3;

// Account for offset in bounding boxes of commit circles
export const OFFSET_X = 15 / 2;
export const OFFSET_Y = 20 / 2;

export class GraphLine implements RenderElement {
    x: number;
    y: number;

    constructor(
        private startElement: RenderElement,
        private endElement: RenderElement
    ) {
    }

    render(svg: Svg): void {
        svg
            .line(
                this.startElement.x + OFFSET_X,
                this.startElement.y + OFFSET_Y,
                this.endElement.x + OFFSET_X,
                this.endElement.y + OFFSET_Y)
            .stroke(
                { width: STROKE_WIDTH, color: '#3BC4C7', linecap: 'round'})
            .back();
    }

}
