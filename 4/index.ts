// https://adventofcode.com/2025/day/4

import { cloneDeep } from 'es-toolkit';
import { type Coord, ProgramBase } from '../utils';

export default class Program extends ProgramBase {
    /**
     * Parse the input to a map
     */
    getMapFromInput(input: string[]): string[][] {
        return input.map((line) => line.split(''));
    }

    /**
     * Checks if the roll is accessible from the given coordinates.
     * It needs to have less than 4 rolls adjacent to it
     */
    isRollAccessible(y: number, x: number, map: string[][]): boolean {
        const adjacents = [
            map[y - 1]?.[x - 1],
            map[y - 1]?.[x],
            map[y - 1]?.[x + 1],
            map[y]?.[x - 1],
            map[y]?.[x + 1],
            map[y + 1]?.[x - 1],
            map[y + 1]?.[x],
            map[y + 1]?.[x + 1],
        ];

        // Check if there are less than 4 rolls adjacent to it
        return adjacents.filter((value) => value === '@').length < 4;
    }

    runPart1(input: string[]) {
        const map = this.getMapFromInput(input);
        let count = 0;

        // Loop through the map
        for (const [y, row] of map.entries()) {
            for (const [x, value] of row.entries()) {
                // Check if the roll is accessible
                if (value === '@' && this.isRollAccessible(y, x, map)) {
                    count += 1;
                }
            }
        }

        return count;
    }

    runPart2(input: string[]) {
        const map = this.getMapFromInput(input);
        let count = 0;
        let removedCoords: Coord[] = [];

        do {
            // Clone the current map
            const currentMap = cloneDeep(map);
            removedCoords = [];

            // Loop through the map
            for (const [y, row] of map.entries()) {
                for (const [x, value] of row.entries()) {
                    // Check if the roll can be removed
                    if (value === '@' && this.isRollAccessible(y, x, currentMap)) {
                        removedCoords.push({ x, y });
                    }
                }
            }

            // Remove the rolls
            for (const { x, y } of removedCoords) {
                map[y][x] = '.';
            }

            // Add removed rolls to the total count
            count += removedCoords.length;
        } while (removedCoords.length > 0);

        return count;
    }
}
