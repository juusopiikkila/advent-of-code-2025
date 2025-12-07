// https://adventofcode.com/2025/day/7

import { ProgramBase } from '../utils';

export default class Program extends ProgramBase {
    parseInputToMap(input: string[]): string[][] {
        return input.map((line) => [...line]);
    }

    /**
     * Check if S is on top
     */
    isStartOnTop(map: string[][], y: number, x: number): boolean {
        return map[y - 1]?.[x] === 'S';
    }

    /**
     * Check if beam is in top
     */
    isBeamOnTop(map: string[][], y: number, x: number): boolean {
        return map[y - 1]?.[x] === '|';
    }

    /**
     * Check if splitter can split the beam
     */
    canSplitBeam(map: string[][], y: number, x: number): boolean {
        return map[y - 1]?.[x] === '|';
    }

    /**
     * Run beams through the map
     */
    runBeams(map: string[][]) {
        let splitCount = 0;

        for (const [y, row] of map.entries()) {
            for (const [x, cell] of row.entries()) {
                if (cell === '.' && (this.isStartOnTop(map, y, x) || this.isBeamOnTop(map, y, x))) {
                    map[y][x] = '|';
                }

                if (cell === '^' && this.canSplitBeam(map, y, x)) {
                    if (map[y][x - 1] === '.') {
                        map[y][x - 1] = '|';
                    }

                    if (map[y][x + 1] === '.') {
                        map[y][x + 1] = '|';
                    }

                    splitCount += 1;
                }
            }
        }

        return {
            map,
            splitCount,
        };
    }

    /**
     * Process a splitter cell (^) and update path counts
     */
    processSplitter(x: number, currentCount: number, nextCounts: Map<number, number>): void {
        nextCounts.set(x - 1, (nextCounts.get(x - 1) || 0) + currentCount);
        nextCounts.set(x + 1, (nextCounts.get(x + 1) || 0) + currentCount);
    }

    /**
     * Process a beam cell (|) and update path counts
     */
    processBeam(
        x: number,
        y: number,
        currentCount: number,
        beamedMap: string[][],
        nextCounts: Map<number, number>,
    ): void {
        if (this.isStartOnTop(beamedMap, y, x)) {
            nextCounts.set(x, (nextCounts.get(x) || 0) + 1);
        } else if (beamedMap[y - 1]?.[x] === '|') {
            nextCounts.set(x, (nextCounts.get(x) || 0) + currentCount);
        }
    }

    /**
     * Count total paths from all endpoints
     */
    countTotalPaths(pathCounts: Map<number, number>): number {
        return [...pathCounts.values()].reduce((total, count) => total + count, 0);
    }

    runPart1(input: string[]) {
        const map = this.parseInputToMap(input);
        const { splitCount } = this.runBeams(map);

        return splitCount;
    }

    runPart2(input: string[]) {
        const map = this.parseInputToMap(input);
        const { map: beamedMap } = this.runBeams(map);
        let pathCounts = new Map<number, number>();

        for (const [y, row] of beamedMap.entries()) {
            const nextCounts = new Map<number, number>();

            for (const [x, cell] of row.entries()) {
                const count = pathCounts.get(x) || 0;

                if (cell === '^' && beamedMap[y - 1]?.[x] === '|') {
                    this.processSplitter(x, count, nextCounts);
                }

                if (cell === '|') {
                    this.processBeam(x, y, count, beamedMap, nextCounts);
                }
            }

            pathCounts = nextCounts;
        }

        return this.countTotalPaths(pathCounts);
    }
}
