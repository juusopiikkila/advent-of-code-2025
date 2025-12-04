import Program from '.';
import { parseInputString } from '../utils';

describe('Day 4', () => {
    let program: Program;

    beforeEach(() => {
        program = new Program();
    });

    describe('getMapFromInput', () => {
        it('should convert input lines to a 2D char array', () => {
            const input = ['..@', '@.@'];
            const map = program.getMapFromInput(input);

            expect(map).toEqual([
                ['.', '.', '@'],
                ['@', '.', '@'],
            ]);
        });
    });

    describe('isRollAccessible', () => {
        it('should return true when adjacent rolls < 4', () => {
            const map = [
                ['.', '@', '.'],
                ['@', '@', '@'],
                ['.', '.', '.'],
            ];

            // center (1,1) has 3 adjacent '@' -> accessible
            expect(program.isRollAccessible(1, 1, map)).toBe(true);
        });

        it('should return false when adjacent rolls >= 4', () => {
            const map = [
                ['.', '@', '.'],
                ['@', '@', '@'],
                ['.', '@', '.'],
            ];

            // center (1,1) has 4 adjacent '@' -> not accessible
            expect(program.isRollAccessible(1, 1, map)).toBe(false);
        });

        it('should handle edges without throwing', () => {
            const map = [['@', '.'], ['.', '.']];

            // corner (0,0) has no adjacent '@' (out of bounds are ignored)
            expect(program.isRollAccessible(0, 0, map)).toBe(true);
        });
    });

    describe('Part 1', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart1(parseInputString(`
                ..@@.@@@@.
                @@@.@.@.@@
                @@@@@.@.@@
                @.@@@@..@.
                @@.@@@@.@@
                .@@@@@@@.@
                .@.@.@.@@@
                @.@@@.@@@@
                .@@@@@@@@.
                @.@.@@@.@.
            `));

            expect(output).toEqual(13);
        });
    });

    describe('Part 2', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart2(parseInputString(`
                ..@@.@@@@.
                @@@.@.@.@@
                @@@@@.@.@@
                @.@@@@..@.
                @@.@@@@.@@
                .@@@@@@@.@
                .@.@.@.@@@
                @.@@@.@@@@
                .@@@@@@@@.
                @.@.@@@.@.
            `));

            expect(output).toEqual(43);
        });
    });
});
