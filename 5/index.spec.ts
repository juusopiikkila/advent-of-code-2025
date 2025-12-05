import Program from '.';
import { parseInputString } from '../utils';

describe('Day 5', () => {
    let program: Program;

    beforeEach(() => {
        program = new Program();
    });

    describe('getIngredientIdsAndRanges', () => {
        it('should parse ranges and ingredient IDs from input', () => {
            const input = parseInputString(`
                3-5
                10-14
                16-20
                12-18

                1
                5
                8
                11
                17
                32
            `);

            const result = program.getIngredientIdsAndRanges(input);

            expect(result.ranges).toEqual([
                { from: 3, to: 5 },
                { from: 10, to: 14 },
                { from: 16, to: 20 },
                { from: 12, to: 18 },
            ]);
            expect(result.ingredients).toEqual([1, 5, 8, 11, 17, 32]);
        });
    });

    describe('getFreshIngredients', () => {
        it('should filter ingredients that fall within ranges', () => {
            const ranges = [
                { from: 3, to: 5 },
                { from: 10, to: 14 },
            ];
            const ingredients = [1, 5, 8, 11, 17];

            const result = program.getFreshIngredients(ranges, ingredients);

            expect(result).toEqual([5, 11]);
        });
    });

    describe('createRangeEvents', () => {
        it('should create events map with +1 at start and -1 at end+1', () => {
            const ranges = [
                { from: 3, to: 5 },
                { from: 10, to: 14 },
            ];

            const events = program.createRangeEvents(ranges);

            expect(events.get(3)).toBe(1);
            expect(events.get(6)).toBe(-1);
            expect(events.get(10)).toBe(1);
            expect(events.get(15)).toBe(-1);
        });

        it('should merge events at same position', () => {
            const ranges = [
                { from: 10, to: 14 },
                { from: 12, to: 18 },
            ];

            const events = program.createRangeEvents(ranges);

            expect(events.get(10)).toBe(1);
            expect(events.get(12)).toBe(1);
            expect(events.get(15)).toBe(-1);
            expect(events.get(19)).toBe(-1);
        });
    });

    describe('getSortedEventPositions', () => {
        it('should return sorted array of event positions', () => {
            const events = new Map([
                [3, 1],
                [6, -1],
                [10, 1],
                [15, -1],
            ]);

            const positions = program.getSortedEventPositions(events);

            expect(positions).toEqual([3, 6, 10, 15]);
        });
    });

    describe('countUnionIntegers', () => {
        it('should count integers covered by single range', () => {
            const events = new Map([
                [3, 1],
                [6, -1],
            ]);
            const positions = [3, 6];

            const count = program.countUnionIntegers(events, positions);

            expect(count).toBe(3); // 3, 4, 5
        });

        it('should count integers in union of overlapping ranges', () => {
            const ranges = [
                { from: 3, to: 5 },
                { from: 10, to: 14 },
                { from: 16, to: 20 },
                { from: 12, to: 18 },
            ];
            const events = program.createRangeEvents(ranges);
            const positions = program.getSortedEventPositions(events);

            const count = program.countUnionIntegers(events, positions);

            expect(count).toBe(14); // 3,4,5,10,11,12,13,14,15,16,17,18,19,20
        });

        it('should handle adjacent ranges', () => {
            const ranges = [
                { from: 1, to: 3 },
                { from: 4, to: 6 },
            ];
            const events = program.createRangeEvents(ranges);
            const positions = program.getSortedEventPositions(events);

            const count = program.countUnionIntegers(events, positions);

            expect(count).toBe(6); // 1,2,3,4,5,6
        });
    });

    describe('Part 1', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart1(parseInputString(`
                3-5
                10-14
                16-20
                12-18

                1
                5
                8
                11
                17
                32
            `));

            expect(output).toEqual(3);
        });
    });

    describe('Part 2', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart2(parseInputString(`
                3-5
                10-14
                16-20
                12-18

                1
                5
                8
                11
                17
                32
            `));

            expect(output).toEqual(14);
        });
    });
});
