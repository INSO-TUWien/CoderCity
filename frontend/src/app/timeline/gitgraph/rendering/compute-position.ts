import { COMMIT_CIRCLE_DISTANCE } from './gitgraph-constants';

export interface GridPosition {
    x: number;
    y: number;
}

export interface PixelPosition {
    x: number;
    y: number;
}

export interface Boundary {
    height: number;
    width: number;
}


/**
 * Computes x and y positions for commit circles / merge circles.
 */
export function computeMergeCommitCirclePosition(gridPosition: GridPosition): PixelPosition {
    const circleX = 10 + gridPosition.x * COMMIT_CIRCLE_DISTANCE;
    const circleY = 10 + gridPosition.y * 25;
    return { x: circleX, y: circleY };
}

export function computeCommitCirclePosition(gridPosition: GridPosition): PixelPosition {
    const circleX = 10 + gridPosition.x * COMMIT_CIRCLE_DISTANCE;
    const circleY = 10 + gridPosition.y * 25;
    return { x: circleX, y: circleY };
}

/**
 * Calculates the dimensions of the svg container in width / height
 * @param commitsCount 
 * @param branchesCount 
 */
export function computeDimensions(commitsCount: number, branchesCount: number): Boundary {
    if (commitsCount < 0) {
        console.error(`computeBoundaries: Invalid parameter commitsCount`);
        return null;
    }

    const width = 10 + commitsCount * COMMIT_CIRCLE_DISTANCE;
    const height = 10 + branchesCount * 25;
    return { height, width };
}