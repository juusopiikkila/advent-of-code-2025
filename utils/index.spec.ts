import * as fsExtra from 'fs-extra';
import {
    findPath,
    generateMap,
    getManhattanDistance,
    parseInputString,
    printAnswer,
    readFileToArray,
} from '.';

vi.mock('fs-extra', () => ({
    readFile: vi.fn(),
}));

describe('readFileToArray', () => {
    it('should read a file to an array', async () => {
        const readFileSpy = vi.spyOn(fsExtra, 'readFile').mockImplementation(() => ([
            '1',
            '2',
            '3',
            '4',
            '5',
            '',
        ].join('\n')));

        const filePath = '/path/to/file.json';

        const data = await readFileToArray(filePath);

        expect(readFileSpy).toHaveBeenCalledWith(filePath);

        expect(data).toEqual(['1', '2', '3', '4', '5']);

        readFileSpy.mockRestore();
    });
});

describe('printAnswer', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    beforeEach(() => {
        consoleSpy.mockClear();
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    it('should print the answer if it\'s a number', () => {
        printAnswer(42);

        expect(consoleSpy).toHaveBeenCalledTimes(1);

        expect(consoleSpy).toHaveBeenCalledWith('Answer:', 42);
    });

    it('should print the answer if it\'s an array', () => {
        printAnswer(['42', '43']);

        expect(consoleSpy).toHaveBeenCalledTimes(2);

        expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Answer:');
        expect(consoleSpy).toHaveBeenNthCalledWith(2, '42\n43');
    });
});

describe('parseInputString', () => {
    it('should parse the input string', () => {
        const input = `
            1
            2
            3
            4

            5
        `;

        expect(parseInputString(input)).toEqual(['1', '2', '3', '4', '', '5']);
    });
});

describe('generateMap', () => {
    it('should generate a map', () => {
        expect(generateMap(2, 2, 0)).toEqual([
            [0, 0],
            [0, 0],
        ]);
    });
});

describe('findPath', () => {
    const map = [
        '00000000000',
        '01111111110',
        '01222222210',
        '00000000000',
    ].map((row) => [...row].map(Number));

    it('should find a path', async () => {
        const path = await findPath(
            map,
            { x: 1, y: 2 },
            { x: 9, y: 2 },
            {
                acceptableTiles: [1, 2],
            },
        );

        expect(path).toEqual([
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
            { x: 4, y: 2 },
            { x: 5, y: 2 },
            { x: 6, y: 2 },
            { x: 7, y: 2 },
            { x: 8, y: 2 },
            { x: 9, y: 2 },
        ]);
    });

    it('should find a diagonal path', async () => {
        const path = await findPath(
            map,
            { x: 1, y: 2 },
            { x: 9, y: 2 },
            {
                acceptableTiles: [1],
                enableDiagonals: true,
            },
        );

        expect(path).toEqual([
            { x: 1, y: 2 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
            { x: 4, y: 1 },
            { x: 5, y: 1 },
            { x: 6, y: 1 },
            { x: 7, y: 1 },
            { x: 8, y: 1 },
            { x: 9, y: 2 },
        ]);
    });

    it('should find a diagonal path with cost', async () => {
        const path = await findPath(
            map,
            { x: 1, y: 2 },
            { x: 9, y: 2 },
            {
                acceptableTiles: [1, 2],
                enableDiagonals: true,
                tileCosts: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    '2': 2,
                },
            },
        );

        expect(path).toEqual([
            { x: 1, y: 2 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
            { x: 4, y: 1 },
            { x: 5, y: 1 },
            { x: 6, y: 1 },
            { x: 7, y: 1 },
            { x: 8, y: 1 },
            { x: 9, y: 2 },
        ]);
    });
});

describe('getManhattanDistance', () => {
    it('should get the manhattan distance', () => {
        expect(getManhattanDistance([1, 1], [5, 5])).toEqual(8);
    });
});
