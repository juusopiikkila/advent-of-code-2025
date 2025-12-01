// https://adventofcode.com/2025/day/1

import { ProgramBase } from '../utils';

interface Rotation {
    amount: number
    direction: 'L' | 'R'
}

export default class Program extends ProgramBase {
    /**
     * Parse input to rotation data
     */
    getRotations(input: string[]): Rotation[] {
        const rotations: Rotation[] = input.map((line) => {
            const [direction, ...rest] = line.split('');

            return {
                direction: direction as 'L' | 'R',
                amount: Number(rest.join('')),
            };
        });

        return rotations;
    }

    /**
     * Rotate the dial and return the result and amount of zeroes
     */
    rotate(from: number, amount: number, direction: 'L' | 'R', countIntermediateZeroes = false): { result: number; zeroes: number } {
        let result = from;
        let zeroes = 0;

        if (countIntermediateZeroes && amount > 0) {
            // Count every time we pass through zero during the rotation
            if (direction === 'L') {
                // Moving left (decreasing): we cross 0 when we wrap around
                // We cross 0: floor((from + amount) / 100) times
                // But we need to check if from is 0 - if we start at 0, first crossing is immediate
                if (from === 0) {
                    // Starting at 0, we don't count it, but count full wraps
                    zeroes = Math.floor(amount / 100);
                } else if (amount >= from) {
                    // We cross 0 when: from - k*1 < 0 for some k
                    // First crossing at k = from + 1
                    // Then every 100 steps after that
                    // We will cross 0
                    zeroes = 1 + Math.floor((amount - from) / 100);
                } else {
                    // We don't reach 0
                    zeroes = 0;
                }
            } else {
                // Moving right (increasing): count how many times we pass/reach 0 (position 0, which comes after 99)
                zeroes = Math.floor((from + amount) / 100);
            }
        }

        // Calculate final position
        result = from;

        if (direction === 'L') {
            result = (from - amount) % 100;
            if (result < 0) {
                result += 100;
            }
        } else {
            result = (from + amount) % 100;
        }

        // For Part 1: only count if we land exactly on zero
        if (!countIntermediateZeroes && result === 0 && amount > 0) {
            zeroes = 1;
        }

        return {
            result,
            zeroes,
        };
    }

    runPart1(input: string[]) {
        const rotations = this.getRotations(input);
        let current = 50;
        let zeroCount = 0;

        for (const { direction, amount } of rotations) {
            const { result, zeroes } = this.rotate(current, amount, direction);

            current = result;
            zeroCount += zeroes;
        }

        return zeroCount;
    }

    runPart2(input: string[]) {
        const rotations = this.getRotations(input);
        let current = 50;
        let zeroCount = 0;

        for (const { direction, amount } of rotations) {
            const { result, zeroes } = this.rotate(current, amount, direction, true);

            current = result;
            zeroCount += zeroes;
        }

        return zeroCount;
    }
}
