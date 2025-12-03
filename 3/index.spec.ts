import Program from '.';
import { parseInputString } from '../utils';

describe('Day 3', () => {
    let program: Program;

    beforeEach(() => {
        program = new Program();
    });

    describe('getBanks', () => {
        it('should parse input to numbers', () => {
            const output = program.getBanks([
                '112233',
                '223344',
            ]);

            expect(output).toEqual([
                [1, 1, 2, 2, 3, 3],
                [2, 2, 3, 3, 4, 4],
            ]);
        });
    });

    describe('getHighestValue', () => {
        it('should get the highest value from bank', () => {
            const output = program.getHighestValue([1, 2, 4, 3, 0]);

            expect(output).toEqual(4);
        });

        it('should throw if the bank is empty', () => {
            expect(() => program.getHighestValue([])).toThrow('No numbers!');
        });
    });

    describe('getHighestBatteries', () => {
        it('should return 98 for 987654321111111', () => {
            const output = program.getHighestBatteries([9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1]);

            expect(output).toEqual(98);
        });

        it('should return 89 for 811111111111119', () => {
            const output = program.getHighestBatteries([8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9]);

            expect(output).toEqual(89);
        });

        it('should return 78 for 234234234234278', () => {
            const output = program.getHighestBatteries([2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 7, 8]);

            expect(output).toEqual(78);
        });

        it('should return 92 for 818181911112111', () => {
            const output = program.getHighestBatteries([8, 1, 8, 1, 8, 1, 9, 1, 1, 1, 1, 2, 1, 1, 1]);

            expect(output).toEqual(92);
        });
    });

    describe('Part 1', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart1(parseInputString(`
                987654321111111
                811111111111119
                234234234234278
                818181911112111
            `));

            expect(output).toEqual(357);
        });
    });

    describe('getHighestPermutation', () => {
        it('should throw if bank length is less than max length', () => {
            expect(() => program.getHighestPermutation([1, 2, 3])).toThrow('Bank does not contain enough numbers to form permutation');
        });

        it('should return 987654321111 for 987654321111111', () => {
            const output = program.getHighestPermutation([9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1]);

            expect(output).toEqual(987_654_321_111);
        });

        it('should return 811111111119 for 811111111111119', () => {
            const output = program.getHighestPermutation([8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9]);

            expect(output).toEqual(811_111_111_119);
        });

        it('should return 434234234278 for 234234234234278', () => {
            const output = program.getHighestPermutation([2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 7, 8]);

            expect(output).toEqual(434_234_234_278);
        });

        it('should return 888911112111 for 818181911112111', () => {
            const output = program.getHighestPermutation([8, 1, 8, 1, 8, 1, 9, 1, 1, 1, 1, 2, 1, 1, 1]);

            expect(output).toEqual(888_911_112_111);
        });
    });

    describe('Part 2', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart2(parseInputString(`
                987654321111111
                811111111111119
                234234234234278
                818181911112111
            `));

            expect(output).toEqual(3_121_910_778_619);
        });
    });
});
