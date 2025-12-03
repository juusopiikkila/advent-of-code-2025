// https://adventofcode.com/2025/day/3

import { ProgramBase } from '../utils';

export default class Program extends ProgramBase {
    getBanks(input: string[]): number[][] {
        return input.map((line) => line.split('').map(Number));
    }

    getHighestValue(bank: number[]): number {
        if (bank.length === 0) {
            throw new Error('No numbers!');
        }

        const sorted = [...bank].sort((a, b) => b - a);

        return sorted.at(0)!;
    }

    getHighestBatteries(bank: number[]): number {
        const highest = this.getHighestValue(bank.slice(0, -1));
        const highestIndex = bank.indexOf(highest);
        const secondHighest = this.getHighestValue(bank.slice(highestIndex + 1));

        return Number([highest, secondHighest].join(''));
    }

    getHighestPermutation(bank: number[]): number {
        const maxLength = 12;
        const bankLength = bank.length;

        if (maxLength > bankLength) {
            throw new Error('Bank does not contain enough numbers to form permutation');
        }

        let toRemove = bankLength - maxLength;
        const stack: number[] = [];

        for (let index = 0; index < bankLength; index += 1) {
            const digit = bank[index];

            while (stack.length > 0 && toRemove > 0 && stack.at(-1)! < digit) {
                stack.pop();
                toRemove -= 1;
            }

            stack.push(digit);
        }

        const resultDigits = stack.slice(0, maxLength);

        return Number(resultDigits.join(''));
    }

    runPart1(input: string[]) {
        const banks = this.getBanks(input);
        const batteries = banks.map((bank) => this.getHighestBatteries(bank));

        return batteries.reduce((total, value) => total + value, 0);
    }

    runPart2(input: string[]) {
        const banks = this.getBanks(input);
        const values = banks.map((bank) => this.getHighestPermutation(bank));

        return values.reduce((total, value) => total + value, 0);
    }
}
