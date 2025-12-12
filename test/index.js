import tokenizer from "../lib/tokenizer/main.js";
import extractModules from "../lib/extractModules/main.js";
import transpileImportTokensToCJS from "../lib/transpileImportTokensToCJS/main.js";
import transpileExportTokensToCJS from "../lib/transpileExportTokensToCJS/main.js";
import stringifyTokens from "../lib/stringifyTokens/main.js";
import convertESMToCJSWithMeta from "../lib/convertESMToCJSWithMeta/main.js";
import runTest from "../utils/tester.js";

runTest(
  "Default import",
  tokenizer(`import DefaultExport from "module-1";`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "DefaultExport" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "from" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"module-1\"" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Named import",
  tokenizer(`import { a, b, c } from "mod";`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "{" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: "," },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "b" },
    { type: "punctuator", value: "," },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "c" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "}" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "from" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"mod\"" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Named import alias",
  tokenizer(`import { x as y } from "m";`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "{" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "x" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "as" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "y" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "}" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "from" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"m\"" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Namespace import",
  tokenizer(`import * as Utils from "utils";`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "*" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "as" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "Utils" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "from" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"utils\"" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Mixed import (default + named)",
  tokenizer(`import def, { a, b } from "pkg";`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "def" },
    { type: "punctuator", value: "," },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "{" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: "," },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "b" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "}" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "from" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"pkg\"" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Side-effect import",
  tokenizer(`import "side-effect-only";`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"side-effect-only\"" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Import with assert",
  tokenizer(`import config from "./config.json" assert { type: "json" };`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "config" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "from" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"./config.json\"" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "assert" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "{" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"json\"" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Import with module attributes (with)",
  tokenizer(`import sheet from "./styles.css" with { type: "css" };`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "sheet" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "from" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"./styles.css\"" },
    { type: "whitespace", value: " " },
    { type: "keyword", value: "with" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "{" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"css\"" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Side-effect import with attributes",
  tokenizer(`import "./globals.css" with { type: "css" };`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"./globals.css\"" },
    { type: "whitespace", value: " " },
    { type: "keyword", value: "with" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "{" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"css\"" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Namespace import with attributes",
  tokenizer(`import * as Data from "./data.json" with { type: "json" };`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "*" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "as" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "Data" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "from" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"./data.json\"" },
    { type: "whitespace", value: " " },
    { type: "keyword", value: "with" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "{" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"json\"" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Dynamic import - basic",
  tokenizer(`import("module-12");`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"module-12\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Dynamic import - awaited inside async function",
  tokenizer(`(async()=>{ await import("module-13"); })();`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "punctuator", value: "(" },
    { type: "identifier", value: "async" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "=>" },
    { type: "punctuator", value: "{" },
    { type: "whitespace", value: " " },
    { type: "keyword", value: "await" },
    { type: "whitespace", value: " " },
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"module-13\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Dynamic import - with options",
  tokenizer(`import("module-14", { with: { type: "css" } });`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"module-14\"" },
    { type: "punctuator", value: "," },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "{" },
    { type: "whitespace", value: " " },
    { type: "keyword", value: "with" },
    { type: "punctuator", value: ":" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "{" },
    { type: "whitespace", value: " " },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "whitespace", value: " " },
    { type: "string", value: "\"css\"" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "}" },
    { type: "whitespace", value: " " },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Dynamic import - template literal",
  tokenizer("import(`./x-${id}.js`);").map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "template_chunk", value: "`./x-" },
    { type: "template_expr_start", value: "${" },
    { type: "identifier", value: "id" },
    { type: "template_expr_end", value: "}" },
    { type: "template", value: ".js`" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Export named",
  tokenizer(`export { a, b, c };`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: 'keyword', value: 'export' },
    { type: 'whitespace', value: ' ' },
    { type: 'punctuator', value: '{' },
    { type: 'whitespace', value: ' ' },
    { type: 'identifier', value: 'a' },
    { type: 'punctuator', value: ',' },
    { type: 'whitespace', value: ' ' },
    { type: 'identifier', value: 'b' },
    { type: 'punctuator', value: ',' },
    { type: 'whitespace', value: ' ' },
    { type: 'identifier', value: 'c' },
    { type: 'whitespace', value: ' ' },
    { type: 'punctuator', value: '}' },
    { type: 'punctuator', value: ';' }
  ]
);

runTest(
  "Export alias",
  tokenizer(`export { a as x, b as y };`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: 'keyword', value: 'export' },
    { type: 'whitespace', value: ' ' },
    { type: 'punctuator', value: '{' },
    { type: 'whitespace', value: ' ' },

    { type: 'identifier', value: 'a' },
    { type: 'whitespace', value: ' ' },
    { type: 'identifier', value: 'as' },
    { type: 'whitespace', value: ' ' },
    { type: 'identifier', value: 'x' },
    { type: 'punctuator', value: ',' },
    { type: 'whitespace', value: ' ' },

    { type: 'identifier', value: 'b' },
    { type: 'whitespace', value: ' ' },
    { type: 'identifier', value: 'as' },
    { type: 'whitespace', value: ' ' },
    { type: 'identifier', value: 'y' },
    { type: 'whitespace', value: ' ' },

    { type: 'punctuator', value: '}' },
    { type: 'punctuator', value: ';' }
  ]
);

runTest(
  "Export default function",
  tokenizer(`export default function () {};`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: 'keyword', value: 'export' },
    { type: 'whitespace', value: ' ' },
    { type: 'keyword', value: 'default' },
    { type: 'whitespace', value: ' ' },
    { type: 'keyword', value: 'function' },
    { type: 'whitespace', value: ' ' },
    { type: 'punctuator', value: '(' },
    { type: 'punctuator', value: ')' },
    { type: 'whitespace', value: ' ' },
    { type: 'punctuator', value: '{' },
    { type: 'punctuator', value: '}' },
    { type: 'punctuator', value: ';' }
  ]
);

runTest(
  "Export default expression",
  tokenizer(`export default 123;`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: 'keyword', value: 'export' },
    { type: 'whitespace', value: ' ' },
    { type: 'keyword', value: 'default' },
    { type: 'whitespace', value: ' ' },
    { type: 'number', value: '123' },
    { type: 'punctuator', value: ';' }
  ]
);

runTest(
  "Export named from module",
  tokenizer(`export { a, b } from "lib";`).map(t => ({
    type: t.type,
    value: t.value
  })),
  [
    { type: 'keyword', value: 'export' },
    { type: 'whitespace', value: ' ' },
    { type: 'punctuator', value: '{' },
    { type: 'whitespace', value: ' ' },
    { type: 'identifier', value: 'a' },
    { type: 'punctuator', value: ',' },
    { type: 'whitespace', value: ' ' },
    { type: 'identifier', value: 'b' },
    { type: 'whitespace', value: ' ' },
    { type: 'punctuator', value: '}' },
    { type: 'whitespace', value: ' ' },
    { type: 'identifier', value: 'from' },
    { type: 'whitespace', value: ' ' },
    { type: 'string', value: '"lib"' },
    { type: 'punctuator', value: ';' }
  ]
);

/* ------------------------------------------------------
 * 1. STATIC IMPORTS
 * ------------------------------------------------------ */

// 1. Default import
runTest(
  "Static Import - default",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "DefaultExport" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"module-1"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "module-1",
    type: "static",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 2. Named imports
runTest(
  "Static Import - named",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "b" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "c" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"module-2"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "module-2",
    type: "static",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 3. Named imports alias
runTest(
  "Static Import - named alias",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "a" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "x" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "b" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "y" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"module-3"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "module-3",
    type: "static",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 4. Default + named
runTest(
  "Static Import - default + named",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "Something" },
    { type: "punctuator", value: "," },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "foo" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "bar" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "baz" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"module-4"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "module-4",
    type: "static",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 5. Namespace
runTest(
  "Static Import - namespace",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "Utils" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"module-5"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "module-5",
    type: "static",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 6. Default + namespace
runTest(
  "Static Import - default + namespace",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "DefaultThing" },
    { type: "punctuator", value: "," },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "Everything" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"module-6"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "module-6",
    type: "static",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 7. Side-effect only
runTest(
  "Static Import - side effect",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "string", value: '"module-7"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "module-7",
    type: "static",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 8. Import assertions (classic)
runTest(
  "Static Import - with assertions",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "config" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./config.json"' },
    { type: "identifier", value: "assert" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "string", value: '"json"' },
    { type: "punctuator", value: "}" }
  ]),
  [{
    module: "./config.json",
    type: "static",
    assertions: { type: "json" },
    literal: true,
    reason: null
  }]
);

// 9. import with { type: "css" }
runTest(
  "Static Import - with module attributes `with`",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "sheet" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./styles.css"' },
    { type: "identifier", value: "with" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "string", value: '"css"' },
    { type: "punctuator", value: "}" }
  ]),
  [{
    module: "./styles.css",
    type: "static",
    assertions: { type: "css" },
    literal: true,
    reason: null
  }]
);

// 10. side-effect with module attributes
runTest(
  "Static Import - side effect + with",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "string", value: '"./globals.css"' },
    { type: "identifier", value: "with" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "string", value: '"css"' },
    { type: "punctuator", value: "}" }
  ]),
  [{
    module: "./globals.css",
    type: "static",
    assertions: { type: "css" },
    literal: true,
    reason: null
  }]
);

