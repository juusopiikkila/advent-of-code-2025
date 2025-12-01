// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config';
import { exists, mkdir, readFile, writeFile } from 'fs-extra';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const year = argv.year || (new Date()).getFullYear();
const day = argv.day || (new Date()).getDate();
const sessionToken = process.env.SESSION_TOKEN;

if (!sessionToken) {
    throw new Error('No session token provided');
}

if (!day) {
    throw new Error('No day provided');
}

if (day < 1 || day > 25) {
    throw new Error('Day must be between 1 and 25');
}

async function main() {
    if (await exists(`./${day}`)) {
        throw new Error(`Day ${day} already exists`);
    }

    // Create the new day folder
    await mkdir(`./${day}`);

    // Append the day to the index.spec.ts and copy to the new day folder
    const indexSpecFileBuffer = await readFile('./template/index.spec.ts');

    const indexSpecFileString = indexSpecFileBuffer.toString()
        .replaceAll('{day}', day.toString());

    await writeFile(`./${day}/index.spec.ts`, indexSpecFileString);

    // Append the day and year to the index.ts and copy to the new day folder
    const indexFileBuffer = await readFile('./template/index.ts');

    const indexFileString = indexFileBuffer.toString()
        .replaceAll('{day}', day.toString())
        .replaceAll('{year}', year.toString());

    await writeFile(`./${day}/index.ts`, indexFileString);

    const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
        headers: {
            cookie: `session=${sessionToken}`,
        },
    });

    const input = await response.text();

    await writeFile(`./${day}/input.txt`, input);

    console.log(`Day ${day} of year ${year} fetched`);
    console.log(`Link to day ${day}: https://adventofcode.com/${year}/day/${day}`);
}

main();
