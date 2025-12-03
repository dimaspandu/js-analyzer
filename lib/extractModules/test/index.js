import extractModules from "../main.js";
import runTest from "../../../utils/tester.js";

/* ------------------------------------------------------
 * IMPORT TESTS
 * ------------------------------------------------------ */

runTest(
  "Import - default",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "identifier", value: "DefaultExport" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"mod"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "mod",
    type: "static",
    assertions: null,
    literal: true,
    reason: null
  }]
);

runTest(
  "Import - namespace",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "NS" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"pkg"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "pkg",
    type: "static",
    assertions: null,
    literal: true,
    reason: null
  }]
);

runTest(
  "Import - named",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "foo" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "bar" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"lib"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "lib",
    type: "static",
    assertions: null,
    literal: true,
    reason: null
  }]
);

runTest(
  "Import - dynamic string",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "string", value: '"dyn"' },
    { type: "punctuator", value: ")" },
  ]),
  [{
    module: "dyn",
    type: "dynamic",
    assertions: null,
    literal: true,
    reason: null
  }]
);

runTest(
  "Import - dynamic template literal",
  extractModules([
    { type: "keyword", value: "import" },
    { type: "punctuator", value: "(" },
    { type: "template_chunk", value: "`mod-${x}`" },
    { type: "punctuator", value: ")" },
  ]),
  [{
    module: "`mod-${x}`",
    type: "dynamic",
    assertions: null,
    literal: false,
    reason: "template-literal"
  }]
);


/* ------------------------------------------------------
 * EXPORT-FROM TESTS
 * ------------------------------------------------------ */

runTest(
  "Export * from module",
  extractModules([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "*" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./mod1.js"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "./mod1.js",
    type: "export",
    assertions: null,
    literal: true,
    reason: null
  }]
);

runTest(
  "Export named from module",
  extractModules([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "foo" },
    { type: "punctuator", value: "," },
    { type: "identifier", value: "bar" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./mod2.js"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "./mod2.js",
    type: "export",
    assertions: null,
    literal: true,
    reason: null
  }]
);

runTest(
  "Export named alias from module",
  extractModules([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "identifier", value: "baz" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "myBaz" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./mod3.js"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "./mod3.js",
    type: "export",
    assertions: null,
    literal: true,
    reason: null
  }]
);

runTest(
  "Export default as alias from module",
  extractModules([
    { type: "keyword", value: "export" },
    { type: "punctuator", value: "{" },
    { type: "keyword", value: "default" },
    { type: "identifier", value: "as" },
    { type: "identifier", value: "RemoteDefault" },
    { type: "punctuator", value: "}" },
    { type: "identifier", value: "from" },
    { type: "string", value: '"./mod4.js"' },
    { type: "punctuator", value: ";" }
  ]),
  [{
    module: "./mod4.js",
    type: "export",
    assertions: null,
    literal: true,
    reason: null
  }]
);

runTest(
  "Export mixed default + named from module",
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

runTest(
  "Export * as alias from module",
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


/* ------------------------------------------------------
 * FINAL OUTPUT
 * ------------------------------------------------------ */
runTest("FINAL SUMMARY", [], [], true);
