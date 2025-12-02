// https://adventofcode.com/2025/day/2

import { ProgramBase } from '../utils';

interface Range {
    from: number
    to: number
}

export default class Program extends ProgramBase {
    parseIdRanges(input: string): Range[] {
        const ranges: Range[] = input.split(',').map((range) => {
            const [from, to] = range.split('-');

            return {
                from: Number(from),
                to: Number(to),
            };
        });

        return ranges;
    }

    getInvalidIds(range: Range, anySequenceGoes = false): number[] {
        const numbers = Array.from({ length: range.to - range.from + 1 }, (_, key) => range.from + key);
        // eslint-disable-next-line regexp/optimal-quantifier-concatenation, regexp/no-super-linear-backtracking
        const regex = anySequenceGoes ? /^(\d+)\1+$/u : /^(\d+)\1$/u;
        return numbers.filter((number) => regex.test(`${number}`));
    }

    runPart1(input: string[]) {
        const ranges = this.parseIdRanges(input[0]);
        const invalidIds: number[] = [];

        for (const range of ranges) {
            invalidIds.push(...this.getInvalidIds(range));
        }

        return invalidIds.reduce((total, value) => total + value, 0);
    }

    runPart2(input: string[]) {
        const ranges = this.parseIdRanges(input[0]);
        const invalidIds: number[] = [];

        for (const range of ranges) {
            invalidIds.push(...this.getInvalidIds(range, true));
        }

        return invalidIds.reduce((total, value) => total + value, 0);
    }
}
