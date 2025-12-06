import { js as EasyStar } from 'easystarjs';
import { readFile } from 'fs-extra';

export interface Coord {
    x: number
    y: number
}

export interface PathOptions {
    acceptableTiles: number[]
    tileCosts?: Record<string, number>
    enableDiagonals?: boolean
}

export abstract class ProgramBase {
    debug = false;

    abstract runPart1(input: string[]): Promise<number | string | string[]> | number | string | string[];

    abstract runPart2(input: string[]): Promise<number | string | string[]> | number | string | string[];

    log(...args: unknown[]) {
        if (!this.debug) {
            return;
        }

        console.log(...args);
    }
}

export async function readFileToArray(path: string): Promise<string[]> {
    const data = await readFile(path);
    const rows = data.toString().split('\n');

    if (rows.at(-1) === '') {
        rows.pop();
    }

    return rows;
}

export function printAnswer(answer: number | string[] | string): void {
    if (Array.isArray(answer)) {
        console.log('Answer:');
        console.log(answer.join('\n'));
    } else {
        console.log('Answer:', answer);
    }
}

export function parseInputString(input: string): string[] {
    let data = input.split('\n');

    if (data[0] === '') {
        data.shift();
    }

    const regex = /^\s+/u;
    const prefix = regex.exec(data[0]);
    const prefixLength = prefix?.[0].length ?? 0;

    data = data.map((line) => line.slice(prefixLength));

    if (data.at(-1) === '') {
        data.pop();
    }

    return data;
}

export function generateMap<T = string | number>(
    width: number,
    height: number,
    fill: T,
): T[][] {
    return Array
        .from<T[]>({ length: height })
        .map(() => Array.from<T>({ length: width }).fill(fill));
}

export async function findPath(map: number[][], from: Coord, to: Coord, options: PathOptions): Promise<Coord[]> {
    return new Promise((resolve) => {
        const easystar = new EasyStar();

        easystar.setGrid(map);
        easystar.setAcceptableTiles(options.acceptableTiles);

        if (options.enableDiagonals) {
            easystar.enableDiagonals();
        }

        if (options.tileCosts) {
            for (const [tile, cost] of Object.entries(options.tileCosts)) {
                easystar.setTileCost(Number(tile), cost);
            }
        }

        easystar.findPath(from.x, from.y, to.x, to.y, (path) => {
            resolve(path);
        });

        easystar.calculate();
    });
}

export function getManhattanDistance(a: [number, number], b: [number, number]): number {
    let distance = 0;

    for (let index = 0; index < 2; index += 1) {
        distance += Math.abs(b[index] - a[index]);
    }

    return distance;
}
