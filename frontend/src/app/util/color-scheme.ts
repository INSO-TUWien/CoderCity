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

export function getRandomNumber(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

export function getRandomDistrictColor(): string {
    const numColors = 5;
    const random = getRandomNumber(numColors);
    const scale = chroma.scale(['grey', 'black']).domain([0, numColors - 1]);
    return scale(random).hex();
}

export function getRandomBuildingColor(): string {
    const numColors = 50;
    const random = getRandomNumber(numColors);
    const scale = chroma.scale(chroma.brewer.YlGnBu).domain([0, numColors - 1]);
    return scale(random).hex();
}