import Program from '.';
import { parseInputString } from '../utils';

describe('Day 7', () => {
    let program: Program;

    beforeEach(() => {
        program = new Program();
    });

    describe('parseInputToMap', () => {
        it('should parse input strings to a 2D character array', () => {
            const input = ['..S..', '..|..', '..^..'];
            const result = program.parseInputToMap(input);

            expect(result).toEqual([
                ['.', '.', 'S', '.', '.'],
                ['.', '.', '|', '.', '.'],
                ['.', '.', '^', '.', '.'],
            ]);
        });
    });

    describe('isStartOnTop', () => {
        it('should return true when S is directly above', () => {
            const map = [['S'], ['.']];
            expect(program.isStartOnTop(map, 1, 0)).toBe(true);
        });

        it('should return false when S is not above', () => {
            const map = [['.'], ['.']];
            expect(program.isStartOnTop(map, 1, 0)).toBe(false);
        });

        it('should return false when at top row', () => {
            const map = [['S']];
            expect(program.isStartOnTop(map, 0, 0)).toBe(false);
        });
    });

    describe('isBeamOnTop', () => {
        it('should return true when beam is directly above', () => {
            const map = [['|'], ['.']];
            expect(program.isBeamOnTop(map, 1, 0)).toBe(true);
        });

        it('should return false when beam is not above', () => {
            const map = [['.'], ['.']];
            expect(program.isBeamOnTop(map, 1, 0)).toBe(false);
        });
    });

    describe('canSplitBeam', () => {
        it('should return true when beam is directly above', () => {
            const map = [['|'], ['^']];
            expect(program.canSplitBeam(map, 1, 0)).toBe(true);
        });

        it('should return false when no beam above', () => {
            const map = [['.'], ['^']];
            expect(program.canSplitBeam(map, 1, 0)).toBe(false);
        });
    });

    describe('processSplitter', () => {
        it('should split path count to left and right positions', () => {
            const nextCounts = new Map<number, number>();
            program.processSplitter(5, 3, nextCounts);

            expect(nextCounts.get(4)).toBe(3);
            expect(nextCounts.get(6)).toBe(3);
        });

        it('should accumulate counts when positions already exist', () => {
            const nextCounts = new Map<number, number>([[4, 2], [6, 1]]);
            program.processSplitter(5, 3, nextCounts);

            expect(nextCounts.get(4)).toBe(5);
            expect(nextCounts.get(6)).toBe(4);
        });
    });

    describe('processBeam', () => {
        it('should initialize count to 1 when start is on top', () => {
            const map = [['S'], ['|']];
            const nextCounts = new Map<number, number>();
            program.processBeam(0, 1, 0, map, nextCounts);

            expect(nextCounts.get(0)).toBe(1);
        });

        it('should continue beam down when beam is above', () => {
            const map = [['|'], ['|']];
            const nextCounts = new Map<number, number>();
            program.processBeam(0, 1, 5, map, nextCounts);

            expect(nextCounts.get(0)).toBe(5);
        });

        it('should accumulate counts when position already has count', () => {
            const map = [['|'], ['|']];
            const nextCounts = new Map<number, number>([[0, 3]]);
            program.processBeam(0, 1, 2, map, nextCounts);

            expect(nextCounts.get(0)).toBe(5);
        });
    });

    describe('countTotalPaths', () => {
        it('should sum all path counts', () => {
            const pathCounts = new Map<number, number>([[1, 5], [3, 10], [7, 3]]);
            expect(program.countTotalPaths(pathCounts)).toBe(18);
        });

        it('should return 0 for empty map', () => {
            const pathCounts = new Map<number, number>();
            expect(program.countTotalPaths(pathCounts)).toBe(0);
        });

        it('should handle single path', () => {
            const pathCounts = new Map<number, number>([[0, 42]]);
            expect(program.countTotalPaths(pathCounts)).toBe(42);
        });
    });

    describe('runBeams', () => {
        it('should mark empty cells as beams when start is above', () => {
            const map = program.parseInputToMap(['S', '.', '.']);
            const result = program.runBeams(map);

            expect(result.map[1][0]).toBe('|');
            expect(result.map[2][0]).toBe('|');
        });

        it('should split beams at splitters', () => {
            const map = program.parseInputToMap(['.S.', '.|.', '.^.', '...']);
            const result = program.runBeams(map);

            expect(result.map[3][0]).toBe('|');
            expect(result.map[3][2]).toBe('|');
            expect(result.splitCount).toBe(1);
        });

        it('should count multiple splits', () => {
            const map = program.parseInputToMap([
                '.S.',
                '.|.',
                '.^.',
                '...',
                '^.^',
            ]);
            const result = program.runBeams(map);

            expect(result.splitCount).toBe(3);
        });
    });

    describe('Part 1', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart1(parseInputString(`
                .......S.......
                ...............
                .......^.......
                ...............
                ......^.^......
                ...............
                .....^.^.^.....
                ...............
                ....^.^...^....
                ...............
                ...^.^...^.^...
                ...............
                ..^...^.....^..
                ...............
                .^.^.^.^.^...^.
                ...............
            `));

            expect(output).toEqual(21);
        });
    });

    describe('Part 2', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart2(parseInputString(`
                .......S.......
                ...............
                .......^.......
                ...............
                ......^.^......
                ...............
                .....^.^.^.....
                ...............
                ....^.^...^....
                ...............
                ...^.^...^.^...
                ...............
                ..^...^.....^..
                ...............
                .^.^.^.^.^...^.
                ...............
            `));

            expect(output).toEqual(40);
        });
    });
});
