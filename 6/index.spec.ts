import Program from '.';
import { parseInputString } from '../utils';

describe('Day 6', () => {
    let program: Program;

    beforeEach(() => {
        program = new Program();
    });

    describe('getColumnsFromInput', () => {
        it('should parse columns correctly', () => {
            const output = program.getColumnsFromInput(parseInputString(`
                123 328  51 64
                 45 64  387 23
                  6 98  215 314
                *   +   *   +
            `));

            expect(output).toEqual([
                { operator: '*', numbers: [123, 45, 6] },
                { operator: '+', numbers: [328, 64, 98] },
                { operator: '*', numbers: [51, 387, 215] },
                { operator: '+', numbers: [64, 23, 314] },
            ]);
        });

        it('should handle single column', () => {
            const output = program.getColumnsFromInput(parseInputString(`
                10
                20
                30
                +
            `));

            expect(output).toEqual([
                { operator: '+', numbers: [10, 20, 30] },
            ]);
        });

        it('should handle single row', () => {
            const output = program.getColumnsFromInput(parseInputString(`
                5 10 15
                + * +
            `));

            expect(output).toEqual([
                { operator: '+', numbers: [5] },
                { operator: '*', numbers: [10] },
                { operator: '+', numbers: [15] },
            ]);
        });
    });

    describe('getColumnResult', () => {
        it('should multiply numbers when operator is *', () => {
            const output = program.getColumnResult({
                operator: '*',
                numbers: [10, 5, 2],
            });

            expect(output).toEqual(100);
        });

        it('should add numbers when operator is +', () => {
            const output = program.getColumnResult({
                operator: '+',
                numbers: [10, 5, 2],
            });

            expect(output).toEqual(17);
        });

        it('should handle single number with multiplication', () => {
            const output = program.getColumnResult({
                operator: '*',
                numbers: [42],
            });

            expect(output).toEqual(42);
        });

        it('should handle single number with addition', () => {
            const output = program.getColumnResult({
                operator: '+',
                numbers: [42],
            });

            expect(output).toEqual(42);
        });

        it('should handle zeros in multiplication', () => {
            const output = program.getColumnResult({
                operator: '*',
                numbers: [5, 0, 3],
            });

            expect(output).toEqual(0);
        });

        it('should handle zeros in addition', () => {
            const output = program.getColumnResult({
                operator: '+',
                numbers: [5, 0, 3],
            });

            expect(output).toEqual(8);
        });
    });

    describe('getRightToLeftColumnsFromInput', () => {
        it('should parse right-to-left columns correctly', () => {
            const output = program.getRightToLeftColumnsFromInput(parseInputString(`
                123 328  51 64
                 45 64  387 23
                  6 98  215 314
                *   +   *   +
            `));

            expect(output).toEqual([
                { operator: '*', numbers: [356, 24, 1] },
                { operator: '+', numbers: [8, 248, 369] },
                { operator: '*', numbers: [175, 581, 32] },
                { operator: '+', numbers: [4, 431, 623] },
            ]);
        });

        it('should throw error when no operators found', () => {
            expect(() => {
                program.getRightToLeftColumnsFromInput(['123', '456', '']);
            }).toThrow('No operators found');
        });

        it('should handle two columns with different spacing', () => {
            const output = program.getRightToLeftColumnsFromInput(parseInputString(`
                12 345
                67 890
                *  +
            `));

            expect(output).toHaveLength(2);
            expect(output[0].operator).toBe('*');
            expect(output[1].operator).toBe('+');
        });

        it('should handle multiple operators in sequence', () => {
            const output = program.getRightToLeftColumnsFromInput(parseInputString(`
                1 2 3 4 5
                6 7 8 9 0
                * + * + *
            `));

            expect(output).toHaveLength(5);
            expect(output.map((column) => column.operator)).toEqual(['*', '+', '*', '+', '*']);
        });
    });

    describe('Part 1', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart1(parseInputString(`
                123 328  51 64
                 45 64  387 23
                  6 98  215 314
                *   +   *   +
            `));

            expect(output).toEqual(4_277_556);
        });
    });

    describe('Part 2', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart2(parseInputString(`
                123 328  51 64
                 45 64  387 23
                  6 98  215 314
                *   +   *   +
            `));

            expect(output).toEqual(3_263_827);
        });
    });
});
