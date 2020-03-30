import { Svg } from '@svgdotjs/svg.js';

export interface RenderElement {
    x: number;
    y: number;
    render(svg: Svg): void;
}
