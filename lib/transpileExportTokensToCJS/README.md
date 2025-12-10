# transpileExportTokensToCJS

A lightweight JavaScript token transformer that converts ES Module (ESM) `export` syntax into CommonJS (CJS) assignments without using a full AST parser.

This project works by scanning and rewriting flat token lists, making it fast and suitable for lightweight builds, tooling, and prototyping.

## Features

- Converts ESM `export` statements to CJS `exports.*` format
- Handles:
  - `export const / let / var`
  - `export default`
  - Named exports
  - Destructured exports
  - Re-exports (`export * from`)
  - `export as` syntax
  - Function and class exports
- Works directly at token level (no Babel, no Acorn)

## Project Structure

transpileExportTokensToCJS/
├── test/
│   ├── index.js
│   └── main.js
└── README.md

## How It Works

Instead of building an AST, this project:

1. Tokenizes the source file
2. Walks through token arrays
3. Rewrites export-related token patterns
4. Outputs patched token lists as CommonJS-compatible code

## Example

Input (ESM):

export const foo = 1;
export default function bar() {}
export { foo as baz };

Output (CJS):

const foo = 1;
exports.foo = foo;

function bar() {}
exports.default = bar;

exports.baz = foo;

## Usage

Example:

import transpileExportTokensToCJS from "./main.js";

const out = transpileExportTokensToCJS(tokens);

## Tests

Look at `test/index.js` for example transformations.

## License

MIT
