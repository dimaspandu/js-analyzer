# convertESMToCJSWithMeta

convertESMToCJSWithMeta is a small and self-contained transformation
pipeline that converts ES Module syntax into CommonJS while also
extracting detailed metadata about all encountered module imports and
exports.

This module does not rely on a full AST parser. It operates on a custom
token-stream produced by a lightweight tokenizer and performs targeted
transformations designed for build tools, bundlers, preprocessing steps,
or analysis utilities.

## Features

-   Converts ES Module syntax into CommonJS:
    -   import ... from "x" → require("x")
    -   export ... → exports.\* = ...
    -   import() → requireByHttp()
-   Extracts metadata describing:
    -   static imports
    -   dynamic imports
    -   re-exports
    -   namespace imports
    -   imports with assertions or module attributes
    -   template-literal dynamic imports
-   Works entirely on tokens, without AST dependencies
-   Zero external runtime dependencies
-   Deterministic transformation output

## How It Works

The transformation consists of four sequential pipeline stages:

### 1. Tokenization

The raw JavaScript source is converted into a flat token array by
tokenizer/main.js. Whitespace, newline, and comment tokens are removed
because they do not affect structure and only introduce noise for the
transformation steps.

### 2. Metadata Extraction

extractModules/main.js scans the cleaned token list and collects
metadata about every:

-   static import
-   dynamic import
-   re-export statement

### 3. ESM → CJS Transformation

Two transformations are applied to the token stream:

1.  transpileExportTokensToCJS\
2.  transpileImportTokensToCJS

Order matters: imports are applied after exports so that name bindings
remain stable.

### 4. String Reconstruction

The transformed token array is passed to stringifyTokens/main.js, which
produces the final CommonJS-compatible JavaScript source.

## Metadata Format

Each extracted module entry has the following structure:

``` js
{
  module: string,
  type: "static" | "dynamic" | "export",
  assertions: object|null,
  literal: boolean,
  reason: string|null
}
```

## Usage Example

``` js
import convertESMToCJSWithMeta from "./convertESMToCJSWithMeta/main.js";

const result = convertESMToCJSWithMeta(`
  import foo, { bar } from "./module.js";
  export const x = 1;
`);

console.log(result.code);
console.log(result.meta);
```

## Repository Structure

    convertESMToCJSWithMeta/
    ├── main.js
    ├── README.md
    └── test/
        ├── index.js
        └── main.js

## Running Tests

Run tests using:

``` bash
node convertESMToCJSWithMeta/test/index.js
```

## License

MIT
