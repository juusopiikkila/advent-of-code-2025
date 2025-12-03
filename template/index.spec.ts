import Program from '.';
import { parseInputString } from '../utils';

describe('Day {day}', () => {
    let program: Program;

    beforeEach(() => {
        program = new Program();
    });

    describe('Part 1', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart1(parseInputString(`
                #input
            `));

            expect(output).toEqual(0);
        });
    });

    describe('Part 2', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart2(parseInputString(`
                #input
            `));

            expect(output).toEqual(1);
        });
    });
});
