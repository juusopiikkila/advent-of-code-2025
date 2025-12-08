import Program from '.';
import { parseInputString } from '../utils';

describe('Day 8', () => {
    let program: Program;

    beforeEach(() => {
        program = new Program();
    });

    const sampleInput = parseInputString(`
        162,817,812
        57,618,57
        906,360,560
        592,479,940
        352,342,300
        466,668,158
        542,29,236
        431,825,988
        739,650,466
        52,470,668
        216,146,977
        819,987,18
        117,168,530
        805,96,715
        346,949,466
        970,615,88
        941,993,340
        862,61,35
        984,92,344
        425,690,689
    `);

    describe('parseInputToCoordinates', () => {
        it('should parse coordinate strings into Coord3D objects', () => {
            const input = ['1,2,3', '4,5,6'];
            const result = program.parseInputToCoordinates(input);

            expect(result).toEqual([
                { x: 1, y: 2, z: 3 },
                { x: 4, y: 5, z: 6 },
            ]);
        });

        it('should handle negative coordinates', () => {
            const input = ['-10,-20,-30'];
            const result = program.parseInputToCoordinates(input);

            expect(result).toEqual([{ x: -10, y: -20, z: -30 }]);
        });
    });

    describe('getCoordKey', () => {
        it('should generate unique key for coordinates', () => {
            const coord = { x: 100, y: 200, z: 300 };
            const key = program.getCoordKey(coord);

            expect(key).toBe('100.200.300');
        });

        it('should handle negative coordinates', () => {
            const coord = { x: -5, y: 0, z: 10 };
            const key = program.getCoordKey(coord);

            expect(key).toBe('-5.0.10');
        });
    });

    describe('isSameCoord', () => {
        it('should return true for identical coordinates', () => {
            const coord1 = { x: 1, y: 2, z: 3 };
            const coord2 = { x: 1, y: 2, z: 3 };

            expect(program.isSameCoord(coord1, coord2)).toBe(true);
        });

        it('should return false for different coordinates', () => {
            const coord1 = { x: 1, y: 2, z: 3 };
            const coord2 = { x: 1, y: 2, z: 4 };

            expect(program.isSameCoord(coord1, coord2)).toBe(false);
        });
    });

    describe('sortCoordinates', () => {
        it('should return sorted coordinate keys', () => {
            const coord1 = { x: 5, y: 5, z: 5 };
            const coord2 = { x: 1, y: 1, z: 1 };
            const result = program.sortCoordinates(coord1, coord2);

            expect(result).toEqual(['1.1.1', '5.5.5']);
        });

        it('should maintain order if already sorted', () => {
            const coord1 = { x: 1, y: 1, z: 1 };
            const coord2 = { x: 5, y: 5, z: 5 };
            const result = program.sortCoordinates(coord1, coord2);

            expect(result).toEqual(['1.1.1', '5.5.5']);
        });
    });

    describe('getDistanceMapKey', () => {
        it('should generate consistent key regardless of order', () => {
            const coord1 = { x: 1, y: 2, z: 3 };
            const coord2 = { x: 4, y: 5, z: 6 };

            const key1 = program.getDistanceMapKey(coord1, coord2);
            const key2 = program.getDistanceMapKey(coord2, coord1);

            expect(key1).toBe(key2);
            expect(key1).toBe('1.2.3:4.5.6');
        });
    });

    describe('createUnionFind', () => {
        it('should initialize with each node as its own parent', () => {
            const coords = program.parseInputToCoordinates(['1,2,3', '4,5,6']);
            const { parent, countCircuits } = program.createUnionFind(coords);

            expect(parent.size).toBe(2);
            expect(countCircuits()).toBe(2);
        });

        it('should union two nodes', () => {
            const coords = program.parseInputToCoordinates(['1,2,3', '4,5,6']);
            const { union, countCircuits } = program.createUnionFind(coords);

            const merged = union('1.2.3', '4.5.6');

            expect(merged).toBe(true);
            expect(countCircuits()).toBe(1);
        });

        it('should not union nodes already in same circuit', () => {
            const coords = program.parseInputToCoordinates(['1,2,3', '4,5,6']);
            const { union, countCircuits } = program.createUnionFind(coords);

            union('1.2.3', '4.5.6');
            const secondMerge = union('1.2.3', '4.5.6');

            expect(secondMerge).toBe(false);
            expect(countCircuits()).toBe(1);
        });

        it('should get circuit sizes', () => {
            const coords = program.parseInputToCoordinates(['1,2,3', '4,5,6', '7,8,9']);
            const { union, getCircuitSizes } = program.createUnionFind(coords);

            union('1.2.3', '4.5.6');

            const sizes = getCircuitSizes();
            expect(sizes).toEqual([2, 1]); // One circuit with 2, one with 1
        });
    });

    describe('buildSortedPairs', () => {
        it('should build pairs sorted by distance', () => {
            const coords = program.parseInputToCoordinates(['0,0,0', '1,0,0', '10,0,0']);
            const pairs = program.buildSortedPairs(coords);

            expect(pairs).toHaveLength(3);
            expect(pairs[0].distance).toBeLessThan(pairs[1].distance);
            expect(pairs[1].distance).toBeLessThan(pairs[2].distance);
        });

        it('should include coordinate objects in pairs', () => {
            const coords = program.parseInputToCoordinates(['1,2,3', '4,5,6']);
            const pairs = program.buildSortedPairs(coords);

            expect(pairs).toHaveLength(1);
            expect(pairs[0].coord1).toEqual({ x: 1, y: 2, z: 3 });
            expect(pairs[0].coord2).toEqual({ x: 4, y: 5, z: 6 });
        });

        it('should include string keys in pairs', () => {
            const coords = program.parseInputToCoordinates(['1,2,3', '4,5,6']);
            const pairs = program.buildSortedPairs(coords);

            expect(pairs[0].key1).toBe('1.2.3');
            expect(pairs[0].key2).toBe('4.5.6');
        });
    });

    describe('connectAndScoreCircuits', () => {
        it('should connect limited number of pairs', () => {
            const coords = program.parseInputToCoordinates(['0,0,0', '1,0,0', '10,0,0']);
            const score = program.connectAndScoreCircuits(coords, 1);

            // After 1 connection: closest pair (0,0,0 and 1,0,0) connects
            // Result: 1 circuit of size 2, 1 circuit of size 1
            // Top 3: [2, 1] -> product is 2 * 1 * 1 = 2
            expect(score).toBe(2);
        });

        it('should handle multiple connections forming different circuits', () => {
            // Linear arrangement: each unit apart
            const coords = program.parseInputToCoordinates(['0,0,0', '1,0,0', '2,0,0', '10,0,0', '11,0,0']);
            const score = program.connectAndScoreCircuits(coords, 3);

            // Connections: (0,1), (1,2), (10,11) based on distances
            // Result: circuit of 3, circuit of 2
            // Top 3: [3, 2, 1] -> product is 3 * 2 * 1 = 6
            expect(score).toBe(6);
        });

        it('should return product of three largest circuits', () => {
            const coords = program.parseInputToCoordinates(sampleInput);
            const score = program.connectAndScoreCircuits(coords, 10);

            expect(score).toBe(40); // 5 * 4 * 2
        });
    });

    describe('findUnifyingConnection', () => {
        it('should find X product of last unifying connection', () => {
            const coords = program.parseInputToCoordinates(sampleInput);
            const result = program.findUnifyingConnection(coords);

            expect(result).toBe(25_272); // 216 * 117
        });

        it('should handle already unified circuits', () => {
            const coords = program.parseInputToCoordinates(['0,0,0', '1,0,0']);
            const result = program.findUnifyingConnection(coords);

            expect(result).toBe(0); // 0 * 1
        });

        it('should return 0 when already a single circuit', () => {
            // Single coordinate - already unified
            const coords = program.parseInputToCoordinates(['5,5,5']);
            const result = program.findUnifyingConnection(coords);

            expect(result).toBe(0);
        });
    });

    describe('Part 1', () => {
        it('should solve the example with 10 attempts', () => {
            const coords = program.parseInputToCoordinates(sampleInput);
            const output = program.connectAndScoreCircuits(coords, 10);

            expect(output).toEqual(40);
        });

        it('should call runPart1 with 1000 attempts', () => {
            // Test with small input to verify runPart1 works
            const testInput = ['0,0,0', '1,0,0', '10,0,0'];
            const output = program.runPart1(testInput);

            // With 1000 attempts and only 3 coords, all will be connected
            expect(output).toBeGreaterThan(0);
        });
    });

    describe('Part 2', () => {
        it('should solve the puzzle', () => {
            const output = program.runPart2(sampleInput);

            expect(output).toEqual(25_272);
        });
    });
});
