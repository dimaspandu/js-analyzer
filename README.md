# JS Analyzer

JS Analyzer is a lightweight, token-based JavaScript analysis and transformation toolkit. Instead of building a full AST, it processes raw source code into a compact token stream and performs syntactic transformations such as module extraction and ESM-to-CJS rewriting.

This README explains the computational workflow, algorithms, module responsibilities, and how the codebase is structured.

---

# 1. Core Concept

### Token-Level Processing

JS Analyzer operates on **token arrays**, not ASTs. This design keeps components:

* simple to reason about,
* fast to execute,
* easy to extend,
* minimal in implementation.

The tokenizer generates a flat list of tokens. Every subsequent module performs pattern-based scanning or rewriting based on this token list.

---

# 2. Project Structure

```
js-analyzer/
│
├── lib/
│   ├── convertESMToCJSWithMeta/
│   ├── extractModules/
│   ├── stringifyTokens/
│   ├── tokenizer/
│   ├── transpileExportTokensToCJS/
│   └── transpileImportTokensToCJS/
│
├── test/
│   └── index.js
│
├── utils/
├── LICENSE
└── README.md
```

Each module is separated for clarity and modular reuse.

---

# 3. Computational Pipeline

The JS Analyzer workflow is a deterministic multi-stage pipeline:

1. **Tokenize** – Convert raw JavaScript text into token objects.
2. **Extract Modules** – Detect `import` and `export` patterns.
3. **Transpile Imports** – Rewrite ESM import syntax to CommonJS require calls.
4. **Transpile Exports** – Rewrite ESM export syntax to `exports.*` or `module.exports`.
5. **Convert with Meta** – High‑level orchestration that combines all steps.
6. **Stringify Tokens** – Convert the rewritten token array back to final JS code.

Every transformation is *syntax-only* and uses straightforward pattern matching.

---

# 4. Modules in Detail

## 4.1 Tokenizer (lib/tokenizer/)

The tokenizer scans source code character-by-character and builds tokens representing:

* keywords (`import`, `export`, `from`),
* identifiers,
* string literals,
* operators,
* punctuation (`{}`, `()`, `;`).

### Algorithm Overview

1. Iterate through characters.
2. Determine token type:

   * whitespace tokens are **preserved** (not skipped), including spaces, tabs, formfeeds, and vertical tabs. Newlines are emitted as separate `newline` tokens. This ensures exact positional fidelity for consumers like ESM→CJS transformers.ped
   * letter/underscore → identifier
   * digit → numeric literal
   * `'` or `"` → string literal
   * operator characters → immediate token
   * punctuation → immediate token
3. Append token objects to the array.

The tokenizer does *no interpretation*—just classification.

---

## 4.2 extractModules (lib/extractModules/)

This module scans the token stream to identify ESM module operations:

* static imports (`import X from "file"`),
* dynamic imports (`import("file")`),
* export declarations.

### Detection Procedure

1. Walk through the token list.
2. When encountering `keyword: import`:

   * If directly followed by a string → dynamic import.
   * If followed by identifiers → static import.
3. When encountering `keyword: export`:

   * Identify whether it exports a variable, function, class, named list, or default.

The output is a list of module usages with type and source.

---

## 4.3 transpileImportTokensToCJS (lib/transpileImportTokensToCJS/)

Transforms ESM import syntax into CJS equivalents.

Example:

```
import A from "./a.js";
```

becomes:

```
const A = require("./a.js").default;
```

### Algorithm Summary

1. Detect `import` keyword.
2. Determine import form:

   * default
   * named
   * namespace
3. Remove ESM tokens.
4. Inject new tokens representing CJS require syntax.

### Dynamic Import

Dynamic imports are mapped to a configurable identifier:

```
import("./data.json")
```

becomes:

```
requireByHttp("./data.json")
```

The default fallback is `requireByHttp`, but the user can pass a custom identifier.

---

## 4.4 transpileExportTokensToCJS (lib/transpileExportTokensToCJS/)

Handles rewriting `export` syntax into CommonJS equivalents.

Examples:

```
export const A = 1;
```

→

```
const A = 1;
exports.A = A;
```

Also:

```
export default function () {}
```

→

```
exports.default = function () {};
```

### Steps

1. Detect `export` keyword.
2. Classify the pattern:

   * variable declaration,
   * function or class declaration,
   * named exports (`export { A, B }`),
   * default export.
3. Replace with the appropriate CJS assignment tokens.

---

## 4.5 convertESMToCJSWithMeta (lib/convertESMToCJSWithMeta/)

This is the high‑level orchestration module tying everything together.
It runs the entire transformation pipeline and returns:

```
{
  code: "<final transformed JS>",
  meta: {
    module: string,
    type: "static" | "dynamic" | "export",
    assertions: object | null,
    literal: boolean,
    reason: null | "template-literal"
  }
}
```

Useful for advanced tooling, documentation, dependency visualization, or additional analysis.

---

# 5. stringifyTokens (lib/stringifyTokens/)

A final utility that converts the transformed token array back into JavaScript code.

### Behavior

* Concatenates tokens in order.
* Inserts spacing where necessary.
* Preserves literal values.

Because the transformation operates at token-level, stringification is simple and deterministic.

---

# 6. Test Suite (test/index.js)

A lightweight testing approach using a `runTest()` utility.
Tests verify:

* static imports,
* dynamic imports,
* named imports,
* default/named exports,
* complex export patterns.

The goal is to ensure token transformation correctness across a variety of syntactic structures.

---

# 7. End-to-End Flow Summary

```
Source Code
   ↓
Tokenizer
   ↓
Token Array
   ↓
extractModules
   ↓
transpileImportTokensToCJS
   ↓
transpileExportTokensToCJS
   ↓
stringifyTokens
   ↓
Final CJS Output
```

This deterministic workflow makes the tool predictable and fast.

---

# 8. Use Cases

JS Analyzer is suitable for:

* building lightweight bundlers,
* static dependency scanning,
* experimental transpilers,
* prototyping code rewriting tools,
* custom import/export analysis.

Its modular design allows developers to integrate individual components or run the entire pipeline.

---

# 9. License

MIT License.