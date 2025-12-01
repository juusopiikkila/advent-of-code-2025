# Copilot / AI agent instructions for this repository

## Project Architecture

**TypeScript + Node.js Advent of Code 2025 solutions** using Yarn v4 (Berry), Vitest for testing, and tsx for running TypeScript directly.

### Core Structure
- **Day solutions**: Numeric folders (`1/`, `2/`, etc.) each contain:
  - `index.ts` - Solution class extending `ProgramBase`
  - `index.spec.ts` - Vitest tests
  - `input.txt` - Puzzle input from adventofcode.com
- **Shared utilities**: `utils/index.ts` exports `ProgramBase`, `readFileToArray`, `parseInputString`, `printAnswer`, `generateMap`, `findPath`, `getManhattanDistance`
- **Runner**: `index.ts` dynamically imports day solutions, instantiates the class, and calls `runPart1`/`runPart2`
- **Scaffolding**: `fetch.ts` fetches puzzle input (via session token) and copies `template/` files to create new day folders

### ProgramBase Contract (Critical)
Every day solution **must** export a default class extending `ProgramBase`:

```typescript
export default class Program extends ProgramBase {
    runPart1(input: string[]): number | string | string[] { /* ... */ }
    runPart2(input: string[]): number | string | string[] { /* ... */ }
}
```

- Methods can be sync or async (runner awaits both)
- `this.log(...)` for debug output (only prints when `this.debug = true`)
- See `1/index.ts` for reference implementation with helper methods

## Developer Workflows

### Common Commands
```bash
yarn fetch              # Fetch today's puzzle input + scaffold from template/
yarn fetch --day 5      # Fetch specific day
yarn dev                # Run today's solution (tsx watch mode)
yarn dev --day 5        # Run specific day (or set DAY=5 env var)
yarn test               # Run all Vitest tests
yarn test -- 1/         # Run tests for day 1 only
yarn test:cov           # Generate coverage report (json-summary + text)
yarn debug              # Run with Node inspector on port 9229
```

### Input Handling Pattern
`readFileToArray(path)` splits on `\n` and **removes the last empty line**. All solutions assume this behavior:
```typescript
const input = await readFileToArray('./1/input.txt');
// input.txt ends with newline, but readFileToArray removes trailing empty string
```

If `parseInputString` is used on multi-line template literals, it trims rows and removes trailing empty line, **then** removes a leading empty line if `data[0] === ''`.

## Project-Specific Conventions

### Dynamic Imports in Runner
`index.ts` does `await import(`./${day}/index.ts`)` with the `.ts` extension. This is required for tsx runtime even though tsconfig targets CommonJS.

### Testing Patterns
- Instantiate the Program class directly: `const program = new Program()`
- Test both helper methods and `runPart1`/`runPart2`
- Use Vitest globals (no imports needed for `describe`, `it`, `expect`)
- Example from `1/index.spec.ts`: tests rotation logic via `program.rotate()` then validates `runPart1()`/`runPart2()` against sample inputs

### Template Replacement
`fetch.ts` copies `template/index.ts` and replaces `{day}`/`{year}` placeholders. The template includes the puzzle URL comment at the top.

### No Full Solutions Policy
When helping with puzzles, provide **hints and algorithm names** only, not complete implementations. Reference the puzzle URL (in each day's file header) and suggest relevant utils (e.g., `findPath` for pathfinding, `generateMap` for grids).

## Key Files for Reference
- `1/index.ts` + `1/index.spec.ts` - Complete example with rotation logic, helper methods, comprehensive tests
- `utils/index.ts` + `utils/index.spec.ts` - All shared utilities with full test coverage
- `template/index.ts` - Starting point for new days
- `vitest.config.ts` - Coverage config (json-summary for badges)
- `package.json` - All scripts; note `VITE_CJS_IGNORE_WARNING=true` for Vitest

## Gotchas
- `fetch.ts` throws if day folder exists (no overwrites)
- Program methods must be on the default exported class (not standalone functions)
- When adding utils, update `utils/index.ts` exports and add tests to `utils/index.spec.ts`