// 11. namespace import with attributes
runTest(
  "Static Import - namespace + with",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "Data" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./data.json"' },
    { type: "identifier", value: "with" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "string", value: '"json"' },
    { type: "punctuator", value: "}" }
  ]),
  [{
    module: "./data.json",
    type: "static",
    assertions: { type: "json" },
    literal: true,
    reason: null
  }]
);


/* ------------------------------------------------------
 * 2. DYNAMIC IMPORTS
 * ------------------------------------------------------ */

// 12
runTest(
  "Dynamic import - basic",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: '"module-12"' },
    { type: "punctuator", value: ")" }
  ]),
  [{
    module: "module-12",
    type: "dynamic",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 13
runTest(
  "Dynamic import - awaited",
  extractModules([
    { type: "keyword", value: "await" },
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: '"module-13"' },
    { type: "punctuator", value: ")" }
  ]),
  [{
    module: "module-13",
    type: "dynamic",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 14
runTest(
  "Dynamic import - with attributes",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: '"module-14"' },
    { type: "punctuator", value: "," },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "with" },
    { type: "punctuator", value: ":" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "string", value: '"css"' },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ")" }
  ]),
  [{
    module: "module-14",
    type: "dynamic",
    assertions: { type: "css" },
    literal: true,
    reason: null
  }]
);

