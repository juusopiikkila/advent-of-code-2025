// https://adventofcode.com/2025/day/6

import { ProgramBase } from '../utils';

type Operator = '*' | '+';

interface Column {
    numbers: number[]
    operator: Operator
}

export default class Program extends ProgramBase {
    /**
     * Get columns from input
     */
    getColumnsFromInput(input: string[]): Column[] {
        const operators = input.pop()!.split(' ').filter((value) => value.length > 0);

        // Init columns
        const columns = operators.map<Column>((operator) => ({
            operator: operator as Operator,
            numbers: [],
        }));

        // Handle number lines
        for (const line of input) {
            const numbers = line.split(' ').filter((value) => value.length > 0).map(Number);

            // Add numbers to columns
            for (const [index, number] of numbers.entries()) {
                columns[index].numbers.push(number);
            }
        }

        return columns;
    }

    /**
     * Extract operators from the operator line
     */
    private extractOperators(operatorLine: string): string[] {
        const regex = /[*+]\s*/gu;
        const operators = operatorLine.match(regex);

        if (!operators) {
            throw new Error('No operators found');
        }

        return operators;
    }

    /**
     * Calculate column ranges based on operator positions
     */
    private calculateColumnRanges(operators: string[], maxLineLength: number): Array<{ from: number; to: number }> {
        // Get ranges (skip the last one for this one)
        const ranges = operators
            .slice(0, -1)
            .reduce<Array<{ from: number; to: number }>>((accumulator, part, index, array) => [
                ...accumulator,
                {
                    from: array.slice(0, index).join('').length,
                    to: [...array.slice(0, index), part].join('').length - 1,
                },
            ], []);

        // Add last range
        ranges.push({
            from: ranges.at(-1)!.to + 1,
            to: maxLineLength,
        });

        return ranges;
    }

    /**
     * Split input lines into groups based on column ranges
     */
    private splitIntoGroups(input: string[], ranges: Array<{ from: number; to: number }>): string[][] {
        const groups: string[][] = [];

        for (const { from, to } of ranges) {
            const data: string[] = [];

            for (const line of input) {
                let part = line.slice(from, to);

                // Pad end if part is too small
                if (part.length < to - from) {
                    part += Array.from({ length: to - from - part.length }, () => ' ').join('');
                }

                data.push(part);
            }

            groups.push(data);
        }

        return groups;
    }

    /**
     * Extract numbers from a group reading right-to-left vertically
     */
    private extractNumbersFromGroup(group: string[]): number[] {
        const numbers: number[] = [];
        const length = group.length;
        const columnWidth = group[0].length;

        for (let numberIndex = columnWidth - 1; numberIndex >= 0; numberIndex -= 1) {
            let number = '';

            for (let rowIndex = 0; rowIndex < length; rowIndex += 1) {
                number += group[rowIndex][numberIndex];
            }

            numbers.push(Number(number));
        }

        return numbers;
    }

    /**
     * Get right-to-left columns from input
     */
    getRightToLeftColumnsFromInput(input: string[]): Column[] {
        const operatorLine = input.pop()!;
        const operators = this.extractOperators(operatorLine);

        const maxLineLength = Math.max(...input.map((line) => line.length));
        const ranges = this.calculateColumnRanges(operators, maxLineLength);

        const groups = this.splitIntoGroups(input, ranges);

        // Init columns with operators and extract numbers
        const columns = operators.map<Column>((operator, index) => ({
            operator: operator.trim() as Operator,
            numbers: this.extractNumbersFromGroup(groups[index]),
        }));

        return columns;
    }

    /**
     * Get column result by operator
     */
    getColumnResult(column: Column): number {
        return column.numbers.reduce((total, number) => (
            column.operator === '*' ? total * number : total + number
        ));
    }

    runPart1(input: string[]) {
        const columns = this.getColumnsFromInput(input);

        return columns.reduce((total, column) => total + this.getColumnResult(column), 0);
    }

    runPart2(input: string[]) {
        const columns = this.getRightToLeftColumnsFromInput(input);

        return columns.reduce((total, column) => total + this.getColumnResult(column), 0);
    }
}
