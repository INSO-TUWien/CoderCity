import * as chroma from 'chroma-js';

const BRANCH_COLORS: string[] = [
    '#3BC4C7', // Teal
    '#3B89C7', // Blue
    '#663BC7', // Purple
    '#C73BB2', // Rose
    '#C73B3B', // Red
    '#C76F3B', // Orange
    '#3BC76E', // Green
];

export function getBranchColor(index: number): string {
    const colorIndex = index % BRANCH_COLORS.length;
    return BRANCH_COLORS[colorIndex];
}

export function getBranchHighlightColor(index: number): string {
    const colorIndex = index % BRANCH_COLORS.length;
    const color = BRANCH_COLORS[colorIndex];
    return chroma(color).brighten(0.2).hex();
}