// 15
runTest(
  "Dynamic import - custom options",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: '"module-15"' },
    { type: "punctuator", value: "," },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "namespace" },
    { type: "punctuator", value: ":" },
    { type: "string", value: '"ExampleNS"' },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ")" }
  ]),
  [{
    module: "module-15",
    type: "dynamic",
    assertions: { namespace: "ExampleNS" },
    literal: true,
    reason: null
  }]
);

// 16
runTest(
  "Dynamic import - assert JSON",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: '"./config.json"' },
    { type: "punctuator", value: "," },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "assert" },
    { type: "punctuator", value: ":" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "string", value: '"json"' },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ")" }
  ]),
  [{
    module: "./config.json",
    type: "dynamic",
    assertions: { type: "json" },
    literal: true,
    reason: null
  }]
);

// 17
runTest(
  "Dynamic import - template literal",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "template_chunk", value: "`https://example.com/module-17.js`" },
    { type: "punctuator", value: ")" }
  ]),
  [{
    module: "`https://example.com/module-17.js`",
    type: "dynamic",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 18
runTest(
  "Dynamic import - single quote",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "'https://example.com/module-18.js'" },
    { type: "punctuator", value: ")" }
  ]),
  [{
    module: "https://example.com/module-18.js",
    type: "dynamic",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 19
runTest(
  "Dynamic import - template + options",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "template_chunk", value: "`./style-${theme}.css`" },
    { type: "punctuator", value: "," },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "with" },
    { type: "punctuator", value: ":" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "string", value: '"css"' },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ")" }
  ]),
  [{
    module: "`./style-${theme}.css`",
    type: "dynamic",
    assertions: { type: "css" },
    literal: false,
    reason: "template-literal"
  }]
);

// 20
runTest(
  "Dynamic import - chained",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: '"module-20"' },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "then" }
  ]),
  [{
    module: "module-20",
    type: "dynamic",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 21
runTest(
  "Dynamic import - inside export function",
  extractModules([
    { type: "keyword", value: "export" },
    { type: "keyword", value: "function" },
    { type: "identifier", value: "getModule" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "{" },
    { type: "keyword", value: "return" },
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: '"module-21"' },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" },
    { type: "punctuator", value: "}" }
  ]),
  [{
    module: "module-21",
    type: "dynamic",
    assertions: null,
    literal: true,
    reason: null
  }]
);


/* ------------------------------------------------------
 * 3. EXPORT-FROM
 * ------------------------------------------------------ */

// 22
runTest(
  "Export all",
  extractModules([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./module-22.js"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "./module-22.js",
    type: "export",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 23
runTest(
  "Export named",
  extractModules([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "foo" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "bar" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./module-23.js"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "./module-23.js",
    type: "export",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 24
runTest(
  "Export named alias",
  extractModules([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "baz" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "myBaz" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./module-24.js"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "./module-24.js",
    type: "export",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 25
runTest(
  "Export default alias",
  extractModules([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "keyword", value: "default" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "RemoteDefault" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./module-25.js"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "./module-25.js",
    type: "export",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 26
runTest(
  "Export mixture",
  extractModules([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "keyword", value: "default" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "MainComponent" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "helper" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./components.js"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "./components.js",
    type: "export",
    assertions: null,
    literal: true,
    reason: null
  }]
);

// 27
runTest(
  "Export namespace",
  extractModules([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "utils" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./utils.js"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "./utils.js",
    type: "export",
    assertions: null,
    literal: true,
    reason: null
  }]
);

function transpileImportTokensToCJSPreprocessor(tokens, dynamicImportIdentifier = "requireByHttp") {
  // Filter tokens (remove newline, whitespace, comment)
  tokens = tokens.filter(
    t => t.type !== "newline" && t.type !== "whitespace" && t.type !== "comment"
  );

  return transpileImportTokensToCJS(tokens, dynamicImportIdentifier);
}

/* ---------------------------------------------
 * 1. Import - default
 * --------------------------------------------- */
runTest(
  "Import - default",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "DefaultExport" },
    { type: "identifier", value: "from" },
    { type: "string", value: "\"mod\"" },
    { type: "punctuator", value: ";" }
  ]),
  [
    { type: "keyword", value: "const" },
    { type: "identifier", value: "DefaultExport" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"mod\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "default" },
    { type: "punctuator", value: ";" }
  ]
);

/* ---------------------------------------------
 * 2. Import - named
 * --------------------------------------------- */
runTest(
  "Import - named",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "b" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: "\"x\"" },
    { type: "punctuator", value: ";" }
  ]),
  [
    { type: "keyword", value: "const" },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"x\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: ";" },

    { type: "keyword", value: "const" },
    { type: "identifier", value: "b" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"x\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "b" },
    { type: "punctuator", value: ";" }
  ]
);

/* ---------------------------------------------
 * 3. Import - namespace
 * --------------------------------------------- */
runTest(
  "Import - namespace",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "NS" },
    { type: "identifier", value: "from" },
    { type: "string", value: "\"lib\"" }
  ]),
  [
    { type: "keyword", value: "const" },
    { type: "identifier", value: "NS" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"lib\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" }
  ]
);

/* ---------------------------------------------
 * 4. Import - default + named
 * --------------------------------------------- */
runTest(
  "Import - default + named",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "A" },
    { type: "punctuator", value: "," },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "x" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "y" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: "\"pkg\"" }
  ]),
  [
    { type: "keyword", value: "const" },
    { type: "identifier", value: "A" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"pkg\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "default" },
    { type: "punctuator", value: ";" },

    { type: "keyword", value: "const" },
    { type: "identifier", value: "x" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"pkg\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "x" },
    { type: "punctuator", value: ";" },

    { type: "keyword", value: "const" },
    { type: "identifier", value: "y" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"pkg\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "y" },
    { type: "punctuator", value: ";" }
  ]
);

/* ---------------------------------------------
 * 5. Import - no semicolon
 * --------------------------------------------- */
runTest(
  "Import - no semicolon",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "X" },
    { type: "identifier", value: "from" },
    { type: "string", value: "\"m\"" }
  ]),
  [
    { type: "keyword", value: "const" },
    { type: "identifier", value: "X" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"m\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "default" },
    { type: "punctuator", value: ";" }
  ]
);

/* ---------------------------------------------
 * 6. Import - dynamic
 * --------------------------------------------- */
runTest(
  "Import - dynamic",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"abc\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" }
  ]),
  [
    { type: "identifier", value: "requireByHttp" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"abc\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" }
  ]
);

