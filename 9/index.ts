// https://adventofcode.com/2025/day/9

import { type Coord, ProgramBase } from '../utils';

export default class Program extends ProgramBase {
    /**
     * Parse input strings in "x,y" format to Coord objects.
     */
    parseInputToCoords(input: string[]): Coord[] {
        return input.map<Coord>((line) => {
            const [x, y] = line.split(',').map(Number);

            return { x, y };
        });
    }

    /**
     * Calculate the area of a box defined by two corner coordinates.
     * Area is (width + 1) × (height + 1) to include both endpoints.
     */
    getBoxSize(coord1: Coord, coord2: Coord): number {
        const width = Math.abs(coord1.x - coord2.x);
        const height = Math.abs(coord1.y - coord2.y);

        return (width + 1) * (height + 1);
    }

    /**
     * Generate all possible boxes from pairs of coordinates.
     * Returns boxes sorted by size (largest first).
     */
    getBoxes(coords: Coord[]): Array<{ from: Coord; to: Coord; size: number }> {
        const boxes: Record<string, { from: Coord; to: Coord; size: number }> = {};

        for (const [index, coord] of coords.entries()) {
            for (const otherCoord of coords.slice(index + 1)) {
                const coordsKey = [
                    `${coord.x}.${coord.y}`,
                    `${otherCoord.x}.${otherCoord.y}`,
                ].sort().join(':');

                boxes[coordsKey] = {
                    from: coord,
                    to: otherCoord,
                    size: this.getBoxSize(coord, otherCoord),
                };
            }
        }

        return Object.values(boxes).sort((a, b) => b.size - a.size);
    }

    /**
     * Find the largest possible box from any pair of coordinates.
     */
    runPart1(input: string[]) {
        const coords = this.parseInputToCoords(input);
        const boxes = this.getBoxes(coords);

        return boxes[0].size;
    }

    /**
     * Ray-casting algorithm to determine if a point is inside a polygon.
     * Casts a horizontal ray from the point to the right and counts edge crossings.
     * Odd number of crossings = inside, even = outside.
     */
    isPointInPolygon(point: Coord, polygon: Coord[]): boolean {
        let inside = false;
        const count = polygon.length;

        for (let index = 0; index < count; index++) {
            const current = polygon[index];
            const next = polygon[(index + 1) % count];

            if ((current.y <= point.y && point.y < next.y)
                || (next.y <= point.y && point.y < current.y)) {
                const xIntersection = current.x + ((point.y - current.y) * (next.x - current.x)) / (next.y - current.y);

                if (xIntersection > point.x) {
                    inside = !inside;
                }
            }
        }

        return inside;
    }

    /**
     * Check if an integer coordinate is inside or on the polygon boundary.
     * Vertices are always valid. For other points, tests multiple offset directions
     * to handle edge cases like exterior corners.
     */
    isCoordInsideOrOnBoundary(x: number, y: number, polygon: Coord[]): boolean {
        // Vertices (red tiles) are always valid
        if (polygon.some((point) => point.x === x && point.y === y)) {
            return true;
        }

        const epsilon = 0.01;
        const testOffsets = [
            { x: epsilon, y: epsilon },
            { x: -epsilon, y: epsilon },
            { x: epsilon, y: -epsilon },
            { x: -epsilon, y: -epsilon },
        ];

        // If any offset direction is inside, the coordinate is valid
        return testOffsets.some((offset) => this.isPointInPolygon(
            { x: x + offset.x, y: y + offset.y },
            polygon,
        ));
    }

    /**
     * Check if a box fits completely inside the polygon.
     * Uses optimized sampling: checks corners, center, and edge points at intervals.
     * This is much faster than checking every single coordinate in large boxes.
     */
    isBoxInsidePolygon(corner1: Coord, corner2: Coord, polygon: Coord[]): boolean {
        const minX = Math.min(corner1.x, corner2.x);
        const maxX = Math.max(corner1.x, corner2.x);
        const minY = Math.min(corner1.y, corner2.y);
        const maxY = Math.max(corner1.y, corner2.y);

        // Test all four corners first (quick rejection)
        const corners = [
            { x: minX, y: minY },
            { x: maxX, y: minY },
            { x: maxX, y: maxY },
            { x: minX, y: maxY },
        ];

        if (!corners.every((corner) => this.isCoordInsideOrOnBoundary(
            corner.x,
            corner.y,
            polygon,
        ))) {
            return false;
        }

        // Test center point
        const centerX = Math.floor((minX + maxX) / 2);
        const centerY = Math.floor((minY + maxY) / 2);

        if (!this.isCoordInsideOrOnBoundary(centerX, centerY, polygon)) {
            return false;
        }

        // Sample points along edges to detect polygon boundaries
        const width = maxX - minX;
        const height = maxY - minY;
        const sampleInterval = Math.max(
            1,
            Math.min(Math.floor(width / 5), Math.floor(height / 5), 10),
        );

        // Top and bottom edges
        for (let x = minX; x <= maxX; x += sampleInterval) {
            if (
                !this.isCoordInsideOrOnBoundary(x, minY, polygon)
                || !this.isCoordInsideOrOnBoundary(x, maxY, polygon)
            ) {
                return false;
            }
        }

        // Left and right edges
        for (let y = minY; y <= maxY; y += sampleInterval) {
            if (
                !this.isCoordInsideOrOnBoundary(minX, y, polygon)
                || !this.isCoordInsideOrOnBoundary(maxX, y, polygon)
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Find the largest rectangle using only red and green tiles.
     * Red tiles are at the input coordinates (polygon vertices).
     * Green tiles are inside or on the polygon boundary.
     * Returns the area of the largest valid rectangle.
     */
    runPart2(input: string[]) {
        const coords = this.parseInputToCoords(input);
        const boxes = this.getBoxes(coords);

        // Boxes are sorted by size (largest first), so return first valid box
        for (const box of boxes) {
            if (this.isBoxInsidePolygon(box.from, box.to, coords)) {
                return box.size;
            }
        }

        return 0;
    }
}
