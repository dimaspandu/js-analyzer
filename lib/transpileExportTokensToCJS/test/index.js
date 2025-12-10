import transpileExportTokensToCJS from "../main.js";
import runTest from "../../../utils/tester.js";

/* ============================================================================
 * 1. EXPORT VARIABLE DECLARATIONS
 * ============================================================================ */

runTest(
  "Export const assignment",
  transpileExportTokensToCJS([
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
  transpileExportTokensToCJS([
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
  transpileExportTokensToCJS([
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
  transpileExportTokensToCJS([
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
  transpileExportTokensToCJS([
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
  transpileExportTokensToCJS([
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
  transpileExportTokensToCJS([
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
  transpileExportTokensToCJS([
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
  transpileExportTokensToCJS([
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
  transpileExportTokensToCJS([
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
  ],
  true
);