/* ---------------------------------------------
 * 7. Import - assertion
 * --------------------------------------------- */
runTest(
  "Import - assertion",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "data" },
    { type: "identifier", value: "from" },
    { type: "string", value: "\"file.json\"" },
    { type: "identifier", value: "assert" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "string", value: "\"json\"" },
    { type: "punctuator", value: "}" }
  ]),
  [
    { type: "keyword", value: "const" },
    { type: "identifier", value: "data" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"file.json\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "default" },
    { type: "punctuator", value: ";" }
  ]
);

/* ---------------------------------------------
 * 8. Import - tight spacing keyword + identifier
 * --------------------------------------------- */
runTest(
  "Import - tight spacing keyword + identifier",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "A" }
  ]),
  [
    { type: "keyword", value: "import" },
    { type: "identifier", value: "A" }
  ]
);

/* ---------------------------------------------
 * 9. Import - number-like identifier
 * --------------------------------------------- */
runTest(
  "Import - number-like identifier",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "number", value: "1" },
    { type: "identifier", value: "in" }
  ]),
  [
    { type: "keyword", value: "import" },
    { type: "number", value: "1" },
    { type: "identifier", value: "in" }
  ]
);

/* ---------------------------------------------
 * 10. Import - template literal path
 * --------------------------------------------- */
runTest(
  "Import - template literal path",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "A" },
    { type: "identifier", value: "from" },
    { type: "template", value: "`x/${y}`" }
  ]),
  [
    { type: "keyword", value: "import" },
    { type: "identifier", value: "A" },
    { type: "identifier", value: "from" },
    { type: "template", value: "`x/${y}`" }
  ]
);

/* ---------------------------------------------
 * 11. Import - dynamic template
 * --------------------------------------------- */
runTest(
  "Import - dynamic template",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "template", value: "`./${x}`" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" }
  ]),
  [
    { type: "identifier", value: "requireByHttp" },
    { type: "punctuator", value: "(" },
    { type: "template", value: "`./${x}`" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" }
  ]
);

/* ---------------------------------------------
 * 12. Import - private identifier
 * --------------------------------------------- */
runTest(
  "Import - private identifier",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "privateIdentifier", value: "#x" }
  ]),
  [
    { type: "keyword", value: "import" },
    { type: "privateIdentifier", value: "#x" }
  ]
);

/* ---------------------------------------------
 * 13. Complex - import then export
 * --------------------------------------------- */
runTest(
  "Complex - import then export",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "X" },
    { type: "identifier", value: "from" },
    { type: "string", value: "\"m1\"" },
    { type: "keyword", value: "export" },
    { type: "identifier", value: "X" }
  ]),
  [
    { type: "keyword", value: "const" },
    { type: "identifier", value: "X" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"m1\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "default" },
    { type: "punctuator", value: ";" },

    { type: "keyword", value: "export" },
    { type: "identifier", value: "X" }
  ]
);

/* ---------------------------------------------
 * 14. Complex - multiple imports
 * --------------------------------------------- */
runTest(
  "Complex - multiple imports",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "A" },
    { type: "identifier", value: "from" },
    { type: "string", value: "\"a\"" },

    { type: "keyword", value: "import" },
    { type: "identifier", value: "B" },
    { type: "identifier", value: "from" },
    { type: "string", value: "\"b\"" }
  ]),
  [
    { type: "keyword", value: "const" },
    { type: "identifier", value: "A" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"a\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "default" },
    { type: "punctuator", value: ";" },

    { type: "keyword", value: "const" },
    { type: "identifier", value: "B" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"b\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "default" },
    { type: "punctuator", value: ";" }
  ]
);

/* ---------------------------------------------
 * 15. Complex - import assert then export
 * --------------------------------------------- */
runTest(
  "Complex - import assert then export",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "cfg" },
    { type: "identifier", value: "from" },
    { type: "string", value: "\"conf.json\"" },
    { type: "identifier", value: "assert" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "string", value: "\"json\"" },
    { type: "punctuator", value: "}" },
    { type: "keyword", value: "export" },
    { type: "identifier", value: "cfg" }
  ]),
  [
    { type: "keyword", value: "const" },
    { type: "identifier", value: "cfg" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"conf.json\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "default" },
    { type: "punctuator", value: ";" },

    { type: "keyword", value: "export" },
    { type: "identifier", value: "cfg" }
  ]
);

/* ---------------------------------------------
 * 16. Import - dynamic with custom identifier
 * --------------------------------------------- */
