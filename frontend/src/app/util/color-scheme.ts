import * as chroma from 'chroma-js';

const COLORS: string[] = [
    '#3BC4C7', // Teal
    '#3B89C7', // Blue
    '#663BC7', // Purple
    '#C73BB2', // Rose
    '#C73B3B', // Red
    '#C76F3B', // Orange
    '#3BC76E', // Green
];

export function getAuthorColor(index: number): string {
    const colorIndex = index % COLORS.length;
    return COLORS[colorIndex];
}

export function getAuthorHighlightColor(index: number): string {
    const colorIndex = index % COLORS.length;
    const color = COLORS[colorIndex];
    return chroma(color).brighten(0.2).hex();
}
