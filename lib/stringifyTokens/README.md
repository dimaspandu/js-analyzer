# stringifyTokens

`stringifyTokens` is a low-level utility that reconstructs a JavaScript source string from an array of token objects.  
It performs *minimal spacing logic* to ensure that tokens do not accidentally merge into different or invalid syntactic constructs.  
This module does **not** perform formatting, pretty-printing, or AST-based code generation. It simply provides a safe, token-aware string reassembler.

This function is used in lexers, transpilers, and refactoring tools that operate directly on token streams.

---

## Features

- Converts a list of token objects into valid JavaScript code.
- Inserts spaces only when necessary to prevent syntactic changes.
- Correctly handles:
  - Identifiers and keywords
  - Numbers adjacent to identifiers
  - Private identifiers (`#x`)
  - Template literals (treated as atomic)
  - Punctuator edge cases (`-- >`, `+ ++`, `- --`)
- Avoids accidental operator merging.
- Produces predictable and stable output.

---

## When to Use

`stringifyTokens` is useful when:

- You have already tokenized code and want to reconstruct it safely.
- You are building a tokenizer, linter, or code analyzer.
- You are writing transformations on token arrays (e.g., rewriting import/export syntax).
- You want a safer alternative to joining token values directly.

This function is **not** intended for formatting or beautification. It does not attempt to restore the user's original whitespace layout.

---

## Example

```js
import stringifyTokens from "./stringifyTokens.js";

const tokens = [
  { type: "keyword", value: "import" },
  { type: "identifier", value: "foo" },
  { type: "identifier", value: "from" },
  { type: "string", value: '"module-x"' },
  { type: "punctuator", value: ";" }
];

console.log(stringifyTokens(tokens));
// Output:
// import foo from"module-x";
```

---

## How Spacing Works

### 1. Identifier / Keyword adjacency

```
let x    → space required
foo bar → space required
```

### 2. Number followed by word-like tokens

```
1in → invalid
1 in → correct
```

### 3. Word followed by number

```
await1 → ambiguous  
await 1 → safe
```

### 4. Template literals

Template tokens are always appended without surrounding spaces:

```
`hello ${name}` → template tokens stay intact
```

### 5. Punctuator edge cases

To avoid accidental operator merging:

```
-- >  → must not become -->
+ ++ → spaced
- -- → spaced
```

---

## API

### `stringifyTokens(tokens: Token[]): string`

Parameters:

| Name    | Type     | Description |
|---------|----------|-------------|
| tokens  | `Array`  | Array of token objects as produced by the tokenizer. |

Token shape:

```ts
{
  type: string;   // "keyword", "identifier", "number", "punctuator", etc.
  value: string;  // raw token text
  start: number;  // original character index
  end: number;
  line: number;
  column: number;
}
```

Returns: Reconstructed JavaScript source string.

---

## Directory Structure

```
lib/
  stringifyTokens/
    main.js       → implementation
    test/
      index.js    → all test cases
    README.md     → this file
```

---

## Running Tests

You can run the entire test suite using:

```bash
node lib/stringifyTokens/test
```

or:

```bash
cd lib/stringifyTokens
node test
```

The test runner prints individual PASS/FAIL results and a summary table. Failed tests are highlighted separately.

---

## Test Philosophy

Tests focus heavily on **import/export reconstruction**, because these syntaxes are sensitive to spacing and token adjacency:

- Default imports  
- Named imports  
- Namespace imports  
- Combined import forms  
- Dynamic imports  
- Export default  
- Export named  
- Export with specifiers  
- Re-export patterns  
- Edge cases without semicolons  

Each test follows the structure:

```js
runTest("Test name", stringifyTokens(tokens), expectedOutput);
```

---

## Notes

- The function assumes tokens are valid and ordered.  
- No AST information is used.  
- No formatting or indentation is applied.  
- Additional spacing rules can be added in `needsPunctuatorSpace()`.

## License

MIT
