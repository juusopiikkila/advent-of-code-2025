// https://adventofcode.com/2025/day/8

import { type Coord, getEuclideanDistance, ProgramBase } from '../utils';

interface Coord3D extends Coord {
    z: number
}

export default class Program extends ProgramBase {
    /**
     * Parse input strings into 3D coordinate objects
     */
    parseInputToCoordinates(input: string[]): Coord3D[] {
        return input.map<Coord3D>((line) => {
            const [x, y, z] = line.split(',').map(Number);

            return {
                x,
                y,
                z,
            };
        });
    }

    /**
     * Check if two coordinates represent the same point in 3D space
     */
    isSameCoord(coord1: Coord3D, coord2: Coord3D): boolean {
        return coord1.x === coord2.x
            && coord1.y === coord2.y
            && coord1.z === coord2.z;
    }

    /**
     * Generate a unique string key for a coordinate
     */
    getCoordKey(coord: Coord3D): string {
        return `${coord.x}.${coord.y}.${coord.z}`;
    }

    /**
     * Get sorted coordinate keys for consistent pair identification
     */
    sortCoordinates(coord1: Coord3D, coord2: Coord3D): string[] {
        return [
            this.getCoordKey(coord1),
            this.getCoordKey(coord2),
        ].sort();
    }

    /**
     * Generate a unique key for a pair of coordinates (order-independent)
     */
    getDistanceMapKey(coord1: Coord3D, coord2: Coord3D): string {
        return this.sortCoordinates(coord1, coord2).join(':');
    }

    /**
     * Create Union-Find data structure for tracking connected circuits
     */
    createUnionFind(coords: Coord3D[]) {
        const parent = new Map<string, string>();

        // Initialize: each node is its own parent
        for (const coord of coords) {
            const key = this.getCoordKey(coord);
            parent.set(key, key);
        }

        // Find root with path compression
        const find = (node: string): string => {
            if (parent.get(node) !== node) {
                parent.set(node, find(parent.get(node)!));
            }

            return parent.get(node)!;
        };

        // Union two nodes - returns true if they were actually merged
        const union = (a: string, b: string): boolean => {
            const rootA = find(a);
            const rootB = find(b);
            if (rootA !== rootB) {
                parent.set(rootB, rootA);
                return true;
            }

            return false;
        };

        // Count unique circuits
        const countCircuits = (): number => {
            const roots = new Set<string>();
            for (const [key] of parent) {
                roots.add(find(key));
            }

            return roots.size;
        };

        // Get all circuit sizes
        const getCircuitSizes = (): number[] => {
            const circuits = new Map<string, Set<string>>();
            for (const [key] of parent) {
                const root = find(key);
                if (!circuits.has(root)) {
                    circuits.set(root, new Set());
                }

                circuits.get(root)!.add(key);
            }

            return Array.from(circuits.values())
                .map((set) => set.size)
                .sort((a, b) => b - a);
        };

        return {
            parent, find, union, countCircuits, getCircuitSizes,
        };
    }

    /**
     * Build and sort all coordinate pairs by distance
     */
    buildSortedPairs(coords: Coord3D[]): Array<{
        coord1: Coord3D
        coord2: Coord3D
        key1: string
        key2: string
        distance: number
    }> {
        const allPairs: Array<{
            coord1: Coord3D
            coord2: Coord3D
            key1: string
            key2: string
            distance: number
        }> = [];

        for (const [index, coord1] of coords.entries()) {
            const key1 = this.getCoordKey(coord1);
            for (const coord2 of coords.slice(index + 1)) {
                const key2 = this.getCoordKey(coord2);
                const distance = getEuclideanDistance(
                    [coord1.x, coord1.y, coord1.z],
                    [coord2.x, coord2.y, coord2.z],
                );
                allPairs.push({
                    coord1, coord2, key1, key2, distance,
                });
            }
        }

        return allPairs.sort((a, b) => a.distance - b.distance);
    }

    /**
     * Connect junction boxes up to maxAttempts and return product of three largest circuits
     */
    connectAndScoreCircuits(coords: Coord3D[], maxAttempts: number): number {
        const { union, getCircuitSizes } = this.createUnionFind(coords);
        const allPairs = this.buildSortedPairs(coords);

        // Process pairs in order
        let connectionsAttempted = 0;
        for (const pair of allPairs) {
            if (connectionsAttempted >= maxAttempts) {
                break;
            }

            union(pair.key1, pair.key2);
            connectionsAttempted += 1;
        }

        // Return product of three largest circuit sizes
        const circuitSizes = getCircuitSizes();
        return circuitSizes
            .slice(0, 3)
            .reduce((total, value) => total * value, 1);
    }

    /**
     * Find the last connection that unifies all circuits and return X coordinate product
     */
    findUnifyingConnection(coords: Coord3D[]): number {
        const { union } = this.createUnionFind(coords);
        const allPairs = this.buildSortedPairs(coords);

        // Track number of separate circuits
        let circuitCount = coords.length;

        // Process pairs until all in one circuit
        for (const pair of allPairs) {
            const merged = union(pair.key1, pair.key2);

            if (merged) {
                circuitCount -= 1;

                if (circuitCount === 1) {
                    return pair.coord1.x * pair.coord2.x;
                }
            }
        }

        return 0;
    }

    runPart1(input: string[]) {
        const coords = this.parseInputToCoordinates(input);
        return this.connectAndScoreCircuits(coords, 1000);
    }

    runPart2(input: string[]) {
        const coords = this.parseInputToCoordinates(input);
        return this.findUnifyingConnection(coords);
    }
}
