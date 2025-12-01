# Copilot / AI agent instructions for this repository

Purpose: give a concise, actionable summary that helps an AI code agent be productive quickly.

- Project type
  - Node + TypeScript puzzle collection (Advent of Code 2018). Uses Yarn (Berry) v4 as package manager (`package.json` contains `packageManager: "yarn@4.10.3"`).
  - Tests: Vitest. Runtime: Node (CommonJS modules, `tsconfig.json` module=commonjs, target=ES2022).

- Where the "work" lives
  - Day folders: top-level numeric directories (`1/`, `2/`, ..., each contains `index.ts`, `index.spec.ts`, and `input.txt`).
  - Shared helpers: `utils/index.ts` (readFileToArray, parseInputString, printAnswer, helpers like generateMap/findPath, ProgramDefinition type).
  - Entrypoint / runner: `index.ts` (dynamically imports `./${day}/index.ts`, calls runPart1/runPart2). This is what `yarn dev` runs.
  - Input fetcher and new-day generator: `fetch.ts` (reads `SESSION_TOKEN` from `.env`, copies templates from `template/`, writes `./{day}/input.txt`).
  - Templates: `template/index.ts` and `template/index.spec.ts` — used by `fetch.ts` when creating a new day.

- Module / API conventions you must follow
  - Each day's file (`./<day>/index.ts`) exports a default class (usually named `Program`) that implements `ProgramDefinition` from `utils/index.ts`.
  - ProgramDefinition requires `runPart1(input: string[])` and `runPart2(input: string[])` (they may return numbers or string[] and may be async). Tests and the runner treat them interchangeably as sync or async.
  - Tests instantiate the default class directly (see `1/index.spec.ts`) and call helper methods (e.g. `parseInputToNumberArray`) and `runPart1`/`runPart2`.
  - Input file reading: `utils.readFileToArray(path)` reads the file and splits on `\n` then slices off the final empty line. Keep this behavior in mind — input files usually end with a newline and the helper removes the trailing empty row.

- Puzzle solution policy (important)
  - Do NOT provide full puzzle solutions in responses. The repository owner prefers hints and directional guidance only. If the user asks for help on a specific day's puzzle, give:
    - high-level strategies, relevant algorithm names, and which helper functions or files in this repo are useful (for example, `utils/parseInputString`, `utils/generateMap`, `findPath`).
    - small, local examples or pseudocode snippets that illustrate an approach, but avoid full code that solves the day's puzzle end-to-end.
    - one-line references to the original puzzle page when helpful — the canonical puzzle URL is included as a comment in the header of each day's `./{day}/index.ts` file (see top of `1/index.ts` for an example).


- How to run and debug (developer flows)
  - Install deps: `yarn install` (Project uses Yarn v4; lockfile will be updated by the command if necessary).
  - Fetch puzzle input and scaffolding: create `.env` with `SESSION_TOKEN=your-token` then:
    - `yarn fetch` (defaults to today's day)
    - `yarn fetch --day 5 --year 2018` (explicit day/year)
    - `fetch.ts` will create `./<day>/` by copying `template/` files and saving `input.txt`.
  - Run a day's solution (dev watcher):
    - `yarn dev` (runs `tsx watch index.ts` — watches the root runner)
    - `yarn dev --day 5` or `DAY=5 yarn dev` (pass day via CLI or environment variable)
  - Run tests:
    - `yarn test` (uses `VITE_CJS_IGNORE_WARNING=true vitest` in `package.json`)
    - To run a single test file: `yarn test -- <path/to/file>` or filter: `yarn test -- -t "Day 5"`
    - Vitest config: `vitest.config.ts` (globals enabled, coverage reporter configured).
  - Debugging:
    - `yarn debug` runs `tsx --inspect index.ts`. Attach your debugger to Node inspector (default 9229).

- Project-specific patterns and gotchas
  - Dynamic imports: the main runner does `await import(

`./${day}/index.ts`
  )`. When editing this behavior, remember the project targets CommonJS (tsconfig) but uses tsx at runtime — keep import paths relative and include `.ts` in the dynamic import.
  - readFileToArray removes the last line: tests and solutions rely on `readFileToArray('./<day>/input.txt')` returning an array with no trailing empty string. If you change input handling, update tests accordingly.
  - Program methods may be synchronous or async — `index.ts` awaits the result of `runPart1`/`runPart2`, so returning either is acceptable.
  - `fetch.ts` will throw if a day directory already exists. It also relies on `template/index.ts` containing `{day}`/`{year}` placeholders which `fetch.ts` replaces.
  - Scripts use `tsx` (dev dependency). If you change scripts or dependencies, run `yarn install` to update the lockfile.

- Files to look at for examples
  - `1/index.ts` and `1/index.spec.ts` — canonical example of implementation + tests.
  - `utils/index.ts` — shared helpers and types (ProgramDefinition, readFileToArray, parseInputString, printAnswer).
  - `index.ts` — program entrypoint; shows how the runner imports and executes each day's program.
  - `fetch.ts` and `template/` — creating new days and fetching inputs.
  - `package.json` — scripts you should use: `dev`, `debug`, `fetch`, `test` (note `dev` now uses `tsx watch index.ts`).

- When modifying or adding files
  - Keep the exported default class shape: default class with `runPart1`/`runPart2`. Tests expect to import `import Program from '.'`.
  - If you add helpers, put them in `utils/` and add appropriate type signatures to remain compatible with existing code.
  - If you alter input parsing, update all day implementations and tests that rely on the current `readFileToArray` behavior.

- Quick checklist for PRs
  - All new puzzle folders include `index.ts`, `index.spec.ts`, and `input.txt`.
  - Tests pass locally with `yarn test`.
  - If dependencies change, include the lockfile update (run `yarn install`).
  - Keep `tsconfig.json` strictness unless you have a strong reason to relax it.

If anything here is unclear or you want the instructions to emphasise other workflows (for example CI details, or the way you prefer to run/debug tests), tell me which bits to expand or correct and I'll iterate.
