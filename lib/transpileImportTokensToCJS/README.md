# transpileImportTokensToCJS

This module provides a syntactic transformer that converts ESM-style JavaScript import statements into equivalent CommonJS (CJS) constructs. It operates entirely on token arrays produced by the tokenizer and performs shallow, syntax‑only transformations without evaluating or interpreting code.

## Overview

`transpileImportTokensToCJS(tokens)` takes an array of token objects and returns a new array of transformed tokens. Its focus is limited to import-related syntax, leaving all other code untouched.

### Key Features

- Filters out whitespace, newline, and comment tokens before matching patterns.
- Supports:
  - Default imports  
    `import a from "mod"` → `const a = require("mod").default;`
  - Named/destructured imports  
    `import { a, b } from "mod"` → individual `const` assignments.
  - Combined default + named  
    `import a, { b } from "mod"`
  - Namespace imports  
    `import * as ns from "mod"`
  - Combined default + namespace  
    `import a, * as ns from "mod"`
  - Bare imports  
    `import "mod"` → `require("mod");`
  - Dynamic imports  
    `import("mod")` → `requireByHttp("mod");`
- Supports skipping of `assert {}` and `with {}` blocks.
- Uses a skip-index map to avoid outputting tokens that were replaced by transformed equivalents.

## Token Expectations

Tokens are expected to follow the tokenizer's conventions:

- `{ type: "keyword", value: "import" }`
- `{ type: "identifier", value: "foo" }`
- `{ type: "string", value: ""mod"" }`
- `{ type: "punctuator", value: "{" }`, etc.

The transformer assumes the stream has already been lexed correctly.

## Internal Helpers

### Filtering

```js
tokens = tokens.filter(
  t => t.type !== "newline" && t.type !== "whitespace" && t.type !== "comment"
);
```

Reduces noise before pattern matching.

### skippedIndex

A map of token indices to skip. Used so original tokens are not emitted after they have been replaced with transformed output.

### generateRequireTokens(pathToken)

Builds the token sequence:

```
require("module")
```

and returns it for reuse by higher-level patterns.

## Transform Logic Summary

### Default Import

```
import a from "mod";
→
const a = require("mod").default;
```

### Destructured Import

```
import { a, b } from "mod";
→
const a = require("mod").a;
const b = require("mod").b;
```

Supports renaming:

```
import { a as x } from "mod";
→
const x = require("mod").a;
```

### Default + Destructuring

```
import a, { b, c } from "mod";
→
const a = require("mod").default;
const b = require("mod").b;
const c = require("mod").c;
```

### Namespace Import

```
import * as ns from "mod";
→
const ns = require("mod");
```

### Default + Namespace

```
import def, * as ns from "mod";
→
const ns = require("mod");
const def = ns.default;
```

### Bare Import

```
import "mod";
→
require("mod");
```

### Dynamic Import

```
import("mod");
→
requireByHttp("mod");
```

Includes detection of nested parentheses via `getDynamicImportEndIndex`.

## Unsupported Semantics

This transformer is **syntactic only**. It does not implement:

- Execution semantics of ESM
- Live bindings
- Circular dependency behavior
- Module namespace exotic objects
- Top‑level await

It is intended for lightweight, predictable static rewriting.

## Usage Example

```js
import transpileImportTokensToCJS from "...";

const tokens = tokenizer(`
  import a from "x";
  import { b, c as d } from "y";
`);

const out = transpileImportTokensToCJS(tokens);
const code = stringifyTokens(out);
```

## Folder Structure Example

```
lib/
  extractModules/
  stringifyTokens/
  tokenizer/
  transpileImportTokensToCJS/
    index.js
    main.js
  test/
README.md
```

## License

MIT
