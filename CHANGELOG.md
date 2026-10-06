# Changelog

All notable changes to this project will be documented in this file.

# [1.3.0] - 2026-10-06

## Added

- Component function invocation support in `transpileJSX`:
  - Tag identifiers starting with an uppercase letter (e.g. `<Item>`, `<FooBar>`) now compile to function/component references instead of string tag names: `d(Item, ...)` rather than `d("Item", ...)`.
  - Lowercase tags (HTML elements) keep the existing string behavior: `<div>` → `d("div", ...)`.
- New test cases in `lib/transpileJSX/test/index.js` covering uppercase components without attributes, with attributes, with children, with expression children, mixed lowercase/uppercase nesting, and multi-word component names.

## Changed

- Only tag identifier handling in `parseElement()` changed. Factory name resolution (`compileJSX(source, factory)` parameter, `/** @jsx */` pragma, default `"d"`), attribute parsing, children parsing, and expression handling are unchanged.

---

# [1.2.9] - 2026-10-04

## Added

- Added `package.json` providing an `npm test` entry point, aliasing the existing aggregated runner (`node test`). No install step is required.
  - Declares `"type": "module"` so the `.js` files under `lib/` and `utils/` are loaded as ES modules.
  - Declares `"engines": { "node": ">=22.7" }`, matching the syntax already in use.
  - Marked `"private": true`.

## Changed

- Documented the dependency-free setup in `README.md`: `npm test` usage, running an individual suite directly, and an explicit note that `npm install` is unnecessary because `node_modules/` is never created.
- Added `package.json` to the project structure diagram in `README.md`.

## Notes

- No `dependencies` or `devDependencies` were introduced. All module imports are relative, and the only non-relative imports are Node built-ins (`node:assert/strict`) used by two test suites. The project remains dependency-free by design.

---

# [1.2.8] - 2026-10-04

## Fixed

- Fixed HTML minifier gluing attributes together, which silently changed markup semantics.
  - **Valueless attribute absorbed the next attribute.** The in-tag whitespace branch only kept the attribute separator when the previous token was `tag_name` or `attr_value`. `attr_name` was missing, so a boolean attribute (`disabled`, `required`, `checked`, …) or a bare `data-*` hook followed by any other attribute lost its separator and the two names merged into one. A browser then parses a single unknown attribute, so both names disappear and selectors such as `querySelector("[data-x]")` stop matching.
    - `<section class="a" data-x data-y="2">` produced `<section class="a" data-xdata-y="2">`.
  - The separator is now kept for every `tag_name -> attr_name`, `attr_name -> attr_name` and `attr_value -> attr_name` transition. The guard was also inverted to require the following token to be an `attr_name`, which drops whitespace hugging `=`, `>` and `/>` by construction instead of by exclusion. This matters: treating `attr_name` as a separator producer alone would have kept the space in `href = "b"`.
- Fixed HTML tokenizer discarding newlines inside a tag, so an attribute starting at column 0 had no separator token at all and was glued onto the previous value.
  - `<section\n  class="a"\naria-label="b"\n>` produced `<section class="a"aria-label="b">`.
  - Browsers reparse `"a"aria-label="b"` as two attributes, so this affected cleanliness rather than correctness, but it contradicted the minifier's documented lossless behaviour.
  - A newline inside a tag now emits a `whitespace` token, but only when indentation does not follow it (`readWhitespace` then supplies the separator) and when it does not hug `>` or `/>`. No new token appears where one already existed.

## Added

- Added 11 strict-equality regression cases to the HTML minifier test suite, covering valued/bare attributes, indented and column-0 layouts, whitespace around `=`, self-closing tags, boolean HTML attributes and SVG attribute casing. Each also asserts idempotency (`minifyHTML(minifyHTML(x)) === minifyHTML(x)`).
  - These use `node:assert/strict` rather than `runTest`, whose normalisation collapses whitespace runs and therefore cannot detect excess separators.
- Added tokenizer test `HTML: newline inside tag emits separator at column 0`, asserting the separator token exists between `attr_value` and `attr_name`, is not duplicated when indentation follows, and is absent before `tag_end`.

## Changed

- Documented the HTML attribute separator rule in `README.md` under Minifiers.

---

# [1.2.7] - 2026-10-02

## Fixed

- Fixed multiline `export const/let/var` assignments being truncated when the initializer continued on the next line, which emitted invalid code such as `const createDOMPP = ;() => installDOMPP();`.
  - `getExportBlockEndIndex` treated any line break as a statement terminator, so a break directly after an operator awaiting its right-hand operand ended the statement early.
  - The break heuristic is now skipped for continuation operators (assignment, `=>`, logical/comparison operators, ternary, comma, compound assignment).
  - Explicit `;` detection and balanced bracket scanning are unchanged, so single-line statements and block-bodied arrows behave exactly as before.

## Added

- Added regression tests for multiline export assignments in `transpileExportTokensToCJS`:
  - `Export const arrow function, line break after =`
  - `Export const arrow with logical operator across lines`
  - `Export const arrow with multiline call arguments`
  - `Export const arrow with multiline block body`
  - `Export const simple value still ends at line break` (guards against over-eager continuation)
- Added `runExportTranspileFromSource` test helper that tokenizes real source first, so tests carry `line` info. Previously all tests in this module used hand-written tokens without positional data, which silently disabled the line-break heuristic and left this path untested.

## Changed

- Documented `getExportBlockEndIndex` and its statement-boundary rules in `lib/transpileExportTokensToCJS/README.md`.

