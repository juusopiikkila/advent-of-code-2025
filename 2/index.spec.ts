import Program from '.';
import { parseInputString } from '../utils';

describe('Day 2', () => {
    let program: Program;

    beforeEach(() => {
        program = new Program();
    });

    describe('parseIdRanges', () => {
        it('should output ranges from input', () => {
            const output = program.parseIdRanges('11-22,95-115');

            expect(output).toEqual([
                { from: 11, to: 22 },
                { from: 95, to: 115 },
            ]);
        });
    });

    describe('getInvalidIds', () => {
        it('should return [11,22] for range 11-22', () => {
            expect(program.getInvalidIds({ from: 11, to: 22 })).toEqual([11, 22]);
        });

        it('should return [99] for range 95-115', () => {
            expect(program.getInvalidIds({ from: 95, to: 115 })).toEqual([99]);
        });

        it('should return [1010] for range 998-1012', () => {
            expect(program.getInvalidIds({ from: 998, to: 1012 })).toEqual([1010]);
        });

        it('should return [1188511885] for range 1188511880-1188511890', () => {
            expect(program.getInvalidIds({ from: 1_188_511_880, to: 1_188_511_890 })).toEqual([1_188_511_885]);
        });

        it('should return [222222] for range 222220-222224', () => {
            expect(program.getInvalidIds({ from: 222_220, to: 222_224 })).toEqual([222_222]);
        });

        it('should return [] for range 1698522-1698528', () => {
            expect(program.getInvalidIds({ from: 1_698_522, to: 1_698_528 })).toEqual([]);
        });

        it('should return [446446] for range 446443-446449', () => {
            expect(program.getInvalidIds({ from: 446_443, to: 446_449 })).toEqual([446_446]);
        });

        it('should return [38593859] for range 38593856-38593862', () => {
            expect(program.getInvalidIds({ from: 38_593_856, to: 38_593_862 })).toEqual([38_593_859]);
        });
    });

    describe('Part 1', () => {
        it('should return 1227775554', () => {
            const output = program.runPart1(parseInputString(`
                11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124
            `));

            expect(output).toEqual(1_227_775_554);
        });
    });

    describe('getInvalidIds (lax)', () => {
        it('should return [11,22] for range 11-22', () => {
            expect(program.getInvalidIds({ from: 11, to: 22 }, true)).toEqual([11, 22]);
        });

        it('should return [99] for range 95-115', () => {
            expect(program.getInvalidIds({ from: 95, to: 115 }, true)).toEqual([99, 111]);
        });

        it('should return [1010] for range 998-1012', () => {
            expect(program.getInvalidIds({ from: 998, to: 1012 }, true)).toEqual([999, 1010]);
        });

        it('should return [1188511885] for range 1188511880-1188511890', () => {
            expect(program.getInvalidIds({ from: 1_188_511_880, to: 1_188_511_890 }, true)).toEqual([1_188_511_885]);
        });

        it('should return [222222] for range 222220-222224', () => {
            expect(program.getInvalidIds({ from: 222_220, to: 222_224 }, true)).toEqual([222_222]);
        });

        it('should return [] for range 1698522-1698528', () => {
            expect(program.getInvalidIds({ from: 1_698_522, to: 1_698_528 }, true)).toEqual([]);
        });

        it('should return [446446] for range 446443-446449', () => {
            expect(program.getInvalidIds({ from: 446_443, to: 446_449 }, true)).toEqual([446_446]);
        });

        it('should return [38593859] for range 38593856-38593862', () => {
            expect(program.getInvalidIds({ from: 38_593_856, to: 38_593_862 }, true)).toEqual([38_593_859]);
        });

        it('should return [565656] for range 565653-565659', () => {
            expect(program.getInvalidIds({ from: 565_653, to: 565_659 }, true)).toEqual([565_656]);
        });

        it('should return [824824824] for range 824824821-824824827', () => {
            expect(program.getInvalidIds({ from: 824_824_821, to: 824_824_827 }, true)).toEqual([824_824_824]);
        });

        it('should return [2121212121] for range 2121212118-2121212124', () => {
            expect(program.getInvalidIds({ from: 2_121_212_118, to: 2_121_212_124 }, true)).toEqual([2_121_212_121]);
        });
    });

    describe('Part 2', () => {
        it('should return 4174379265', () => {
            const output = program.runPart2(parseInputString(`
                11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124
            `));

            expect(output).toEqual(4_174_379_265);
        });
    });
});
