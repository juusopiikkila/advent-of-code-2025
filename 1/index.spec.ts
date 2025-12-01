import Program from '.';
import { parseInputString } from '../utils';

describe('Day 1', () => {
    let program: Program;

    beforeEach(() => {
        program = new Program();
    });

    describe('getRotations', () => {
        it('should parse input', () => {
            const output = program.getRotations([
                'L10',
                'R234',
                'L1',
            ]);

            expect(output).toEqual([
                { direction: 'L', amount: 10 },
                { direction: 'R', amount: 234 },
                { direction: 'L', amount: 1 },
            ]);
        });
    });

    describe('rotate', () => {
        it('should rotate to 19 (R8 from 11)', () => {
            const output = program.rotate(11, 8, 'R');

            expect(output.result).toEqual(19);
        });

        it('should rotate to 0 (L19 from 19)', () => {
            const output = program.rotate(19, 19, 'L');

            expect(output.result).toEqual(0);
        });

        it('should rotate to 99 (L1 from 0)', () => {
            const output = program.rotate(0, 1, 'L');

            expect(output.result).toEqual(99);
        });

        it('should rotate to 95 (L10 from 5)', () => {
            const output = program.rotate(5, 10, 'L');

            expect(output.result).toEqual(95);
        });

        it('should count 2 zeroes (R190 from 5)', () => {
            const output = program.rotate(5, 195, 'R', true);

            expect(output.zeroes).toEqual(2);
        });

        it('should count 3 zeroes (L210 from 5)', () => {
            const output = program.rotate(5, 205, 'L', true);

            expect(output.zeroes).toEqual(3);
        });

        it('should handle no movement (amount = 0)', () => {
            const output = program.rotate(42, 0, 'R');

            expect(output.result).toEqual(42);
            expect(output.zeroes).toEqual(0);
        });

        it('should rotate exactly 100 to same position (R100 from 25)', () => {
            const output = program.rotate(25, 100, 'R');

            expect(output.result).toEqual(25);
            expect(output.zeroes).toEqual(0);
        });

        it('should rotate exactly 100 to same position (L100 from 75)', () => {
            const output = program.rotate(75, 100, 'L');

            expect(output.result).toEqual(75);
            expect(output.zeroes).toEqual(0);
        });

        it('should rotate to 0 (R95 from 5)', () => {
            const output = program.rotate(5, 95, 'R');

            expect(output.result).toEqual(0);
            expect(output.zeroes).toEqual(1);
        });

        it('should rotate to 1 (R96 from 5)', () => {
            const output = program.rotate(5, 96, 'R');

            expect(output.result).toEqual(1);
            expect(output.zeroes).toEqual(0);
        });

        it('should rotate from 99 right without extra count', () => {
            const output = program.rotate(99, 1, 'R');

            expect(output.result).toEqual(0);
            expect(output.zeroes).toEqual(1);
        });

        it('should rotate from 99 right by 2', () => {
            const output = program.rotate(99, 2, 'R');

            expect(output.result).toEqual(1);
            expect(output.zeroes).toEqual(0);
        });

        it('should rotate from 0 left without counting', () => {
            const output = program.rotate(0, 5, 'L');

            expect(output.result).toEqual(95);
            expect(output.zeroes).toEqual(0);
        });

        it('should handle large rotation (R500 from 30)', () => {
            const output = program.rotate(30, 500, 'R', true);

            expect(output.result).toEqual(30);
            expect(output.zeroes).toEqual(5);
        });

        it('should handle even larger rotation (R1000 from 50)', () => {
            const output = program.rotate(50, 1000, 'R', true);

            expect(output.result).toEqual(50);
            expect(output.zeroes).toEqual(10);
        });

        it('should handle large rotation (L300 from 10)', () => {
            const output = program.rotate(10, 300, 'L', true);

            expect(output.result).toEqual(10);
            expect(output.zeroes).toEqual(3);
        });

        it('should count intermediate zeroes (R50 from 60)', () => {
            const output = program.rotate(60, 50, 'R', true);

            expect(output.result).toEqual(10);
            expect(output.zeroes).toEqual(1);
        });

        it('should count intermediate zeroes (L70 from 30)', () => {
            const output = program.rotate(30, 70, 'L', true);

            expect(output.result).toEqual(60);
            expect(output.zeroes).toEqual(1);
        });

        it('should not count intermediate on non-wrapping move (R10 from 20)', () => {
            const output = program.rotate(20, 10, 'R', true);

            expect(output.result).toEqual(30);
            expect(output.zeroes).toEqual(0);
        });

        it('should not count intermediate on non-wrapping move (L10 from 50)', () => {
            const output = program.rotate(50, 10, 'L', true);

            expect(output.result).toEqual(40);
            expect(output.zeroes).toEqual(0);
        });

        it('should handle landing on 0 from 99 going right', () => {
            const output = program.rotate(99, 101, 'R', true);

            expect(output.result).toEqual(0);
            expect(output.zeroes).toEqual(2);
        });

        it('should handle starting and ending at different positions with multiple wraps', () => {
            const output = program.rotate(15, 250, 'L', true);

            expect(output.result).toEqual(65);
            expect(output.zeroes).toEqual(3);
        });

        // Tests specifically for the bug fix - scenarios where the old "hundreds" logic failed
        it('should count crossing when going left from position near zero (L95 from 5)', () => {
            const output = program.rotate(5, 95, 'L', true);

            expect(output.result).toEqual(10);
            expect(output.zeroes).toEqual(1); // Crosses 0 once
        });

        it('should count correct zeroes when amount < 100 but crosses zero (L50 from 30)', () => {
            const output = program.rotate(30, 50, 'L', true);

            expect(output.result).toEqual(80);
            expect(output.zeroes).toEqual(1); // Old logic would give 0 (floor(50/100)=0, from>0 && result!=0)
        });

        it('should count correct zeroes when going left and wrapping exactly once (L110 from 20)', () => {
            const output = program.rotate(20, 110, 'L', true);

            expect(output.result).toEqual(10);
            expect(output.zeroes).toEqual(1); // Crosses 0 once (at step 20)
        });

        it('should count zero crossings when going right and wrapping (R80 from 50)', () => {
            const output = program.rotate(50, 80, 'R', true);

            expect(output.result).toEqual(30);
            expect(output.zeroes).toEqual(1); // Crosses 0 once (50+80=130, floor(130/100)=1)
        });

        it('should correctly handle left rotation starting exactly at position 9 (L109 from 9)', () => {
            const output = program.rotate(9, 109, 'L', true);

            expect(Math.abs(output.result)).toEqual(0); // Handle -0 vs 0
            expect(output.zeroes).toEqual(2); // Crosses at step 9 (reaching 0), then at step 109 (landing on 0)
        });

        it('should handle edge case of small left rotation from position 1 (L2 from 1)', () => {
            const output = program.rotate(1, 2, 'L', true);

            expect(output.result).toEqual(99);
            expect(output.zeroes).toEqual(1); // Crosses 0 once (after step 1)
        });

        it('should handle rotation that crosses zero multiple times going right (R550 from 70)', () => {
            const output = program.rotate(70, 550, 'R', true);

            expect(output.result).toEqual(20);
            expect(output.zeroes).toEqual(6); // floor((70+550)/100) = floor(620/100) = 6
        });
    });

    describe('runPart1', () => {
        it('should return 3', () => {
            const output = program.runPart1(parseInputString(`
                L68
                L30
                R48
                L5
                R60
                L55
                L1
                L99
                R14
                L82
            `));

            expect(output).toEqual(3);
        });
    });

    describe('Part 2', () => {
        it('should return 6', () => {
            const output = program.runPart2(parseInputString(`
                L68
                L30
                R48
                L5
                R60
                L55
                L1
                L99
                R14
                L82
            `));

            expect(output).toEqual(6);
        });
    });
});