runTest(
  "Import - dynamic (custom identifier)",
  transpileImportTokensToCJSPreprocessor([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"x\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "then" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "=>" },
    { type: "punctuator", value: "{" },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" },
  ], "customLoader"),
  [
    { type: "identifier", value: "customLoader" },
    { type: "punctuator", value: "(" },
    { type: "string", value: "\"x\"" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "then" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "=>" },
    { type: "punctuator", value: "{" },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" },
  ]
);

function transpileExportTokensToCJSPreprocessor(tokens) {
  // Filter tokens (remove newline, whitespace, comment)
  tokens = tokens.filter(
    t => t.type !== "newline" && t.type !== "whitespace" && t.type !== "comment"
  );

  return transpileExportTokensToCJS(tokens);
}

/* ============================================================================
 * 1. EXPORT VARIABLE DECLARATIONS
 * ============================================================================ */

runTest(
  "Export const assignment",
  transpileExportTokensToCJSPreprocessor([
    { type: "keyword", value: "export" },
    { type: "keyword", value: "const" },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: "=" },
    { type: "number", value: "1" },
    { type: "punctuator", value: ";" }
  ]),
  [
    { type: "keyword", value: "const" },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: "=" },
    { type: "number", value: "1" },
    { type: "punctuator", value: ";" },
    { type: "identifier", value: "exports" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Export let without value",
  transpileExportTokensToCJSPreprocessor([
    { type: "keyword", value: "export" },
    { type: "keyword", value: "let" },
    { type: "identifier", value: "noValue" },
    { type: "punctuator", value: ";" }
  ]),
  [
    { type: "keyword", value: "let" },
    { type: "identifier", value: "noValue" },
    { type: "punctuator", value: ";" },
    { type: "identifier", value: "exports" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "noValue" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "noValue" },
    { type: "punctuator", value: ";" }
  ]
);


/* ============================================================================
 * 2. EXPORT { x, y }
 * ============================================================================ */

runTest(
  "Export named bindings",
  transpileExportTokensToCJSPreprocessor([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "x" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "y" },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ";" }
  ]),
  [
    { type: "identifier", value: "exports" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "x" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "x" },
    { type: "punctuator", value: ";" },

    { type: "identifier", value: "exports" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "y" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "y" },
    { type: "punctuator", value: ";" }
  ]
);


/* ============================================================================
 * 3. EXPORT { a as b }
 * ============================================================================ */

runTest(
  "Export alias",
  transpileExportTokensToCJSPreprocessor([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "a" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "b" },
    { type: "punctuator", value: "}" },
    { type: "punctuator", value: ";" }
  ]),
  [
    { type: "identifier", value: "exports" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "b" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: ";" }
  ]
);


/* ============================================================================
 * 4. DEFAULT EXPORT - NAMED FUNCTION
 * ============================================================================ */

runTest(
  "Export default named function",
  transpileExportTokensToCJSPreprocessor([
    { type: "keyword", value: "export" },
    { type: "keyword", value: "default" },
    { type: "keyword", value: "function" },
    { type: "identifier", value: "myFunc" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "{" },
    { type: "punctuator", value: "}" }
  ]),
  [
    { type: "keyword", value: "function" },
    { type: "identifier", value: "myFunc" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "{" },
    { type: "punctuator", value: "}" },

    { type: "identifier", value: "exports" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "default" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "myFunc" },
    { type: "punctuator", value: ";" }
  ]
);


/* ============================================================================
 * 5. EXPORT FUNCTION / ASYNC / GENERATOR
 * ============================================================================ */

runTest(
  "Export normal function",
  transpileExportTokensToCJSPreprocessor([
    { type: "keyword", value: "export" },
    { type: "keyword", value: "function" },
    { type: "identifier", value: "greet" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "{" },
    { type: "punctuator", value: "}" }
  ]),
  [
    { type: "keyword", value: "function" },
    { type: "identifier", value: "greet" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "{" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "exports" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "greet" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "greet" },
    { type: "punctuator", value: ";" }
  ]
);

runTest(
  "Export async function",
  transpileExportTokensToCJSPreprocessor([
    { type: "keyword", value: "export" },
    { type: "identifier", value: "async" },
    { type: "keyword", value: "function" },
    { type: "identifier", value: "fetchData" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "{" },
    { type: "punctuator", value: "}" }
  ]),
  [
    { type: "identifier", value: "async" },
    { type: "keyword", value: "function" },
    { type: "identifier", value: "fetchData" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "{" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "exports" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "fetchData" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "fetchData" },
    { type: "punctuator", value: ";" }
  ]
);


/* ============================================================================
 * 6. EXPORT * FROM "module"
 * ============================================================================ */

runTest(
  "Export all from string module",
  transpileExportTokensToCJSPreprocessor([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./mod.js"' }
  ]),
  [
    { type: "identifier", value: "Object" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "assign" },
    { type: "punctuator", value: "(" },
    { type: "identifier", value: "exports" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: '"./mod.js"' },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" }
  ]
);


/* ============================================================================
 * 7. export * as utils from "./mod.js"
 * ============================================================================ */

runTest(
  "Export namespace as",
  transpileExportTokensToCJSPreprocessor([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "utils" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./util.js"' }
  ]),
  [
    { type: "identifier", value: "exports" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "utils" },
    { type: "punctuator", value: "=" },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "string", value: '"./util.js"' },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" }
  ]
);


/* ============================================================================
 * 8. export * from dynamicIdentifier
 * ============================================================================ */

