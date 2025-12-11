# extractModules

`extractModules` is a utility for scanning JavaScript token streams to
extract all module dependencies. It identifies static imports, dynamic
imports, and export-from statements. This tool is useful for lightweight
code analysis, bundling, or building custom transpilers that need to
understand module relationships.

## Features

### 1. Static Imports

Supports all standard ES module static import forms, including:

``` js
import DefaultExport from "module";
import { a, b as c } from "module";
import * as Utils from "module";
import "side-effect-only";
import config from "./config.json" assert { type: "json" };
import sheet from "./styles.css" with { type: "css" };
```

### 2. Dynamic Imports

Supports dynamic import expressions, including:

``` js
import("module");
await import("module");
import("module", { with: { type: "css" } });
import(`./theme-${x}.css`);
import("x").then(m => m.default);
```

### 3. Export-From

Supports all export-from patterns:

``` js
export * from "module";
export { a, b } from "module";
export { c as d } from "module";
export { default as Comp } from "./comp.js";
export * as utils from "./utils.js";
```

## Architecture

    extractModules/
    ├── helper/
    │   ├── parseDynamicImport.js
    │   ├── parseExportFrom.js
    │   └── parseStaticImport.js
    ├── test/
    │   └── index.js
    ├── main.js
    └── README.md

### main.js

The main function coordinates:

1.  Iterating through tokens
2.  Detecting static imports, dynamic imports, or export-from statements
3.  Delegating to parsing helpers
4.  Returning an array of module extraction results

Each extracted entry has the form:

``` js
{
  module: "module-name",
  type: "static" | "dynamic" | "export",
  assertions: { type: "json" } | null,
  literal: true | false,
  reason: null | "template-literal"
}
```

## Testing

All tests are located in:

    extractModules/test/index.js

Tests are executed through a helper `runTest()` and cover:

### Static Imports

Covers default imports, named imports, namespace imports, combined
imports, side-effect imports, and imports using `assert {}` or
`with {}`.

### Dynamic Imports

Covers basic dynamic imports, awaited imports, imports with options,
template literals, template literals with options, and chained imports.

### Export-From

Covers wildcards, named exports, alias exports, namespace exports, and
mixed export conditions.

## Example Output

If given tokens representing:

``` js
import(`./theme-${x}.css`);
```

The output is:

``` js
{
  module: "`./theme-${x}.css`",
  type: "dynamic",
  assertions: null,
  literal: false,
  reason: "template-literal"
}
```

## When to Use extractModules

This utility is intended for:

-   Lightweight bundlers
-   Dependency graph analysis
-   Preprocessing modules
-   Custom ESM-to-CJS transpilation workflows

## Summary

`extractModules` is a lightweight, dependency-free module extractor
capable of identifying all major import and export-from patterns using
simple token analysis.

## License

MIT