---

# [1.2.6] - 2026-09-26

## Added

- New module `lib/transpileJSX/` — minimal JSX-to-JS compiler that transforms JSX syntax into `d(tag, props, ...children)` call expressions.
  - Supports customizable factory name via `compileJSX(source, factory)` parameter or `/** @jsx name */` pragma in source.
  - Features: elements, self-closing tags, fragments (`<>...</>` → `factory.fragment(...)`), spread attributes, boolean attributes, expression containers, template literals in expressions.
- Comprehensive test suite (20 test cases) covering basic JSX, custom factory, pragma parsing, fragments, error handling, and demo-level components.

## Changed

- Updated `test/index.js` to include the new `transpileJSX` test suite.

---

# [1.2.5] - 2026-08-13

## Fixed

- Fixed HTML minifier to collapse newlines between text nodes and inline elements into a single space, matching standard HTML whitespace behavior.
- Removed unwanted leading/trailing spaces in minified output for multiline text content.

## Added

- Added regression tests for multiline text node collapsing in HTML minifier:
  - `Minify HTML - multiline text nodes collapse to single space`
  - `Minify HTML - inline element between text nodes`
  - `Minify HTML - inline element followed by text`

---

# [1.2.4] - 2026-08-13

## Fixed

- Fixed incorrect semicolon insertion for dynamic `import()` expressions nested inside other expressions (e.g., arrow function bodies, function arguments).
- Prevented duplicate semicolons when dynamic import is already followed by a semicolon.

## Added

- Added test coverage for dynamic import inside arrow function call (with and without parenthesized parameter) across tokenizer, `transpileImportTokensToCJS`, and `convertESMToCJSWithMeta`.

---

# [1.2.3] - 2026-08-13

## Fixed

- Fixed infinite loop in HTML tokenizer when parsing multiline tags with newline characters inside tag attributes.
- Fixed trailing whitespace before `>` in minified HTML output for tags with attributes.
- Renamed ambiguous test case to `Minify HTML - multiline tag with attributes` in HTML minifier test suite.

## Added

- Added test coverage for multiline HTML tags with attributes in both tokenizer and minifier.
- Added regression test ensuring no trailing space before closing tag bracket after minification.

---

# [1.2.2] - 2026-05-02

## Added

- Test cases for export default async function (named and anonymous) in convertESMToCJSWithMeta module.

---

# [1.2.1] - 2026-04-26

## Added

- Test cases for export default async function (named and anonymous) in transpileExportTokensToCJS module.

---

# [1.2.0] - 2026-01-25

## Added

- SAFE mode whitespace normalization:
  - Collapses consecutive or long whitespace tokens into a single space.
  - Automatically trims leading and trailing whitespace in SAFE output.
- Regression tests for CSS token adjacency handling, including:
  - `dimension + hash` (e.g. `1px #fff`)
  - Integration coverage for SAFE vs DEEP behavior.

## Changed

- SAFE minification behavior updated:
  - No longer preserves original indentation or excessive spacing.
  - Guarantees clean, single-space normalized output without re-stringification.
- SAFE mode output is now deterministic and idempotent.

## Fixed

- Fixed invalid CSS output in DEEP mode where `dimension` followed by `hash`
  could merge without required whitespace (e.g. `1px#fff`).
- Prevent leading and trailing whitespace artifacts in SAFE mode output.

---

# [1.1.0] - 2026-01-23

## Added

- CSS minifier enhanced with three levels:
  - `DEEP` (default): fully aggressive minification; removes comments, newlines, and all whitespace, then re-stringifies tokens.
  - `SMART`: removes comments and newlines; collapses consecutive whitespace into a single space; preserves single-space readability.
  - `SAFE`: removes comments and newlines only; preserves all original whitespace to avoid risky re-stringification.
- Leading and trailing newlines ignored in `SMART` mode to prevent extra spaces.
- Comprehensive test coverage added for all three levels, including:
  - Basic declarations, selectors, pseudo-classes, combinators.
  - Functions (`calc`, `linear-gradient`) and URL/string values.
  - Nested rules, media queries, and edge-case whitespace handling.

## Changed

- Default minification level changed from `SAFE` → `DEEP`.
- `minifyCSS` implementation refactored for clarity and maintainability.

## Fixed

- Prevent extra whitespace at start/end of minified CSS in `SMART` mode.
- Preserve spacing for single whitespace between values in `SMART` mode.

---

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# [1.0.0] - 2026-01-12

## Added

- Initial release of **JS Analyzer**.
- Core modules:
  - `lib/tokenizer` for JS, CSS, HTML, JSON.
  - `lib/stringifyTokens` for JS, CSS, HTML, JSON.
  - `lib/minifier` for JS, CSS, HTML, JSON.
  - `lib/extractModules` for module detection.
  - `transpileImportTokensToCJS` and `transpileExportTokensToCJS`.
  - `convertESMToCJSWithMeta` for full JS pipeline orchestration.
- Deterministic, token-based processing model.
- Test harness with aggregated test runner.
- Minifier supports safe operator spacing, comments, whitespace, and newline removal.
- Example minification:  
  `const percent = total === 0 ? 0 : ((passed/total) * 100).toFixed(2);` consistently minified.
- Explicit test coverage ensuring **multiline template literal whitespace and empty lines are preserved** during minification.

## Changed

- N/A (initial release).

## Deprecated

- N/A

## Removed

- N/A

## Fixed

- N/A

## Security

- N/A