runTest(
  "Export all from identifier",
  transpileExportTokensToCJSPreprocessor([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "from" },
    { type: "identifier", value: "dynamicPath" }
  ]),
  [
    { type: "identifier", value: "Object" },
    { type: "punctuator", value: "." },
    { type: "identifier", value: "assign" },
    { type: "punctuator", value: "(" },
    { type: "identifier", value: "exports" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "require" },
    { type: "punctuator", value: "(" },
    { type: "identifier", value: "dynamicPath" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: ";" }
  ]
);

/**
 * IMPORT TESTS
 */

// 1. Default import
runTest(
  "Import - default",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "DefaultExport" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"mod"' },
    { type: "punctuator", value: ";" }
  ]),
  `import DefaultExport from"mod";`
);

// 2. Named import
runTest(
  "Import - named",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "b" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"x"' },
    { type: "punctuator", value: ";" }
  ]),
  `import{a,b}from"x";`
);

// 3. Namespace import
runTest(
  "Import - namespace",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "NS" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"lib"' }
  ]),
  `import*as NS from"lib"`
);

// 4. Mixed import
runTest(
  "Import - default + named",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "A" },
    { type: "punctuator", value: "," },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "x" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "y" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"pkg"' },
  ]),
  `import A,{x,y}from"pkg"`
);

// 5. Import without semicolon
runTest(
  "Import - no semicolon",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "X" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"m"' }
  ]),
  `import X from"m"`
);

// 6. Dynamic import
runTest(
  "Import - dynamic",
  stringifyTokens([
    { type: "identifier", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: '"abc"' },
    { type: "punctuator", value: ")" }
  ]),
  `import("abc")`
);

// 7. Import with assertion
runTest(
  "Import - assertion",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "data" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"file.json"' },
    { type: "identifier", value: "assert" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "string", value: '"json"' },
    { type: "punctuator", value: "}" }
  ]),
  `import data from"file.json"assert{type:"json"}`
);


/**
 * EXPORT TESTS
 */

// 8. Export default function
runTest(
  "Export - default function",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "keyword", value: "default" },
    { type: "keyword", value: "function" },
    { type: "identifier", value: "f" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "{" },
    { type: "punctuator", value: "}" }
  ]),
  `export default function f(){}`
);

// 9. Export default class
runTest(
  "Export - default class",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "keyword", value: "default" },
    { type: "keyword", value: "class" },
    { type: "identifier", value: "C" },
    { type: "punctuator", value: "{" },
    { type: "punctuator", value: "}" }
  ]),
  `export default class C{}`
);

// 10. Export named identifiers
runTest(
  "Export - named list",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "b" },
    { type: "punctuator", value: "}" }
  ]),
  `export{a,b}`
);

// 11. Export with alias
runTest(
  "Export - alias",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "a" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "x" },
    { type: "punctuator", value: "}" }
  ]),
  `export{a as x}`
);

// 12. Export namespace
runTest(
  "Export - namespace",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "NS" }
  ]),
  `export*as NS`
);

// 13. Export from (named)
runTest(
  "Export - named from",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "b" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"lib"' }
  ]),
  `export{a,b}from"lib"`
);

// 14. Export * from
runTest(
  "Export - export all from",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"pkg"' }
  ]),
  `export*from"pkg"`
);

// 15. Export string literal
runTest(
  "Export - string literal",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "string", value: '"hello"' }
  ]),
  `export"hello"`
);

/**
 * ADVANCED SPACING CASES
 */

// 16. Import with no space after keyword (identifier follows)
runTest(
  "Import - tight spacing keyword + identifier",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "A" },
  ]),
  `import A`
);

// 17. Import with identifier starting with a number-like char (to check spacing)
runTest(
  "Import - check 1in case",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "number", value: "1" },
    { type: "identifier", value: "in" },
  ]),
  `import 1 in`
);

// 18. Default import + template literal
runTest(
  "Import - template literal path",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "A" },
    { type: "identifier", value: "from" },
    { type: "template", value: "`x/${y}`" },
  ]),
  "import A from`x/${y}`"
);

// 19. Dynamic import using template literal
runTest(
  "Import - dynamic template",
  stringifyTokens([
    { type: "identifier", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "template", value: "`./${x}`" },
    { type: "punctuator", value: ")" }
  ]),
  "import(`./${x}`)"
);

// 20. Import with private identifier (synthetic case)
runTest(
  "Import - private id (synthetic)",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "privateIdentifier", value: "#x" }
  ]),
  `import #x`
);

/**
 * EXPORT EDGE CASES
 */

// 21. Export number literal
runTest(
  "Export - number literal",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "number", value: "123" }
  ]),
  `export 123`
);

// 22. Export default arrow function
runTest(
  "Export - default arrow",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "keyword", value: "default" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "=>" },
    { type: "identifier", value: "x" }
  ]),
  `export default()=>x`
);

// 23. Export of template literal
runTest(
  "Export - template literal",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "template", value: "`hello`" },
  ]),
  "export`hello`"
);

// 24. Export private identifier
runTest(
  "Export - private id",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "privateIdentifier", value: "#z" }
  ]),
  `export #z`
);

// 25. Export destructuring list
runTest(
  "Export - destructuring",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "a" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "b" },
    { type: "punctuator", value: ":" },
    { type: "identifier", value: "c" },
    { type: "punctuator", value: "}" }
  ]),
  `export{a,b:c}`
);

