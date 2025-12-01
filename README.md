![Branches](https://github.com/juusopiikkila/advent-of-code-2025/raw/gh-pages/badges/coverage-branches.svg?raw=true)
![Functions](https://github.com/juusopiikkila/advent-of-code-2025/raw/gh-pages/badges/coverage-functions.svg?raw=true)
![Coverage Status](https://github.com/juusopiikkila/advent-of-code-2025/raw/gh-pages/badges/coverage-jest%20coverage.svg?raw=true)
![Lines](https://github.com/juusopiikkila/advent-of-code-2025/raw/gh-pages/badges/coverage-lines.svg?raw=true)
![Statements](https://github.com/juusopiikkila/advent-of-code-2025/raw/gh-pages/badges/coverage-statements.svg?raw=true)

# Fetching puzzle input data

First, add your session token from the adventofcode.com cookie to a `.env` file using the `SESSION_TOKEN` key, like this:

```env
SESSION_TOKEN=your-session-token-here
```

Use the following command to fetch the input data:

```bash
# Fetch puzzle input for the current day
yarn fetch

# Optionally, specify a particular day's input to fetch
yarn fetch --day <day>
```

Replace <day> with the day of the puzzle you want to fetch. If no day is specified, the script will default to the current day's puzzle input.

# Running the puzzle

To run your solution for a puzzle, use the following command:

```bash
# Run the solution for the current day's puzzle
yarn dev

# Optionally, run the solution for a particular day's puzzle
yarn dev --day <day>
```

Again, replace <day> with the numeric day of the puzzle you want to run. If no day is specified, the script will run the solution for the current day's puzzle.
