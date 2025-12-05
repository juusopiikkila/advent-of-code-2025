// https://adventofcode.com/2025/day/5

import { ProgramBase } from '../utils';

interface Range {
    from: number
    to: number
}

export default class Program extends ProgramBase {
    /**
     * Extract fresh ingredient ranges and ingredient IDs from the input
     */
    getIngredientIdsAndRanges(input: string[]): { ranges: Range[]; ingredients: number[] } {
        const ranges: Range[] = [];
        const ingredients: number[] = [];

        const rangeRegex = /^\d+-\d+$/u;
        const numberRegex = /^\d+$/u;

        for (const line of input) {
            if (rangeRegex.test(line)) {
                const [from, to] = line.split('-');

                ranges.push({
                    from: Number(from),
                    to: Number(to),
                });
            } else if (numberRegex.test(line)) {
                ingredients.push(Number(line));
            }
        }

        return {
            ranges,
            ingredients,
        };
    }

    /**
     * Get fresh ingredient IDs based on the ranges
     */
    getFreshIngredients(ranges: Range[], ingredients: number[]): number[] {
        return ingredients.filter((item) => ranges.some(({ from, to }) => from <= item && to >= item));
    }

    /**
     * Create events map from ranges
     * Each range creates a +1 event at start and -1 event at end+1
     */
    createRangeEvents(ranges: Range[]): Map<number, number> {
        const events = new Map<number, number>();
        for (const { from, to } of ranges) {
            events.set(from, (events.get(from) ?? 0) + 1);
            events.set(to + 1, (events.get(to + 1) ?? 0) - 1);
        }

        return events;
    }

    /**
     * Get sorted event positions from events map
     */
    getSortedEventPositions(events: Map<number, number>): number[] {
        return Array.from(events.keys()).sort((a, b) => a - b);
    }

    /**
     * Count total unique integers covered by at least one range using sweep-line algorithm
     */
    countUnionIntegers(events: Map<number, number>, positions: number[]): number {
        let coverage = 0;
        let previous = positions[0];
        let count = 0;

        for (const pos of positions) {
            const segStart = previous;
            const segEnd = pos - 1;

            if (segStart <= segEnd && coverage > 0) {
                count += (segEnd - segStart + 1);
            }

            coverage += events.get(pos)!;
            previous = pos;
        }

        return count;
    }

    runPart1(input: string[]) {
        const { ranges, ingredients } = this.getIngredientIdsAndRanges(input);
        const freshIngredients = this.getFreshIngredients(ranges, ingredients);

        return freshIngredients.length;
    }

    runPart2(input: string[]) {
        const { ranges } = this.getIngredientIdsAndRanges(input);
        const events = this.createRangeEvents(ranges);
        const positions = this.getSortedEventPositions(events);

        return this.countUnionIntegers(events, positions);
    }
}