/**
 * PUNCTUATOR EDGE RULES
 */

// 26. "--" followed by ">" must have space
runTest(
  "Punctuator - prevent '-->'",
  stringifyTokens([
    { type: "punctuator", value: "--" },
    { type: "punctuator", value: ">" }
  ]),
  `-- >`
);

// 27. "+ ++" must have space
runTest(
  "Punctuator - + ++",
  stringifyTokens([
    { type: "punctuator", value: "+" },
    { type: "punctuator", value: "++" }
  ]),
  `+ ++`
);

// 28. "- --" must have space
runTest(
  "Punctuator - - --",
  stringifyTokens([
    { type: "punctuator", value: "-" },
    { type: "punctuator", value: "--" }
  ]),
  `- --`
);

/**
 * COMPLEX IMPORT & EXPORT CHAINS
 */

// 29. Import + export together (synthetic)
runTest(
  "Complex - import then export",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "X" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"m1"' },
    { type: "keyword", value: "export" },
    { type: "identifier", value: "X" }
  ]),
  `import X from"m1"export X`
);

// 30. Re-export with alias
runTest(
  "Complex - reexport alias",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "x" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "y" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"mod"' }
  ]),
  `export{x as y}from"mod"`
);

// 31. Export default numeric expression
runTest(
  "Export - default numeric expression",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "keyword", value: "default" },
    { type: "number", value: "42" }
  ]),
  `export default 42`
);

// 32. Export default template literal
runTest(
  "Export - default template",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "keyword", value: "default" },
    { type: "template", value: "`x`" }
  ]),
  "export default`x`"
);

// 33. Export arrow expression with template
runTest(
  "Export - arrow with template",
  stringifyTokens([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "(" },
    { type: "punctuator", value: ")" },
    { type: "punctuator", value: "=>" },
    { type: "template", value: "`Hello`" }
  ]),
  "export()=>`Hello`"
);

// 34. Multiple imports chained
runTest(
  "Complex - multiple imports",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "A" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"a"' },
    { type: "keyword", value: "import" },
    { type: "identifier", value: "B" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"b"' }
  ]),
  `import A from"a"import B from"b"`
);

// 35. Import assertion + export
runTest(
  "Complex - import assert then export",
  stringifyTokens([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "cfg" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"conf.json"' },
    { type: "identifier", value: "assert" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "type" },
    { type: "punctuator", value: ":" },
    { type: "string", value: '"json"' },
    { type: "punctuator", value: "}" },
    { type: "keyword", value: "export" },
    { type: "identifier", value: "cfg" }
  ]),
  `import cfg from"conf.json"assert{type:"json"}export cfg`
);

/* ============================================================
   1. STATIC IMPORTS
   ============================================================ */

runTest(
  "Import default",
  convertESMToCJSWithMeta(`import DefaultExport from "module-1";`),
  {
    code: `const DefaultExport=require("module-1").default;`,
    meta: [
      {
        module: "module-1",
        type: "static",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Named imports",
  convertESMToCJSWithMeta(`import { a, b, c } from "module-2";`),
  {
    code: `const a=require("module-2").a;const b=require("module-2").b;const c=require("module-2").c;`,
    meta: [
      {
        module: "module-2",
        type: "static",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Named imports with alias",
  convertESMToCJSWithMeta(`import { a as x, b as y } from "module-3";`),
  {
    code: `const x=require("module-3").a;const y=require("module-3").b;`,
    meta: [
      {
        module: "module-3",
        type: "static",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Default + named",
  convertESMToCJSWithMeta(`import Something, { foo, bar as baz } from "module-4";`),
  {
    code: `const Something=require("module-4").default;const foo=require("module-4").foo;const baz=require("module-4").bar;`,
    meta: [
      {
        module: "module-4",
        type: "static",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Namespace import",
  convertESMToCJSWithMeta(`import * as Utils from "module-5";`),
  {
    code: `const Utils=require("module-5");`,
    meta: [
      {
        module: "module-5",
        type: "static",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Default + namespace",
  convertESMToCJSWithMeta(`import DefaultThing, * as Everything from "module-6";`),
  {
    code: `const Everything=require("module-6");const DefaultThing=Everything.default;`,
    meta: [
      {
        module: "module-6",
        type: "static",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Side-effect import",
  convertESMToCJSWithMeta(`import "module-7";`),
  {
    code: `require("module-7");`,
    meta: [
      {
        module: "module-7",
        type: "static",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Import assertions (classic)",
  convertESMToCJSWithMeta(`import config from "./config.json" assert { type: "json" };`),
  {
    code: `const config=require("./config.json").default;`,
    meta: [
      {
        module: "./config.json",
        type: "static",
        assertions: { type: "json" },
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "With module attributes",
  convertESMToCJSWithMeta(`import sheet from "./styles.css" with { type: "css" };`),
  {
    code: `const sheet=require("./styles.css").default;`,
    meta: [
      {
        module: "./styles.css",
        type: "static",
        assertions: { type: "css" },
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Side-effect + module attributes",
  convertESMToCJSWithMeta(`import "./globals.css" with { type: "css" };`),
  {
    code: `require("./globals.css");`,
    meta: [
      {
        module: "./globals.css",
        type: "static",
        assertions: { type: "css" },
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Namespace import + module attributes",
  convertESMToCJSWithMeta(`import * as Data from "./data.json" with { type: "json" };`),
  {
    code: `const Data=require("./data.json");`,
    meta: [
      {
        module: "./data.json",
        type: "static",
        assertions: { type: "json" },
        literal: true,
        reason: null
      }
    ]
  }
);

/* ============================================================
   2. DYNAMIC IMPORTS
   ============================================================ */

runTest(
  "Dynamic import basic",
  convertESMToCJSWithMeta(`import("module-12");`),
  {
    code: `requireByHttp("module-12");`,
    meta: [
      {
        module: "module-12",
        type: "dynamic",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Dynamic import awaited",
  convertESMToCJSWithMeta(`(async()=>{await import("module-13");})();`),
  {
    code: `(async()=>{await requireByHttp("module-13");})();`,
    meta: [
      {
        module: "module-13",
        type: "dynamic",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Dynamic import with module attributes",
  JSON.stringify(
    convertESMToCJSWithMeta(`import("module-14", { with: { type: "css" } });`),
    null,
    2
  ),
  JSON.stringify(
    {
      code: `requireByHttp("module-14",{with:{type:"css"}});`,
      meta: [
        {
          module: "module-14",
          type: "dynamic",
          assertions: { type: "css" },
          literal: true,
          reason: null
        }
      ]
    },
    null,
    2
  )
);

runTest(
  "Dynamic import with custom options",
  convertESMToCJSWithMeta(`import("module-15", { namespace: "ExampleNS" });`),
  {
    code: `requireByHttp("module-15",{namespace:"ExampleNS"});`,
    meta: [
      {
        module: "module-15",
        type: "dynamic",
        assertions: { namespace: "ExampleNS" },
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Dynamic import with assert json",
  convertESMToCJSWithMeta(`import("./config.json", { assert: { type: "json" } });`),
  {
    code: `requireByHttp("./config.json",{assert:{type:"json"}});`,
    meta: [
      {
        module: "./config.json",
        type: "dynamic",
        assertions: { type: "json" },
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Dynamic import template literal",
  convertESMToCJSWithMeta(`import(\`https://example.com/module-17.js\`);`),
  {
    code: `requireByHttp(\`https://example.com/module-17.js\`);`,
    meta: [
      {
        module: "`https://example.com/module-17.js`",
        type: "dynamic",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Dynamic import single quote",
  convertESMToCJSWithMeta(`import('https://example.com/module-18.js');`),
  {
    code: `requireByHttp('https://example.com/module-18.js');`,
    meta: [
      {
        module: "https://example.com/module-18.js",
        type: "dynamic",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Dynamic import template literal + options",
  convertESMToCJSWithMeta(
    `const theme="light";import(\`./style-\${theme}.css\`,{with:{type:"css"}});`
  ),
  {
    code: `const theme="light";requireByHttp(\`./style-\${theme}.css\`,{with:{type:"css"}});`,
    meta: [
      {
        module: "`./style-${theme}.css`",
        type: "dynamic",
        assertions: { type: "css" },
        literal: false,
        reason: "template-literal"
      }
    ]
  }
);

runTest(
  "Chained dynamic import",
  convertESMToCJSWithMeta(`import("module-20").then(m=>console.log(m));`),
  {
    code: `requireByHttp("module-20").then(m=>console.log(m));`,
    meta: [
      {
        module: "module-20",
        type: "dynamic",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Dynamic import inside function expression",
  convertESMToCJSWithMeta(`export function getModule(){return import("module-21");}`),
  {
    code: `function getModule(){return requireByHttp("module-21");}exports.getModule=getModule;`,
    meta: [
      {
        module: "module-21",
        type: "dynamic",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

/* ============================================================
   3. RE-EXPORTS
   ============================================================ */

runTest(
  "Re-export all",
  convertESMToCJSWithMeta(`export * from "./module-22.js";`),
  {
    code: `Object.assign(exports,require("./module-22.js"));`,
    meta: [
      {
        module: "./module-22.js",
        type: "export",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Export named",
  convertESMToCJSWithMeta(`export { foo, bar } from "./module-23.js";`),
  {
    code: `exports.foo=require("./module-23.js").foo;exports.bar=require("./module-23.js").bar;`,
    meta: [
      {
        module: "./module-23.js",
        type: "export",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Export named alias",
  convertESMToCJSWithMeta(`export { baz as myBaz } from "./module-24.js";`),
  {
    code: `exports.myBaz=require("./module-24.js").baz;`,
    meta: [
      {
        module: "./module-24.js",
        type: "export",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Export default from source",
  convertESMToCJSWithMeta(`export { default as RemoteDefault } from "./module-25.js";`),
  {
    code: `exports.RemoteDefault=require("./module-25.js").default;`,
    meta: [
      {
        module: "./module-25.js",
        type: "export",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

runTest(
  "Export mixture",
  convertESMToCJSWithMeta(
    `export { default as MainComponent, helper } from "./components.js";`
  ),
  {
    code: `exports.MainComponent=require("./components.js").default;exports.helper=require("./components.js").helper;`,
    meta: [
      {
        module: "./components.js",
        type: "export",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  }
);

/* ============================================================
   4. RE-EXPORT NAMESPACE
   ============================================================ */

runTest(
  "Export namespace",
  convertESMToCJSWithMeta(`export * as utils from "./utils.js";`),
  {
    code: `exports.utils=require("./utils.js");`,
    meta: [
      {
        module: "./utils.js",
        type: "export",
        assertions: null,
        literal: true,
        reason: null
      }
    ]
  },
  true
);